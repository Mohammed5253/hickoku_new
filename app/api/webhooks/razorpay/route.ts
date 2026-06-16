import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { orderRepository } from "@/lib/repositories/orderRepository";
import { updateStock } from "@/app/repositories/products.repository";

export async function POST(request: NextRequest) {
    try {
        const payload = await request.text();
        const signature = request.headers.get("x-razorpay-signature");
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!signature || !secret) {
            console.error("Missing signature or webhook secret");
            return NextResponse.json({ error: "Configuration error" }, { status: 400 });
        }

        // Verify signature
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(payload)
            .digest("hex");

        if (expectedSignature !== signature) {
            console.error("Invalid webhook signature");
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }

        const data = JSON.parse(payload);
        
        // We only care about order.paid or payment.captured
        if (data.event !== "order.paid") {
            return NextResponse.json({ status: "ignored" });
        }

        // Extract Razorpay IDs
        const razorpayOrderId = data.payload.order.entity.id;
        const razorpayPaymentId = data.payload.payment.entity.id;
        
        // Extract our internal orderId (passed via receipt during order creation)
        const orderId = data.payload.order.entity.receipt;

        if (!orderId) {
            console.error("Order ID not found in webhook payload receipt");
            return NextResponse.json({ error: "Order ID missing" }, { status: 400 });
        }

        const order = await orderRepository.getOrder(orderId);

        if (!order) {
            console.error(`Order ${orderId} not found`);
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // If already paid (handled by client-side verification), ignore
        if (order.paymentStatus === "paid") {
            console.log(`Order ${orderId} already marked as paid. Ignoring webhook.`);
            return NextResponse.json({ status: "already_processed" });
        }

        console.log(`Processing webhook for Order ${orderId}`);

        // Update Payment Details
        const now = new Date().toISOString();
        await orderRepository.updatePaymentDetails(orderId, {
            razorpayPaymentId: razorpayPaymentId,
            razorpaySignature: "webhook_verified", // We don't have the client signature here, but webhook is verified
            paymentStatus: "paid",
            status: "confirmed",
            paidAt: now,
            confirmedAt: now,
        });

        // Deduct Stock
        if (order.items) {
            for (const item of order.items) {
                try {
                    if (item.variantId) {
                        await updateStock(item.variantId, item.quantity);
                    } else {
                        console.warn(`Skipping stock update for item ${item.sku} - no variantId`);
                    }
                } catch (error) {
                    console.error(`Failed to update stock for variant ${item.variantId}:`, error);
                }
            }
        }

        // Trigger Background Tasks (Delhivery Sync & Email)
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        
        // Execute sync first, then email (so AWB is captured)
        // We use an async IIFE so we don't block the webhook response to Razorpay
        (async () => {
            try {
                await fetch(`${appUrl}/api/orders/delhivery-sync`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderId }),
                });
                
                await fetch(`${appUrl}/api/orders/send-email`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderId }),
                });
            } catch (e) {
                console.error("Webhook: Background tasks failed", e);
            }
        })();

        return NextResponse.json({ success: true, orderId });
    } catch (error: any) {
        console.error("Webhook processing error:", error);
        return NextResponse.json(
            { error: "Webhook processing failed", details: error.message },
            { status: 500 }
        );
    }
}

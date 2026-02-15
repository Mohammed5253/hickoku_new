
import { NextRequest, NextResponse } from "next/server";
import { orderRepository } from "@/lib/repositories/orderRepository";
import { updateStock } from "@/app/repositories/products.repository";
import crypto from "crypto";

interface VerifyPaymentRequest {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: VerifyPaymentRequest = await request.json();

        // Validate required fields
        if (!body.orderId || !body.razorpayOrderId || !body.razorpayPaymentId || !body.razorpaySignature) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Verify signature
        const secret = process.env.RAZORPAY_KEY_SECRET!;
        const generatedSignature = crypto
            .createHmac("sha256", secret)
            .update(`${body.razorpayOrderId}|${body.razorpayPaymentId}`)
            .digest("hex");

        if (generatedSignature !== body.razorpaySignature) {
            // Payment verification failed
            await orderRepository.updatePaymentDetails(body.orderId, {
                razorpayPaymentId: body.razorpayPaymentId,
                razorpaySignature: body.razorpaySignature,
                paymentStatus: "failed",
                status: "failed",
            });

            return NextResponse.json(
                { success: false, error: "Invalid payment signature" },
                { status: 400 }
            );
        }

        // Payment verified successfully
        const now = new Date().toISOString();
        await orderRepository.updatePaymentDetails(body.orderId, {
            razorpayPaymentId: body.razorpayPaymentId,
            razorpaySignature: body.razorpaySignature,
            paymentStatus: "paid",
            status: "confirmed",
            paidAt: now,
            confirmedAt: now,
        });

        // Get updated order to process items
        const order = await orderRepository.getOrder(body.orderId);

        // Deduct Stock
        if (order && order.items) {
            for (const item of order.items) {
                try {
                    if (item.variantId) {
                        await updateStock(item.variantId, item.quantity);
                    } else {
                        console.warn(`Skipping stock update for item ${item.sku} - no variantId`);
                    }
                } catch (error) {
                    console.error(`Failed to update stock for variant ${item.variantId}:`, error);
                    // Continue with other items, don't fail the request.
                    // Ideally we should alert admin or flag the order.
                }
            }
        }

        return NextResponse.json({
            success: true,
            order,
        });
    } catch (error: any) {
        console.error("Error verifying payment:", error);
        return NextResponse.json(
            { error: "Failed to verify payment", details: error.message },
            { status: 500 }
        );
    }
}

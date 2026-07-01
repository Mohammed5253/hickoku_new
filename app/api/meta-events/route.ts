import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const API_VERSION = "v19.0";

function hashValue(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function getClientIPAddress(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || null;
}

export async function POST(request: NextRequest) {
  if (process.env.APP_ENV !== "prod") {
    return NextResponse.json({ skipped: true, reason: "not prod" }, { status: 200 });
  }

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    return NextResponse.json(
      { error: "Missing META_CAPI_ACCESS_TOKEN or NEXT_PUBLIC_FACEBOOK_PIXEL_ID" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const {
      eventName,
      eventSourceUrl,
      userData = {},
      customData = {},
      eventId,
    } = body;

    if (!eventName) {
      return NextResponse.json({ error: "eventName is required" }, { status: 400 });
    }

    const clientIP = getClientIPAddress(request);
    const userAgent = request.headers.get("user-agent") || undefined;

    // Build hashed user data (PII must be hashed with SHA-256)
    const hashedUserData: Record<string, string | undefined> = {
      client_ip_address: clientIP || undefined,
      client_user_agent: userAgent,
    };

    if (userData.email) hashedUserData.em = hashValue(userData.email);
    if (userData.phone) hashedUserData.ph = hashValue(userData.phone.replace(/\D/g, ""));
    if (userData.firstName) hashedUserData.fn = hashValue(userData.firstName);
    if (userData.lastName) hashedUserData.ln = hashValue(userData.lastName);
    if (userData.city) hashedUserData.ct = hashValue(userData.city);
    if (userData.state) hashedUserData.st = hashValue(userData.state);
    if (userData.zip) hashedUserData.zp = hashValue(userData.zip);
    if (userData.country) hashedUserData.country = hashValue(userData.country);
    if (userData.fbc) hashedUserData.fbc = userData.fbc;   // already hashed by FB
    if (userData.fbp) hashedUserData.fbp = userData.fbp;   // already hashed by FB

    const eventPayload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId || crypto.randomUUID(),
          event_source_url: eventSourceUrl,
          action_source: "website",
          user_data: hashedUserData,
          custom_data: customData,
        },
      ],
      // Use test_event_code when provided (for Meta Test Events panel)
      ...(body.testEventCode && { test_event_code: body.testEventCode }),
    };

    const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;

    const fbResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventPayload),
    });

    const fbData = await fbResponse.json();

    if (!fbResponse.ok) {
      console.error("[Meta CAPI] Error from Facebook:", fbData);
      return NextResponse.json({ error: fbData }, { status: 502 });
    }

    return NextResponse.json({ success: true, result: fbData }, { status: 200 });
  } catch (error) {
    console.error("[Meta CAPI] Unexpected error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

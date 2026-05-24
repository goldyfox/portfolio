import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600000 });
    return true;
  }

  if (entry.count >= 3) return false;

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, honeypot, timezone, screenResolution, timeOnPage } = body;

    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    if (timeOnPage && Number(timeOnPage) < 3) {
      return NextResponse.json({ success: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const referer = request.headers.get("referer") || "direct";
    const acceptLanguage = request.headers.get("accept-language") || "unknown";
    const timestamp = new Date().toISOString();

    if (!getRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Try again later." },
        { status: 429 }
      );
    }

    const metadataBlock = [
      `--- SENDER METADATA ---`,
      `IP Address: ${ip}`,
      `User-Agent: ${userAgent}`,
      `Referer: ${referer}`,
      `Accept-Language: ${acceptLanguage}`,
      `Timezone: ${timezone || "unknown"}`,
      `Screen: ${screenResolution || "unknown"}`,
      `Time on page: ${timeOnPage || "unknown"}s`,
      `Submitted: ${timestamp}`,
    ].join("\n");

    const emailBody = [
      `--- MESSAGE ---`,
      `Name: ${name}`,
      `Email: ${email}`,
      ``,
      message,
      ``,
      metadataBlock,
    ].join("\n");

    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "lisa.aufox@gmail.com",
      subject: `[Portfolio Contact] ${name}`,
      text: emailBody,
      replyTo: email,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

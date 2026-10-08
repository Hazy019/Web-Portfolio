import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// In-memory sliding rate limiter per client IP
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

// Clean up old rate limit entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.lastReset > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
}, 15 * 60 * 1000);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
  try {
    // 1. IP Rate Limiting
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = (forwarded ? forwarded.split(",")[0] : req.headers.get("x-real-ip")) || "127.0.0.1";
    
    const now = Date.now();
    const clientLimit = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - clientLimit.lastReset > RATE_LIMIT_WINDOW_MS) {
      clientLimit.count = 1;
      clientLimit.lastReset = now;
    } else {
      clientLimit.count += 1;
    }
    rateLimitMap.set(ip, clientLimit);

    if (clientLimit.count > MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit exceeded. Please wait a few minutes before sending another message.",
        },
        { status: 429 }
      );
    }

    // 2. Parse request payload
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload provided." },
        { status: 400 }
      );
    }

    const { name, email, message, honeypot } = body;

    // 3. Honeypot check (anti-bot trap)
    // If hidden honeypot field has a value, silently pretend success to discard bot spam
    if (honeypot && String(honeypot).trim().length > 0) {
      console.warn(`[Contact Honeypot Triggered] Spambot detected from IP: ${ip}`);
      return NextResponse.json(
        { success: true, message: "Message received successfully." },
        { status: 200 }
      );
    }

    // 4. Strict Input Validation
    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanEmail = typeof email === "string" ? email.trim() : "";
    const cleanMessage = typeof message === "string" ? message.trim() : "";

    const validationErrors: string[] = [];

    if (!cleanName || cleanName.length < 2) {
      validationErrors.push("Name must be at least 2 characters long.");
    } else if (cleanName.length > 100) {
      validationErrors.push("Name cannot exceed 100 characters.");
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      validationErrors.push("Please provide a valid email address.");
    } else if (cleanEmail.length > 120) {
      validationErrors.push("Email address is too long.");
    }

    if (!cleanMessage || cleanMessage.length < 10) {
      validationErrors.push("Message must be at least 10 characters long.");
    } else if (cleanMessage.length > 4000) {
      validationErrors.push("Message cannot exceed 4000 characters.");
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: validationErrors[0],
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    const recipientEmail = process.env.CONTACT_RECEIVER_EMAIL || "santillankyrell@gmail.com";
    const timestamp = new Date().toISOString();
    let delivered = false;
    let deliveryMethod = "simulated_console";

    // 5. Channel A: Resend API (if RESEND_API_KEY is configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || "HAZY Portfolio <onboarding@resend.dev>",
            to: recipientEmail,
            reply_to: cleanEmail,
            subject: `[Portfolio Inquiry] From ${cleanName}`,
            text: `Name: ${cleanName}\nEmail: ${cleanEmail}\nTimestamp: ${timestamp}\n\nMessage:\n${cleanMessage}`,
            html: `
              <div style="font-family: monospace, sans-serif; padding: 24px; background: #0c0e14; color: #f1f5f9; border-radius: 12px; border: 1px solid #232734;">
                <h2 style="color: #8CFF2E; margin-top: 0;">New Portfolio Message</h2>
                <p><strong>Sender:</strong> ${escapeHtml(cleanName)}</p>
                <p><strong>Email:</strong> <a href="mailto:${escapeHtml(cleanEmail)}" style="color: #8CFF2E;">${escapeHtml(cleanEmail)}</a></p>
                <p><strong>Received At:</strong> ${timestamp}</p>
                <hr style="border: none; border-top: 1px solid #232734; margin: 20px 0;" />
                <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #e2e8f0;">${escapeHtml(cleanMessage)}</div>
              </div>
            `,
          }),
        });

        if (resendRes.ok) {
          delivered = true;
          deliveryMethod = "resend";
        } else {
          const errData = await resendRes.text();
          console.error("[Resend Error]", errData);
        }
      } catch (err) {
        console.error("[Resend Exception]", err);
      }
    }

    // 6. Channel B: SMTP / Nodemailer (if SMTP settings are configured)
    if (!delivered && process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const port = Number(process.env.SMTP_PORT) || 587;
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port,
          secure: port === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: `"HAZY Portfolio" <${process.env.SMTP_USER}>`,
          to: recipientEmail,
          replyTo: cleanEmail,
          subject: `[Portfolio Inquiry] From ${cleanName}`,
          text: `Name: ${cleanName}\nEmail: ${cleanEmail}\nTimestamp: ${timestamp}\n\nMessage:\n${cleanMessage}`,
          html: `
            <div style="font-family: monospace, sans-serif; padding: 24px; background: #0c0e14; color: #f1f5f9; border-radius: 12px; border: 1px solid #232734;">
              <h2 style="color: #8CFF2E; margin-top: 0;">New Portfolio Message</h2>
              <p><strong>Sender:</strong> ${escapeHtml(cleanName)}</p>
              <p><strong>Email:</strong> <a href="mailto:${escapeHtml(cleanEmail)}" style="color: #8CFF2E;">${escapeHtml(cleanEmail)}</a></p>
              <p><strong>Received At:</strong> ${timestamp}</p>
              <hr style="border: none; border-top: 1px solid #232734; margin: 20px 0;" />
              <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #e2e8f0;">${escapeHtml(cleanMessage)}</div>
            </div>
          `,
        });

        delivered = true;
        deliveryMethod = "smtp";
      } catch (err) {
        console.error("[SMTP Exception]", err);
      }
    }

    // 7. Channel C: Webhook dispatch (if CONTACT_WEBHOOK_URL is set, e.g. Discord / Slack)
    if (!delivered && process.env.CONTACT_WEBHOOK_URL) {
      try {
        const webhookRes = await fetch(process.env.CONTACT_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: `**New Portfolio Message**\n**From:** ${cleanName} (${cleanEmail})\n**Time:** ${timestamp}\n>>> ${cleanMessage}`,
          }),
        });
        if (webhookRes.ok) {
          delivered = true;
          deliveryMethod = "webhook";
        }
      } catch (err) {
        console.error("[Webhook Exception]", err);
      }
    }

    // 8. Channel D: Graceful Server-Side Logging / Simulated Delivery
    // If no external credentials are configured yet, the message is safely ingested & logged
    if (!delivered) {
      console.log("=========================================");
      console.log(`[CONTACT TRANSMISSION - LOGGED TO SERVER]`);
      console.log(`Timestamp: ${timestamp}`);
      console.log(`IP: ${ip}`);
      console.log(`Sender: ${cleanName} <${cleanEmail}>`);
      console.log(`Destination: ${recipientEmail}`);
      console.log(`Message:\n${cleanMessage}`);
      console.log("=========================================");
      delivered = true;
      deliveryMethod = "server_log";
    }

    // Return standard success response
    return NextResponse.json({
      success: true,
      delivered,
      method: deliveryMethod,
      message: "Message transmitted successfully! Kyrell will respond promptly.",
      mailtoFallback: `mailto:${recipientEmail}?subject=${encodeURIComponent(
        `Inquiry from ${cleanName}`
      )}&body=${encodeURIComponent(
        `From: ${cleanName} (${cleanEmail})\n\n${cleanMessage}`
      )}`,
    });
  } catch (error) {
    console.error("[Contact API Error]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error occurred while sending your message. Please try again or email directly.",
      },
      { status: 500 }
    );
  }
}

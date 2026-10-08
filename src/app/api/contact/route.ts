import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// In-memory sliding rate limiter per client IP
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 6;

// Periodic memory purge
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

    // 3. Anti-Spam Honeypot
    if (honeypot && String(honeypot).trim().length > 0) {
      console.warn(`[Anti-Spam] Bot submission dropped silently from IP: ${ip}`);
      return NextResponse.json(
        { success: true, message: "Message received." },
        { status: 200 }
      );
    }

    // 4. Strict Validation
    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanEmail = typeof email === "string" ? email.trim() : "";
    const cleanMessage = typeof message === "string" ? message.trim() : "";

    const validationErrors: string[] = [];

    if (!cleanName || cleanName.length < 2) {
      validationErrors.push("Name must be at least 2 characters.");
    } else if (cleanName.length > 100) {
      validationErrors.push("Name cannot exceed 100 characters.");
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      validationErrors.push("Please provide a valid email address.");
    }

    if (!cleanMessage || cleanMessage.length < 10) {
      validationErrors.push("Message must be at least 10 characters.");
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
    let deliveryMethod = "none";

    // 5. THIRD-PARTY DISPATCH CHANNEL 1: Web3Forms API
    const web3Key = process.env.WEB3FORMS_ACCESS_KEY || process.env.WEB3FORMS_KEY;
    if (!delivered && web3Key) {
      try {
        const w3Res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: web3Key,
            name: cleanName,
            email: cleanEmail,
            message: cleanMessage,
            from_name: "HAZY Portfolio Inquiries",
            subject: `[Portfolio Inquiry] From ${cleanName}`,
          }),
        });

        const w3Data = await w3Res.json().catch(() => null);
        if (w3Res.ok && w3Data?.success) {
          delivered = true;
          deliveryMethod = "web3forms";
          console.log(`[Contact API] Delivered to ${recipientEmail} via Web3Forms.`);
        } else {
          console.error("[Web3Forms Error]", w3Data);
        }
      } catch (err) {
        console.error("[Web3Forms Exception]", err);
      }
    }

    // 6. THIRD-PARTY DISPATCH CHANNEL 2: Formspree
    const formspreeUrl = process.env.FORMSPREE_ENDPOINT || (process.env.FORMSPREE_ID ? `https://formspree.io/f/${process.env.FORMSPREE_ID}` : null);
    if (!delivered && formspreeUrl) {
      try {
        const fsRes = await fetch(formspreeUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            message: cleanMessage,
            _subject: `[Portfolio Inquiry] From ${cleanName}`,
          }),
        });
        if (fsRes.ok) {
          delivered = true;
          deliveryMethod = "formspree";
          console.log(`[Contact API] Delivered to ${recipientEmail} via Formspree.`);
        }
      } catch (err) {
        console.error("[Formspree Exception]", err);
      }
    }

    // 7. THIRD-PARTY DISPATCH CHANNEL 3: Resend API
    if (!delivered && process.env.RESEND_API_KEY) {
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
          console.log(`[Contact API] Delivered to ${recipientEmail} via Resend.`);
        }
      } catch (err) {
        console.error("[Resend Exception]", err);
      }
    }

    // 8. THIRD-PARTY DISPATCH CHANNEL 4: SMTP / Nodemailer
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
        console.log(`[Contact API] Delivered to ${recipientEmail} via SMTP.`);
      } catch (err) {
        console.error("[SMTP Exception]", err);
      }
    }

    // 9. THIRD-PARTY DISPATCH CHANNEL 5: Webhook (Discord / Slack)
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
          console.log(`[Contact API] Delivered via Webhook.`);
        }
      } catch (err) {
        console.error("[Webhook Exception]", err);
      }
    }

    // Pre-calculated URLs for direct transmission (100% deliverability guarantee)
    const encodedSubject = encodeURIComponent(`[Portfolio Inquiry] From ${cleanName}`);
    const encodedBody = encodeURIComponent(
      `Name: ${cleanName}\nEmail: ${cleanEmail}\nTimestamp: ${timestamp}\n\nMessage:\n${cleanMessage}`
    );

    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      recipientEmail
    )}&su=${encodedSubject}&body=${encodedBody}`;

    const mailtoUrl = `mailto:${encodeURIComponent(
      recipientEmail
    )}?subject=${encodedSubject}&body=${encodedBody}`;

    // If delivered via a third-party provider:
    if (delivered) {
      return NextResponse.json({
        success: true,
        delivered: true,
        method: deliveryMethod,
        message: "Message successfully transmitted directly to Kyrell's inbox!",
        gmailWebUrl,
        mailtoUrl,
      });
    }

    // If NO third-party provider is configured in environment variables:
    console.warn(
      `[Contact Warning] No third-party email provider active in .env (WEB3FORMS_ACCESS_KEY, FORMSPREE_ENDPOINT, RESEND_API_KEY, or SMTP_*). Providing direct client webmail dispatch.`
    );

    return NextResponse.json({
      success: true,
      delivered: false,
      requiresDirectSend: true,
      method: "direct_webmail",
      message:
        "Message formatted! No automated third-party API key is configured yet. Click 'Transmit via Gmail' or 'Mail App' below to send with one click.",
      gmailWebUrl,
      mailtoUrl,
    });
  } catch (error) {
    console.error("[Contact API Error]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server encountered an error while processing transmission.",
      },
      { status: 500 }
    );
  }
}

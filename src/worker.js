const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function normalizeText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function isValidEmail(email) {
  return email.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(email);
}

function parseNotifyEmails(value, fallback) {
  const raw = typeof value === "string" && value.trim() ? value : fallback;
  const emails = raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return [...new Set(emails.filter(isValidEmail))];
}

async function hashIp(ip) {
  if (!ip) return null;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function sendAdminNotification(env, signup) {
  const notifyEmails = parseNotifyEmails(env.NEWSLETTER_NOTIFY_EMAIL, "events@yasalaser.com");
  if (notifyEmails.length === 0) {
    throw new Error("notification_not_configured");
  }

  const fromEmail = env.NEWSLETTER_FROM_EMAIL || "noreply@innovateconference.ca";
  const siteUrl = env.SITE_URL || "https://innovateconference.ca";

  const text = [
    "New Innovate newsletter signup",
    "",
    `First name: ${signup.firstName}`,
    `Last name: ${signup.lastName}`,
    `Email: ${signup.email}`,
    `Submitted: ${signup.createdAt}`,
    "",
    `Site: ${siteUrl}`,
  ].join("\n");

  const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      personalizations: [
        {
          to: notifyEmails.map((email) => ({ email, name: "Innovate Admin" })),
        },
      ],
      from: { email: fromEmail, name: "Innovate Website" },
      reply_to: { email: signup.email, name: `${signup.firstName} ${signup.lastName}` },
      subject: "Innovate newsletter signup",
      content: [{ type: "text/plain", value: text }],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("MailChannels notification failed", response.status, detail);
    throw new Error("notification_failed");
  }
}

async function handleNewsletterSignup(request, env) {
  if (!env.DB) {
    return jsonResponse({ message: "Newsletter signup is not configured yet." }, 503);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ message: "Invalid request body." }, 400);
  }

  const firstName = normalizeText(payload.firstName, MAX_NAME_LENGTH);
  const lastName = normalizeText(payload.lastName, MAX_NAME_LENGTH);
  const email = normalizeText(payload.email, MAX_EMAIL_LENGTH).toLowerCase();

  if (!firstName || !lastName || !email) {
    return jsonResponse({ message: "Please complete all fields." }, 400);
  }

  if (!isValidEmail(email)) {
    return jsonResponse({ message: "Please enter a valid email address." }, 400);
  }

  const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "";
  const ipHash = await hashIp(ip.split(",")[0].trim());
  const createdAt = new Date().toISOString();

  try {
    await env.DB.prepare(
      "INSERT INTO newsletter_signups (first_name, last_name, email, created_at, ip_hash) VALUES (?1, ?2, ?3, ?4, ?5)",
    )
      .bind(firstName, lastName, email, createdAt, ipHash)
      .run();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("UNIQUE constraint failed")) {
      return jsonResponse({ message: "That email address is already on the list." }, 409);
    }
    console.error("Newsletter insert failed", error);
    return jsonResponse({ message: "Unable to save your signup. Please try again." }, 500);
  }

  try {
    await sendAdminNotification(env, { firstName, lastName, email, createdAt });
  } catch {
    return jsonResponse(
      {
        message:
          "Your signup was saved, but we could not notify the team by email. Please contact us if you do not hear back.",
      },
      502,
    );
  }

  return jsonResponse({ ok: true }, 201);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/newsletter") {
      if (request.method === "POST") {
        return handleNewsletterSignup(request, env);
      }

      return jsonResponse({ message: "Method not allowed." }, 405);
    }

    return env.ASSETS.fetch(request);
  },
};

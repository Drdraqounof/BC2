import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

function readRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function buildTransport() {
  const user = readRequiredEnv("SMTP_USER");
  const pass = readRequiredEnv("SMTP_PASS");

  const configuredHost = process.env.SMTP_HOST?.trim();
  const configuredPort = process.env.SMTP_PORT?.trim();
  const configuredSecure = process.env.SMTP_SECURE?.trim();

  const isGmail = user.toLowerCase().endsWith("@gmail.com");
  const host = configuredHost || (isGmail ? "smtp.gmail.com" : "");
  const portValue = configuredPort || (isGmail ? "587" : "");

  if (!host) {
    throw new Error("Missing required environment variable: SMTP_HOST");
  }

  if (!portValue) {
    throw new Error("Missing required environment variable: SMTP_PORT");
  }

  const secure = configuredSecure === undefined
    ? false
    : configuredSecure === "true";
  const port = Number(portValue);

  if (Number.isNaN(port)) {
    throw new Error("SMTP_PORT must be a valid number");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

function resolveFromEmail() {
  return process.env.SMTP_FROM_EMAIL?.trim() || readRequiredEnv("SMTP_USER");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const to = typeof body?.to === "string" ? body.to.trim() : "";
    const subject = typeof body?.subject === "string" ? body.subject.trim() : "";
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const teacherName = typeof body?.teacherName === "string" ? body.teacherName.trim() : "";
    const teacherEmail = typeof body?.teacherEmail === "string" ? body.teacherEmail.trim() : "";

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, and message are required." },
        { status: 400 }
      );
    }

    const fromEmail = resolveFromEmail();
    const fromName = process.env.SMTP_FROM_NAME?.trim() || teacherName || "EduPanel";
    const transporter = buildTransport();

    await transporter.sendMail({
      from: `${fromName} <${fromEmail}>`,
      to,
      replyTo: teacherEmail || fromEmail,
      subject,
      text: message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);

    const message = error instanceof Error ? error.message : "Failed to send email";
    const status = message.startsWith("Missing required environment variable") || message.includes("SMTP_PORT")
      ? 500
      : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
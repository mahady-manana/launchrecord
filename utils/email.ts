import nodemailer from "nodemailer";
import { env } from "@/utils/env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: Number(env.SMTP_PORT) === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

interface PasswordResetEmailOptions {
  to: string;
  name: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
}: PasswordResetEmailOptions) {
  const subject = "Reset your password";
  const text = `Hi ${name},\n\nUse this link to reset your password: ${resetUrl}\n\nIf you did not request a reset, you can ignore this email.`;
  const html = `
    <p>Hi ${name},</p>
    <p>Use this link to reset your password:</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>If you did not request a reset, you can ignore this email.</p>
  `;

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  });
}

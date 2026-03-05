import { SES } from "@aws-sdk/client-ses";

export const ses = new SES({
  accessKeyId: process.env.AWS_ACCESS_ID_EMAIL as string,
  secretAccessKey: process.env.AWS_SECRET_KEY_EMAIL,
  region: "us-east-1",
});

const VERIFICATION_EMAIL_FROM =
  process.env.EMAIL_FROM || "noreply@founderego.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://founderego.com";

export async function sendVerificationEmail(
  email: string,
  verificationToken: string,
  userName: string,
): Promise<void> {
  const verificationUrl = `${APP_URL}/verify-email?token=${verificationToken}`;

  const params = {
    Source: VERIFICATION_EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: "Verify Your Email - Founderego",
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 40px 20px;">
                      <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <tr>
                          <td style="padding: 40px 32px;">
                            <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #1f2937;">Welcome to Founderego, ${userName}!</h1>
                            <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5; color: #4b5563;">
                              Thanks for signing up. To complete your registration and start analyzing your SaaS defensibility, please verify your email address.
                            </p>
                            <table role="presentation" style="margin: 24px 0;">
                              <tr>
                                <td style="border-radius: 6px; background-color: #2563eb;">
                                  <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px;">
                                    Verify Email Address
                                  </a>
                                </td>
                              </tr>
                            </table>
                            <p style="margin: 0 0 8px; font-size: 14px; color: #6b7280;">
                              Or copy and paste this link into your browser:
                            </p>
                            <p style="margin: 0 0 24px; font-size: 14px; color: #2563eb; word-break: break-all;">
                              ${verificationUrl}
                            </p>
                            <p style="margin: 0; font-size: 14px; color: #9ca3af;">
                              This link will expire in 24 hours.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 24px 32px; border-top: 1px solid #e5e7eb; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
                            <p style="margin: 0; font-size: 14px; color: #6b7280;">
                              © ${new Date().getFullYear()} Founderego. All rights reserved.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
          `,
        },
        Text: {
          Charset: "UTF-8",
          Data: `
Welcome to Founderego, ${userName}!

Thanks for signing up. To complete your registration, please verify your email address by visiting this link:

${verificationUrl}

This link will expire in 24 hours.

© ${new Date().getFullYear()} Founderego. All rights reserved.
          `.trim(),
        },
      },
    },
  };

  await ses.sendEmail(params);
}

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  userName: string,
): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password?token=${resetToken}`;

  const params = {
    Source: VERIFICATION_EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: "Reset Your Password - Founderego",
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8">
              </head>
              <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 40px 20px;">
                      <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <tr>
                          <td style="padding: 40px 32px;">
                            <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 700; color: #1f2937;">Password Reset Request</h1>
                            <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5; color: #4b5563;">
                              Hi ${userName}, you requested to reset your password. Click the button below to proceed.
                            </p>
                            <table role="presentation" style="margin: 24px 0;">
                              <tr>
                                <td style="border-radius: 6px; background-color: #dc2626;">
                                  <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px;">
                                    Reset Password
                                  </a>
                                </td>
                              </tr>
                            </table>
                            <p style="margin: 0; font-size: 14px; color: #9ca3af;">
                              This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
          `,
        },
        Text: {
          Charset: "UTF-8",
          Data: `
Password Reset Request

Hi ${userName}, you requested to reset your password. Visit this link to proceed:

${resetUrl}

This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
          `.trim(),
        },
      },
    },
  };

  await ses.sendEmail(params);
}

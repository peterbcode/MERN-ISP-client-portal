import { Resend } from 'resend';

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendPasswordResetEmail(email, resetToken) {
  try {
    const resend = getResendClient();
    if (!resend) {
      return { success: false, error: 'Email service not configured. Missing RESEND_API_KEY.' };
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: [email],
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You requested a password reset for your account. Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #f97316; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Reset Password
          </a>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p><strong>Note:</strong> This link will expire in 10 minutes for security reasons.</p>
          <p>If you didn't request this password reset, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
          <p style="color: #666; font-size: 14px;">Best regards,<br>The ISP Portal Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: error.message };
  }
}

export async function sendWelcomeEmail(email, firstName) {
  try {
    const resend = getResendClient();
    if (!resend) {
      return { success: false, error: 'Email service not configured. Missing RESEND_API_KEY.' };
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: [email],
      subject: 'Welcome to ISP Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to ISP Portal!</h2>
          <p>Hello ${firstName || 'there'},</p>
          <p>Thank you for registering with ISP Portal. Your account has been successfully created.</p>
          <p>You can now:</p>
          <ul>
            <li>Manage your account settings</li>
            <li>View your service details</li>
            <li>Access customer support</li>
          </ul>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login" style="display: inline-block; padding: 12px 24px; background-color: #f97316; color: white; text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Login to Your Account
          </a>
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;">
          <p style="color: #666; font-size: 14px;">Best regards,<br>The ISP Portal Team</p>
        </div>
      `,
    });

    if (error) {
      console.error('Welcome email send error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Welcome email service error:', error);
    return { success: false, error: error.message };
  }
}

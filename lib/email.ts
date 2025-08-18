import { Resend } from 'resend';
import { render } from '@react-email/render';
import VerificationEmail from '../emails/verification-email';
import PasswordResetEmail from '../emails/password-reset-email';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is not set');
}

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM_ADDRESS || 'noreply@example.com';
const FROM_NAME = process.env.EMAIL_FROM_NAME || 'MC Diamondz';

interface SendVerificationEmailParams {
  email: string;
  username: string;
  token: string;
}

interface SendPasswordResetEmailParams {
  email: string;
  username: string;
  token: string;
  expiresInHours?: number;
}

export async function sendVerificationEmail({
  email,
  username,
  token,
}: SendVerificationEmailParams) {
  try {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}`;
    
    const emailHtml = render(
      <VerificationEmail
        username={username}
        verificationUrl={verificationUrl}
      />
    );

    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: 'Verify your email address',
      html: emailHtml,
    });

    if (error) {
      console.error('Failed to send verification email:', error);
      throw new Error('Failed to send verification email');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Error sending verification email');
  }
}

export async function sendPasswordResetEmail({
  email,
  username,
  token,
  expiresInHours = 1,
}: SendPasswordResetEmailParams) {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
    
    const emailHtml = render(
      <PasswordResetEmail
        username={username}
        resetUrl={resetUrl}
        expiresInHours={expiresInHours}
      />
    );

    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: 'Reset your MC Diamondz password',
      html: emailHtml,
    });

    if (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Error sending password reset email');
  }
}

// Utility function to generate a secure token
export function generateVerificationToken() {
  return require('crypto').randomBytes(32).toString('hex');
}

// Utility function to generate token expiration (default: 24 hours from now)
export function getTokenExpiry(hours = 24) {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + hours);
  return expiry;
}

import { Resend } from 'resend';
import { render } from '@react-email/render';
import React from 'react';
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

type EmailResponse = {
  success: boolean;
  data?: any;
  error?: Error;
};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RESEND_API_KEY: string;
      EMAIL_FROM_ADDRESS?: string;
      EMAIL_FROM_NAME?: string;
      NEXTAUTH_URL: string;
    }
  }
}

export async function sendVerificationEmail({
  email,
  username,
  token,
}: SendVerificationEmailParams): Promise<EmailResponse> {
  try {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;
    const emailHtml = await render(
      <VerificationEmail verificationLink={verificationUrl} />
    );

    const { data, error } = await resend.emails.send({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
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
    console.error('Error in sendVerificationEmail:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail({
  email,
  username,
  token,
  expiresInHours = 24,
}: SendPasswordResetEmailParams): Promise<EmailResponse> {
  try {
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
    const emailHtml = await render(
      <PasswordResetEmail 
        username={username} 
        resetUrl={resetUrl}
        expiresInHours={expiresInHours}
      />
    );

    const { data, error } = await resend.emails.send({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: email,
      subject: 'Reset your password',
      html: emailHtml,
    });

    if (error) {
      console.error('Failed to send password reset email:', error);
      throw new Error('Failed to send password reset email');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in sendPasswordResetEmail:', error);
    return { success: false, error };
  }
}

// Utility function to generate a secure token
export function generateVerificationToken(): string {
  return require('crypto').randomBytes(32).toString('hex');
}

// Utility function to generate token expiration (default: 24 hours from now)
export function getTokenExpiry(hours = 24): Date {
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + hours);
  return expiry;
}

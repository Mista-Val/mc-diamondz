import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db/prisma';
import { generateVerificationToken, sendPasswordResetEmail } from '@/lib/email';
import { isRateLimited } from '@/lib/rate-limit';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Rate limiting configuration for password reset requests
const RATE_LIMIT = {
  maxAttempts: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = forgotPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Check rate limiting
    const rateLimitKey = `forgot-password:${email}`;
    if (await isRateLimited(rateLimitKey, RATE_LIMIT)) {
      return NextResponse.json(
        { error: 'Too many password reset requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });

    // Don't reveal if the user exists or not
    if (!user) {
      return NextResponse.json(
        { message: 'If an account exists with this email, a password reset link has been sent.' },
        { status: 200 }
      );
    }

    // Delete any existing password reset tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { 
        identifier: email,
        token: { startsWith: 'pwd-reset:' } 
      },
    });

    // Generate a new password reset token
    const token = `pwd-reset:${generateVerificationToken()}`;
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1 hour expiration

    // Store the token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    try {
      // Send password reset email
      await sendPasswordResetEmail({
        email: user.email,
        username: user.name || 'User',
        token,
        expiresInHours: 1,
      });
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return NextResponse.json(
        { error: 'Failed to send password reset email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'If an account exists with this email, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request. Please try again.' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';

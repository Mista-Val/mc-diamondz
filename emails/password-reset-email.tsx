import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface PasswordResetEmailProps {
  username: string;
  resetUrl: string;
  expiresInHours?: number;
}

export const PasswordResetEmail: React.FC<Readonly<PasswordResetEmailProps>> = ({
  username,
  resetUrl,
  expiresInHours = 1,
}) => (
  <Html>
    <Head />
    <Preview>Reset your MC Diamondz password</Preview>
    <Body className="bg-white font-sans">
      <Container className="mx-auto p-6 max-w-2xl">
        <Section className="bg-white border border-gray-200 rounded-lg p-6">
          <Text className="text-2xl font-bold text-gray-800 mb-4">Password Reset Request</Text>
          <Text className="text-gray-700 mb-4">
            Hi {username},
          </Text>
          <Text className="text-gray-700 mb-4">
            We received a request to reset the password for your MC Diamondz account. If you didn't make this request, you can safely ignore this email.
          </Text>
          <Text className="text-gray-700 mb-6">
            To reset your password, click the button below. This link will expire in {expiresInHours} hour{expiresInHours !== 1 ? 's' : ''}.
          </Text>
          <Section className="text-center">
            <Button
              className="bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700"
              href={resetUrl}
            >
              Reset Password
            </Button>
          </Section>
          <Text className="text-gray-500 text-sm mt-6">
            If you didn't request a password reset, please ignore this email or contact support if you have any concerns.
          </Text>
          <Text className="text-gray-500 text-xs mt-4">
            This link will expire in {expiresInHours} hour{expiresInHours !== 1 ? 's' : ''} for security reasons.
          </Text>
        </Section>
        <Text className="text-gray-500 text-xs text-center mt-4">
          © {new Date().getFullYear()} MC Diamondz. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default PasswordResetEmail;

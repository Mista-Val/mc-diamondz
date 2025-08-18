import { Html, Head, Body, Container, Section, Text, Button, Tailwind } from '@react-email/components';

interface VerificationEmailProps {
  verificationLink: string;
}

export default function VerificationEmail({ verificationLink }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="max-w-2xl mx-auto p-6 bg-white">
            <Section className="text-center">
              <Text className="text-2xl font-bold text-gray-800 mb-4">
                Welcome to Our Platform!
              </Text>
              <Text className="text-gray-600 mb-6">
                Thanks for registering. Please verify your email address by clicking the button below:
              </Text>
              <Button
                href={verificationLink}
                className="bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Verify Email Address
              </Button>
              <Text className="text-gray-500 text-sm mt-6">
                If you didn't create an account, you can safely ignore this email.
              </Text>
              <Text className="text-gray-400 text-xs mt-8">
                This link will expire in 24 hours.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

import { EmailLayout } from '../components/EmailLayout';
import { Text } from '@react-email/components';

interface InviteRequestConfirmationEmailProps {
  name: string;
}

export default function InviteRequestConfirmationEmail({
  name,
}: InviteRequestConfirmationEmailProps) {
  return (
    <EmailLayout>
      <Text style={heading}>Thank You for Your Interest!</Text>
      <Text style={paragraph}>Hi {name},</Text>
      <Text style={paragraph}>
        Thank you for requesting an invite code to join OneLibro, the privacy-first
        personal finance platform.
      </Text>
      <Text style={paragraph}>
        Our admin team has received your request and will review it shortly.
        You'll receive your invite code via email within 1-2 business days.
      </Text>
      <Text style={paragraph}>
        We appreciate your patience and look forward to having you on board!
      </Text>
    </EmailLayout>
  );
}

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
  color: '#1a1a1a',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  marginBottom: '16px',
  color: '#4a5568',
};

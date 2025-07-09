import sgMail from '@sendgrid/mail';

interface SendGridConfig {
  apiKey?: string;
  sender?: string;
  provider?: string;
}

export async function sendEmail(
  to: string | string[],
  subject: string,
  message: string,
  config: SendGridConfig
) {
  if (!config || !config.apiKey || !config.sender) {
    throw new Error('Missing SendGrid configuration');
  }

  sgMail.setApiKey(config.apiKey);
  const recipients = Array.isArray(to) ? to : [to];

  try {
    await sgMail.sendMultiple({
      to: recipients,
      from: config.sender,
      subject,
      text: message,
    });
  } catch (err: any) {
    throw new Error(`SendGrid error: ${err.message || err}`);
  }
}

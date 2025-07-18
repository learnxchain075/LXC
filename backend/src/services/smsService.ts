import twilio from 'twilio';

interface TwilioConfig {
  accountSid?: string;
  authToken?: string;
  from?: string;
  provider?: string;
}

export async function sendSMS(to: string, message: string, config: TwilioConfig) {
  if (!config || !config.accountSid || !config.authToken || !config.from) {
    throw new Error('Missing Twilio SMS configuration');
  }

  const client = twilio(config.accountSid, config.authToken);

  try {
    await client.messages.create({
      body: message,
      from: config.from,
      to,
    });
  } catch (err: any) {
    throw new Error(`Twilio SMS error: ${err.message || err}`);
  }
}

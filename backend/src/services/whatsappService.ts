import twilio from 'twilio';

interface TwilioConfig {
  accountSid?: string;
  authToken?: string;
  from?: string;
  provider?: string;
}

export async function sendWhatsApp(
  to: string,
  message: string,
  config: TwilioConfig
) {
  if (!config || !config.accountSid || !config.authToken || !config.from) {
    throw new Error('Missing Twilio WhatsApp configuration');
  }

  const client = twilio(config.accountSid, config.authToken);
  const from = config.from.startsWith('whatsapp:')
    ? config.from
    : `whatsapp:${config.from}`;
  const toNumber = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

  try {
    await client.messages.create({
      body: message,
      from,
      to: toNumber,
    });
  } catch (err: any) {
    throw new Error(`Twilio WhatsApp error: ${err.message || err}`);
  }
}

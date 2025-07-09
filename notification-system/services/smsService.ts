export async function sendSMS(to: string, message: string, config: any) {
  // Integrate with Twilio
  console.info(`Sending SMS to ${to} via ${config.provider}`);
}

export async function sendEmail(to: string, subject: string, message: string, config: any) {
  // Here we would integrate with SendGrid or SES
  // Placeholder implementation
  console.info(`Sending email to ${to} via ${config.provider}`);
}

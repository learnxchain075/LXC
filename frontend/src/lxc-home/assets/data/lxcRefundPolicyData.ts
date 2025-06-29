// src/data/lxcRefundPolicyData.js

const refundPolicyData = [
  {
    contentId: "one",
    title: "Subscription Cancellation Policy",
    description: `
      <p>Cancellations will be accepted only within 7 days of the initial subscription activation or plan purchase.</p>
      <p>Cancellation requests beyond 7 days will not be entertained unless explicitly approved under special cases by LXC management.</p>
      <p>If onboarding, training, or custom implementation work has already commenced, cancellation requests will not be eligible for a refund.</p>
    `
  },
  {
    contentId: "two",
    title: "No Cancellation Policy for Mid-Term Subscriptions",
    description: `
      <p>Subscriptions (monthly, quarterly, half-yearly, or yearly) cannot be cancelled mid-term. Once subscribed, the plan remains active for the full duration.</p>
      <p>Downgrading or switching between plans during the active subscription period is not permitted unless otherwise agreed in writing.</p>
    `
  },
  {
    contentId: "three",
    title: "Refund Policy",
    description: `
      <p>Refunds will be issued only in the following cases:</p>
      <ul>
        <li>Duplicate payment made for the same plan.</li>
        <li>Transaction failures with money debited but not credited to the LXC account.</li>
        <li>Service-level failure during onboarding or technical setup (subject to internal verification).</li>
      </ul>
      <p>All approved refunds will be processed within 6-8 business days to the original payment method.</p>
    `
  },
  {
    contentId: "four",
    title: "How to Raise a Cancellation or Refund Request",
    description: `
      <p>Please email your cancellation or refund request to <b>support@learnxchain.io</b> within 7 days of your purchase.</p>
      <p>Include:</p>
      <ul>
        <li>Registered email ID</li>
        <li>Transaction ID or Invoice number</li>
        <li>Reason for cancellation/refund</li>
        <li>Any supporting documents (if applicable)</li>
      </ul>
      <p>Our Customer Success Team will review the request and respond within 3-5 business days.</p>
    `
  },
  {
    contentId: "five",
    title: "No Refunds in These Scenarios",
    description: `
      <ul>
        <li>Services already rendered (e.g., onboarding, setup, support hours).</li>
        <li>Partial usage of the subscription.</li>
        <li>Refund requests received beyond 7 days of purchase.</li>
        <li>Promotional or discounted plans, unless service was not rendered.</li>
      </ul>
    `
  },
  {
    contentId: "six",
    title: "Product Discrepancies or Issues",
    description: `
      <p>If you feel the product features or performance are not as described, please reach out to our Customer Success Team at <b>support@learnxchain.io</b> within 7 days of plan activation. We will investigate and suggest a resolution accordingly.</p>
    `
  },
  {
    contentId: "seven",
    title: "Third-Party Integrations and Manufacturer Warranties",
    description: `
      <p>Issues arising from third-party services (e.g., payment gateways, video conferencing tools) must be raised with the respective providers.</p>
      <p>LXC will assist in communication but holds no direct liability.</p>
    `
  },
  {
    contentId: "eight",
    title: "Disclaimer",
    description: `
      <p>This policy is subject to change without prior notice and is under the sole discretion of LearnXChain (LXC).</p>
      <p>Razorpay or other payment providers are not responsible for any claims or liabilities arising from our refund or cancellation policies.</p>
    `
  }
];

export default refundPolicyData;

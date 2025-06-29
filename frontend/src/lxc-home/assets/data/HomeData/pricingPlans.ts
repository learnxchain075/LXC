import Star1 from "../../images/shape/pricing-star1.svg";
import Star2 from "../../images/shape/pricing-star2.svg";
import Star3 from "../../images/shape/pricing-star3.svg";
export const pricingPlans = [
  {
    id: "tier1",
    delay: 200,
    title: "300 Students",
    tagDisplay: "none",
    icon: Star1,
    description: "Ideal for small schools or teams",
    actionTitle: "Get Started",
    actionLink: "#",
    plans: {
      monthly: {
        price: "₹1013/mo",
        features: [
          "Up to 300 Students",
          "₹859 base + 18% GST",
          "Full access to all modules",
          "Basic support",
        ],
      },
      halfYearly: {
        price: "₹5728 (6 mo)",
        features: [
          "10% discount",
          "₹4638.6 base + 18% GST",
          "Full access to all modules",
        ],
      },
      yearly: {
        price: "₹9730 (12 mo)",
        features: [
          "20% discount",
          "₹8246.4 base + 18% GST",
          "Priority support",
        ],
      },
    },
  },
  {
    id: "tier2",
    delay: 250,
    title: "700 Students",
    tagDisplay: "block",
    icon: Star2,
    description: "Best for mid-sized institutions",
    actionTitle: "Get Started",
    actionLink: "#",
    plans: {
      monthly: {
        price: "₹1178.82/mo",
        features: [
          "Up to 700 Students",
          "₹999 base + 18% GST",
          "All features unlocked",
        ],
      },
      halfYearly: {
        price: "₹6365.63 (6 mo)",
        features: [
          "10% discount",
          "₹5394.6 base + 18% GST",
          "All features unlocked",
        ],
      },
      yearly: {
        price: "₹11316.67 (12 mo)",
        features: [
          "20% discount",
          "₹9590.4 base + 18% GST",
          "Priority support",
        ],
      },
    },
  },
  {
    id: "tier3",
    delay: 300,
    title: "1000 Students",
    tagDisplay: "none",
    icon: Star3,
    description: "Designed for large institutions",
    actionTitle: "Get Started",
    actionLink: "#",
    plans: {
      monthly: {
        price: "₹1414.82/mo",
        features: [
          "Up to 1000 Students",
          "₹1199 base + 18% GST",
          "Advanced analytics",
        ],
      },
      halfYearly: {
        price: "₹7640.03 (6 mo)",
        features: [
          "10% discount",
          "₹6474.6 base + 18% GST",
          "Advanced analytics",
        ],
      },
      yearly: {
        price: "₹13582.27 (12 mo)",
        features: [
          "20% discount",
          "₹11510.4 base + 18% GST",
          "Dedicated support",
        ],
      },
    },
  },
  // {
  //   id: "enterprise",
  //   delay: 350,
  //   title: "Enterprise (1000+ Students)",
  //   tagDisplay: "block",
  //   icon: Star1,
  //   description: "Custom solution for large-scale deployments",
  //   actionTitle: "Contact Sales",
  //   actionLink: "#contact",
  //   plans: {
  //     monthly: {
  //       price: "₹1768.82/mo",
  //       features: [
  //         "1000+ Students",
  //         "₹1499 base + 18% GST",
  //         "All modules + Custom integrations",
  //       ],
  //     },
  //     halfYearly: {
  //       price: "₹9551.63 (6 mo)",
  //       features: [
  //         "10% discount",
  //         "₹8094.6 base + 18% GST",
  //         "All modules + Custom integrations",
  //       ],
  //     },
  //     yearly: {
  //       price: "₹16980.67 (12 mo)",
  //       features: [
  //         "20% discount",
  //         "₹14390.4 base + 18% GST",
  //         "24/7 Enterprise support",
  //       ],
  //     },
  //   },
  // },
];

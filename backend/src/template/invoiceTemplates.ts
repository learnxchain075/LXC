export interface PlanInvoiceData {
  schoolName: string;
  invoiceNumber: string;
  planName: string;
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  date: string;
  logoUrl?: string;
  address?: string;
  qrImage?: string;
  lang?: "EN" | "HI";
}

export interface FeeInvoiceData {
  schoolName: string;
  studentName: string;
  className: string;
  invoiceNumber: string;
  paymentDate: string;
  paymentMethod: string;
  totalFee: number;
  amountPaid: number;
  pendingAmount: number;
  feeStatus: string;
  logoUrl?: string;
  address?: string;
  qrImage?: string;
  lang?: "EN" | "HI";
}

const STRINGS = {
  EN: {
    invoice: "Invoice Number",
    date: "Date",
    plan: "Plan",
    base: "Base Amount",
    gst: "GST (18%)",
    total: "Total",
    paymentDate: "Payment Date",
    student: "Student",
    class: "Class",
    method: "Payment Method",
    totalFee: "Total Fee",
    amountPaid: "Amount Paid",
    pending: "Pending Amount",
    status: "Status",
    thanks: "Thank you for your payment!",
  },
  HI: {
    invoice: "चालान संख्या",
    date: "तारीख",
    plan: "प्लान",
    base: "मूल राशि",
    gst: "जीएसटी (18%)",
    total: "कुल",
    paymentDate: "भुगतान तिथि",
    student: "विद्यार्थी",
    class: "कक्षा",
    method: "भुगतान माध्यम",
    totalFee: "कुल शुल्क",
    amountPaid: "भुगतान राशि",
    pending: "बकाया राशि",
    status: "स्थिति",
    thanks: "आपके भुगतान के लिए धन्यवाद!",
  },
};

export const generatePlanInvoiceHtml = (data: PlanInvoiceData) => {
  const lang = data.lang || "EN";
  const t = (k: keyof (typeof STRINGS)["EN"]) => STRINGS[lang][k];
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice - ${data.invoiceNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; position: relative; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { padding: 8px 12px; border: 1px solid #ddd; text-align: left; }
    th { background-color: #f5f5f5; }
    .header { text-align: center; margin-bottom: 20px; }
    .logo { height: 60px; margin-bottom: 10px; }
    .watermark { position:absolute; top:40%; left:25%; font-size:50px; color:rgba(0,0,0,0.05); transform:rotate(-30deg); }
  </style>
</head>
<body>
  <div class="watermark">PAID</div>
  <div class="header">
    ${data.logoUrl ? `<img src="${data.logoUrl}" class="logo" />` : ""}
    <h2>${data.schoolName}</h2>
    ${data.address ? `<div>${data.address}</div>` : ""}
    <h3>Subscription Invoice</h3>
  </div>
  <table>
    <tr><th>${t("invoice")}</th><td>${data.invoiceNumber}</td></tr>
    <tr><th>${t("date")}</th><td>${data.date}</td></tr>
    <tr><th>${t("plan")}</th><td>${data.planName}</td></tr>
    <tr><th>${t("base")}</th><td>₹${data.baseAmount.toFixed(2)}</td></tr>
    <tr><th>${t("gst")}</th><td>₹${data.gstAmount.toFixed(2)}</td></tr>
    <tr><th>${t("total")}</th><td><strong>₹${data.totalAmount.toFixed(2)}</strong></td></tr>
  </table>
  ${data.qrImage ? `<img src="${data.qrImage}" style="height:80px;margin-top:20px" />` : ""}
  <p style="text-align:center;margin-top:20px;">${t("thanks")}</p>
</body>
</html>`;
};

export const generateFeeInvoiceHtml = (data: FeeInvoiceData) => {
  const lang = data.lang || "EN";
  const t = (k: keyof (typeof STRINGS)["EN"]) => STRINGS[lang][k];
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Fee Receipt</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; position: relative; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 8px; border: 1px solid #ddd; }
    .header { text-align: center; margin-bottom: 20px; }
    .watermark { position:absolute; top:40%; left:25%; font-size:50px; color:rgba(0,0,0,0.05); transform:rotate(-30deg); }
  </style>
</head>
<body>
  <div class="watermark">PAID</div>
  <div class="header">
    ${data.logoUrl ? `<img src="${data.logoUrl}" style="height:60px" />` : ""}
    <h2>${data.schoolName}</h2>
    ${data.address ? `<div>${data.address}</div>` : ""}
    <h3>Fee Receipt</h3>
  </div>
  <table>
    <tr><td>${t("invoice")}</td><td>${data.invoiceNumber}</td></tr>
    <tr><td>${t("paymentDate")}</td><td>${data.paymentDate}</td></tr>
    <tr><td>${t("student")}</td><td>${data.studentName}</td></tr>
    <tr><td>${t("class")}</td><td>${data.className}</td></tr>
    <tr><td>${t("method")}</td><td>${data.paymentMethod}</td></tr>
    <tr><td>${t("totalFee")}</td><td>₹${data.totalFee}</td></tr>
    <tr><td>${t("amountPaid")}</td><td>₹${data.amountPaid}</td></tr>
    <tr><td>${t("pending")}</td><td>₹${data.pendingAmount}</td></tr>
    <tr><td>${t("status")}</td><td>${data.feeStatus}</td></tr>
  </table>
  ${data.qrImage ? `<img src="${data.qrImage}" style="height:80px;margin-top:20px" />` : ""}
  <p style="text-align:center;margin-top:20px;">${t("thanks")}</p>
</body>
</html>`;
};

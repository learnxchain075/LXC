export interface CashFeeReceiptData {
  copyType: string;
  invoiceNumber: string;
  paymentDate: string;
  schoolName: string;
  logoUrl?: string;
  address?: string;
  studentName: string;
  className: string;
  section?: string;
  rollNo?: string;
  admissionNo?: string;
  feeBreakdown: { label: string; amount: number }[];
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  amountInWords: string;
  paymentMode: string;
  receivedBy: string;
  receivedFrom: string;
  qrImage?: string;
}

export const generateCashFeeReceiptHtml = (data: CashFeeReceiptData) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Fee Receipt - ${data.invoiceNumber}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      table { width: 100%; border-collapse: collapse; }
      td, th { padding: 6px; border: 1px solid #ddd; }
      .header { text-align: center; margin-bottom: 20px; }
      .copy { text-align: right; font-weight: bold; }
      .signature { margin-top:40px; display:flex; justify-content:space-between; }
    </style>
  </head>
  <body>
    <div class="copy">${data.copyType}</div>
    <div class="header">
      ${data.logoUrl ? `<img src="${data.logoUrl}" style="height:60px" />` : ""}
      <h2>${data.schoolName}</h2>
      ${data.address ? `<div>${data.address}</div>` : ""}
      <h3>Fee Receipt</h3>
    </div>
    <table>
      <tr><td>Invoice No</td><td>${data.invoiceNumber}</td><td>Date</td><td>${data.paymentDate}</td></tr>
      <tr><td>Student</td><td>${data.studentName}</td><td>Class</td><td>${data.className}</td></tr>
      ${data.rollNo ? `<tr><td>Roll No</td><td>${data.rollNo}</td><td>Admission No</td><td>${data.admissionNo || ""}</td></tr>` : ""}
    </table>
    <h4>Fee Details</h4>
    <table>
      <tr><th>Particular</th><th>Amount</th></tr>
      ${data.feeBreakdown.map(i => `<tr><td>${i.label}</td><td>₹${i.amount}</td></tr>`).join('')}
      <tr><td>Base Amount</td><td>₹${data.baseAmount.toFixed(2)}</td></tr>
      <tr><td>GST</td><td>₹${data.gstAmount.toFixed(2)}</td></tr>
      <tr><th>Total</th><th>₹${data.totalAmount.toFixed(2)}</th></tr>
    </table>
    <p><strong>Amount in words:</strong> ${data.amountInWords}</p>
    <p><strong>Payment Mode:</strong> ${data.paymentMode}</p>
    <p><strong>Received From:</strong> ${data.receivedFrom}</p>
    <p><strong>Received By:</strong> ${data.receivedBy}</p>
    <div class="signature">
      <div>Signature (School)</div>
      <div>Signature (Parent/Student)</div>
    </div>
    ${data.qrImage ? `<img src="${data.qrImage}" style="height:80px;margin-top:20px" />` : ""}
  </body>
  </html>`;
};

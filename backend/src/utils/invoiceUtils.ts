import { prisma } from "../db/prisma";
import puppeteer from "puppeteer";
import QRCode from "qrcode";
import { uploadFile } from "../config/upload";
import {
  generatePlanInvoiceHtml,
  generateFeeInvoiceHtml,
} from "../template/invoiceTemplates";
import { sendInvoicePdfEmail } from "./mailer";

export const generateInvoiceNumber = async (
  schoolId: string
): Promise<string> => {
  const now = new Date();
  const yearMonth = `${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;

  const counter = await prisma.invoiceCounter.upsert({
    where: { schoolId_yearMonth: { schoolId, yearMonth } },
    update: { lastNumber: { increment: 1 } },
    create: { schoolId, yearMonth, lastNumber: 1 },
  });

  const number = counter.lastNumber.toString().padStart(4, "0");
  const schoolSegment = schoolId.replace(/-/g, "").slice(0, 6).toUpperCase();
  return `LXC-INV-${schoolSegment}-${yearMonth}-${number}`;
};

export const logInvoiceDownload = async (
  invoiceNumber: string,
  userId: string
): Promise<void> => {
  await prisma.invoiceLog.create({
    data: { invoiceNumber, userId },
  });
};

export const createPlanInvoice = async (
  subscriptionId: string
): Promise<{ invoiceNumber: string; url: string } | undefined> => {
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    include: { plan: true, school: { include: { user: true } }, payment: true },
  });
  if (!subscription || !subscription.payment) return;

  let invoiceNumber = subscription.payment.invoiceNumber;
  if (!invoiceNumber) {
    invoiceNumber = await generateInvoiceNumber(subscription.schoolId);
    await prisma.payment.update({
      where: { id: subscription.payment.id },
      data: { invoiceNumber },
    });
  }

  const totalAmount = subscription.payment.amount;
  const baseAmount = Number((totalAmount / 1.18).toFixed(2));
  const gstAmount = Number((totalAmount - baseAmount).toFixed(2));

  const qrImage = await QRCode.toDataURL(
    `${process.env.BASE_URL}/api/v1/school/plan/invoice/${subscriptionId}`
  );

  const html = generatePlanInvoiceHtml({
    schoolName: subscription.school.schoolName,
    invoiceNumber,
    planName: subscription.plan.name,
    baseAmount,
    gstAmount,
    totalAmount,
    date: new Date(
      subscription.payment.updatedAt ?? subscription.payment.createdAt
    ).toLocaleDateString(),
    logoUrl: subscription.school.schoolLogo || undefined,
    address: subscription.school.user.address,
    qrImage,
  });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = (await page.pdf({ format: "A4" })) as Buffer;
  await browser.close();

  let invoiceUrl = subscription.payment.invoiceUrl;
  if (!invoiceUrl) {
    const upload = await uploadFile(
      pdfBuffer,
      "invoices",
      "raw",
      `plan_${invoiceNumber}.pdf`
    );
    invoiceUrl = upload.url;
    await prisma.payment.update({
      where: { id: subscription.payment.id },
      data: { invoiceUrl },
    });
  }

  await sendInvoicePdfEmail(
    subscription.school.user.email,
    invoiceUrl,
    pdfBuffer
  );
  return { invoiceNumber, url: invoiceUrl };
};

export const createFeeInvoice = async (
  paymentId: string
): Promise<{ invoiceNumber: string; url: string } | undefined> => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      fee: {
        include: { student: { include: { user: true } }, school: { include: { user: true } } },
      },
    },
  });
  if (!payment || !payment.fee) return;
  const fee = payment.fee;

  let invoiceNumber = payment.invoiceNumber;
  if (!invoiceNumber) {
    invoiceNumber = await generateInvoiceNumber(fee.schoolId);
    await prisma.payment.update({ where: { id: payment.id }, data: { invoiceNumber } });
  }

  const classInfo = await prisma.class.findUnique({ where: { id: fee.student.classId }, select: { name: true } });

  const qrImage = await QRCode.toDataURL(
    `${process.env.BASE_URL}/api/v1/school/fee/invoice/${paymentId}`
  );

  const html = generateFeeInvoiceHtml({
    schoolName: fee.school.schoolName,
    studentName: fee.student.user?.name || "N/A",
    className: classInfo?.name || "N/A",
    invoiceNumber,
    paymentDate: new Date(payment.updatedAt ?? payment.createdAt).toLocaleDateString(),
    paymentMethod: payment.paymentMethod || "N/A",
    totalFee: fee.amount,
    amountPaid: payment.amount,
    pendingAmount: fee.amount - fee.amountPaid,
    feeStatus: fee.status,
    logoUrl: fee.school.schoolLogo || undefined,
    address: fee.school.user.address,
    qrImage,
  });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = (await page.pdf({ format: "A4" })) as Buffer;
  await browser.close();

  let invoiceUrl = payment.invoiceUrl;
  if (!invoiceUrl) {
    const upload = await uploadFile(
      pdfBuffer,
      "invoices",
      "raw",
      `fee_${invoiceNumber}.pdf`
    );
    invoiceUrl = upload.url;
    await prisma.payment.update({ where: { id: payment.id }, data: { invoiceUrl } });
  }

  const recipients = new Set<string>();
  if (fee.student.user?.email) recipients.add(fee.student.user.email);
  if (fee.student.guardianEmail) recipients.add(fee.student.guardianEmail);
  if (fee.student.fatheremail) recipients.add(fee.student.fatheremail);
  if (fee.student.motherEmail) recipients.add(fee.student.motherEmail);
  for (const email of recipients) {
    await sendInvoicePdfEmail(email, invoiceUrl, pdfBuffer);
  }
  return { invoiceNumber, url: invoiceUrl };
};

export const numberToWords = (num: number): string => {
  const a = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
    if (n < 1000)
      return (
        a[Math.floor(n / 100)] +
        ' Hundred' +
        (n % 100 ? ' ' + inWords(n % 100) : '')
      );
    if (n < 1000000)
      return (
        inWords(Math.floor(n / 1000)) +
        ' Thousand' +
        (n % 1000 ? ' ' + inWords(n % 1000) : '')
      );
    return '';
  };

  return inWords(Math.floor(num)).trim();
};

import { generateCashFeeReceiptHtml, CashFeeReceiptData } from '../template/feeReceiptTemplates';

export const createCashFeeReceipts = async (
  paymentId: string,
  receivedBy: string,
  paymentMode: string = 'Cash',
): Promise<{ invoiceNumber: string; userUrl: string; officeUrl: string } | undefined> => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      fee: {
        include: {
          student: { include: { user: true } },
          school: { include: { user: true } },
        },
      },
    },
  });
  if (!payment || !payment.fee) return;
  const fee = payment.fee;

  let invoiceNumber = payment.invoiceNumber;
  if (!invoiceNumber) {
    invoiceNumber = await generateInvoiceNumber(fee.schoolId);
    await prisma.payment.update({ where: { id: payment.id }, data: { invoiceNumber } });
  }

  const classInfo = await prisma.class.findUnique({ where: { id: fee.student.classId }, select: { name: true } });
  const qrImage = await QRCode.toDataURL(
    `${process.env.BASE_URL}/api/v1/school/fee/invoice/${paymentId}`,
  );

  const baseAmount = Number((payment.amount / 1.18).toFixed(2));
  const gstAmount = Number((payment.amount - baseAmount).toFixed(2));
  const amountInWords = numberToWords(payment.amount) + ' only';

  const common: Omit<CashFeeReceiptData, 'copyType'> = {
    invoiceNumber,
    paymentDate: new Date(payment.updatedAt ?? payment.createdAt).toLocaleDateString(),
    schoolName: fee.school.schoolName,
    logoUrl: fee.school.schoolLogo || undefined,
    address: fee.school.user.address,
    studentName: fee.student.user?.name || 'N/A',
    className: classInfo?.name || 'N/A',
    rollNo: fee.student.rollNo || undefined,
    admissionNo: fee.student.admissionNo || undefined,
    feeBreakdown: [{ label: fee.category, amount: payment.amount }],
    baseAmount,
    gstAmount,
    totalAmount: payment.amount,
    amountInWords,
    paymentMode,
    receivedBy,
    receivedFrom: fee.student.user?.name || 'N/A',
    qrImage,
  };

  const createPdf = async (copyType: string): Promise<string> => {
    const html = generateCashFeeReceiptHtml({ ...common, copyType });
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = (await page.pdf({ format: 'A4' })) as Buffer;
    await browser.close();
    const upload = await uploadFile(pdfBuffer, 'invoices', 'raw', `fee_${invoiceNumber}_${copyType.replace(/\s+/g,'').toLowerCase()}.pdf`);
    return upload.url;
  };

  let userUrl = payment.invoiceUrl;
  if (!userUrl) {
    userUrl = await createPdf('User Copy');
    await prisma.payment.update({ where: { id: payment.id }, data: { invoiceUrl: userUrl } });
  }

  let officeUrl = (payment as any).officeInvoiceUrl as string | undefined;
  if (!officeUrl) {
    officeUrl = await createPdf('Office Copy');
    await prisma.payment.update({ where: { id: payment.id }, data: { officeInvoiceUrl: officeUrl } });
  }

  const recipients = new Set<string>();
  if (fee.student.user?.email) recipients.add(fee.student.user.email);
  if (fee.student.guardianEmail) recipients.add(fee.student.guardianEmail);
  if (fee.student.fatheremail) recipients.add(fee.student.fatheremail);
  if (fee.student.motherEmail) recipients.add(fee.student.motherEmail);
  for (const email of recipients) {
    await sendInvoicePdfEmail(email, userUrl);
  }

  return { invoiceNumber, userUrl, officeUrl };
};

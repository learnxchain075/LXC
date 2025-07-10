import { RequestHandler } from "express";
import puppeteer from "puppeteer";
import QRCode from "qrcode";
import { Role } from "@prisma/client";
import axios from "axios";
import { prisma } from "../../db/prisma";
import { uploadFile } from "../../config/upload";
import { slugify } from "../../utils/slugify";
import {
  generatePlanInvoiceHtml,
  generateFeeInvoiceHtml,
} from "../../template/invoiceTemplates";
import {
  generateInvoiceNumber,
  logInvoiceDownload,
} from "../../utils/invoiceUtils";
import { sendInvoicePdfEmail } from "../../utils/mailer";

export const downloadPlanInvoice: RequestHandler = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: { plan: true, school: { include: { user: true } }, payment: true },
    });
    if (!subscription || !subscription.payment) {
      res.status(404).json({ message: "Subscription not found" });
      return;
    }

    if (
      req.user?.id !== subscription.school.userId &&
      req.user?.role !== Role.superadmin
    ) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const paymentRecord: any = subscription.payment as any;
    let invoiceNumber = paymentRecord.invoiceNumber;
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
      lang: (req.query.lang as "HI" | "EN") || "EN",
    });

    let pdfBuffer: Buffer | undefined;
    let invoiceUrl = paymentRecord.invoiceUrl;

    if (invoiceUrl) {
      try {
        const fileRes = await axios.get<ArrayBuffer>(invoiceUrl, {
          responseType: "arraybuffer",
        });
        pdfBuffer = Buffer.from(fileRes.data);
      } catch (error) {
        console.warn("Failed to fetch stored invoice, regenerating", error);
      }
    }

    if (!pdfBuffer) {
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });
      pdfBuffer = (await page.pdf({ format: "A4" })) as Buffer;
      await browser.close();

      const upload = await uploadFile(
        pdfBuffer,
        "plan_invoices",
        "raw",
        `plan_${invoiceNumber}.pdf`
      );
      invoiceUrl = upload.url;
      await prisma.payment.update({
        where: { id: subscription.payment.id },
        data: { invoiceUrl },
      });

      await sendInvoicePdfEmail(
        subscription.school.user.email,
        invoiceUrl,
        pdfBuffer
      );
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${invoiceNumber}.pdf`
    );
    res.send(pdfBuffer);

    await logInvoiceDownload(invoiceNumber, req.user!.id);
    return;
  } catch (error) {
    console.error("Plan invoice error", error);
    res.status(500).json({ message: "Failed to generate invoice" });
    return;
  }
};

export const downloadFeeInvoice: RequestHandler = async (req, res) => {
  try {
    const { paymentId } = req.params;
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
    if (!payment || !payment.fee) {
      res.status(404).json({ message: "Payment not found" });
      return;
    }

    const fee = payment.fee;
    const allowedUserIds = [fee.school.userId, fee.student.userId];
    const allowedEmails = [
      fee.student.fatheremail,
      fee.student.motherEmail,
      fee.student.guardianEmail,
    ];
    if (
      !allowedUserIds.includes(req.user!.id) &&
      !allowedEmails.includes(req.user!.email)
    ) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const payRecord: any = payment as any;
    let invoiceNumber = payRecord.invoiceNumber;
    if (!invoiceNumber) {
      invoiceNumber = await generateInvoiceNumber(fee.schoolId);
      await prisma.payment.update({
        where: { id: payment.id },
        data: { invoiceNumber },
      });
    }

    const classInfo = await prisma.class.findUnique({ where: { id: fee.student.classId }, select: { name: true } });

    const qrImage = await QRCode.toDataURL(
      `${process.env.BASE_URL}/api/v1/school/fee/invoice/${paymentId}`
    );

    const html = generateFeeInvoiceHtml({
      schoolName: fee.school.schoolName,
      studentName: payment.fee.student.user?.name || "N/A",
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
      lang: (req.query.lang as "HI" | "EN") || "EN",
    });

    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = (await page.pdf({ format: "A4" })) as Buffer;
    await browser.close();

    let invoiceUrl = payRecord.invoiceUrl;
    if (!invoiceUrl) {
      const upload = await uploadFile(
        pdfBuffer,
        `school_invoices/${slugify(fee.school.schoolName)}`,
        "raw",
        `fee_${invoiceNumber}.pdf`
      );
      invoiceUrl = upload.url;
      await prisma.payment.update({ where: { id: payment.id }, data: { invoiceUrl } });

      const recipients = new Set<string>();
      if (payment.fee.student.user?.email) recipients.add(payment.fee.student.user.email);
      if (payment.fee.student.guardianEmail) recipients.add(payment.fee.student.guardianEmail);
      if (payment.fee.student.fatheremail) recipients.add(payment.fee.student.fatheremail);
      if (payment.fee.student.motherEmail) recipients.add(payment.fee.student.motherEmail);
      for (const email of recipients) {
        await sendInvoicePdfEmail(email, invoiceUrl, pdfBuffer);
      }
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${invoiceNumber}.pdf`
    );
    res.send(pdfBuffer);

    await logInvoiceDownload(invoiceNumber, req.user!.id);
    return;
  } catch (error) {
    console.error("Fee invoice error", error);
    res.status(500).json({ message: "Failed to generate invoice" });
    return;
  }
};

export const downloadFeeReceipt: RequestHandler = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const copy = (req.query.copy as string) === "office" ? "office" : "user";

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
    if (!payment || !payment.fee) {
      res.status(404).json({ message: "Payment not found" });
      return;
    }

    const fee = payment.fee;
    const allowedUserIds = [fee.school.userId, fee.student.userId];
    const allowedEmails = [
      fee.student.fatheremail,
      fee.student.motherEmail,
      fee.student.guardianEmail,
    ];
    if (
      !allowedUserIds.includes(req.user!.id) &&
      !allowedEmails.includes(req.user!.email)
    ) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const url =
      copy === "office"
        ? (payment as any).officeInvoiceUrl
        : payment.invoiceUrl;

    if (!url) {
      res.status(404).json({ message: "Receipt not available" });
      return;
    }

    const response = await axios.get(url, { responseType: "arraybuffer" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=${copy}_receipt_${payment.invoiceNumber || paymentId}.pdf`
    );
    res.send(Buffer.from(response.data));
  } catch (error) {
    console.error("Fee receipt download error", error);
    res.status(500).json({ message: "Failed to download receipt" });
  }
};

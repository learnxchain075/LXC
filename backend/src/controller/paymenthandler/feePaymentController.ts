import { Request, Response } from "express";
import { prisma } from "../../db/prisma";
import Razorpay from "razorpay";
import crypto from "crypto";
import { createFeeInvoice } from "../../utils/invoiceUtils";
import { createFeeOrderSchema, verifyFeePaymentSchema } from "../../validations/payment/feePaymentValidation";
import { razorpayInstance } from "../../config/razorpay";

// Backend: createRazorpayOrder.ts

export const createRazorpayOrder = async (req: Request, res: Response): Promise<void> => {
  const parseResult = createFeeOrderSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ success: false, error: parseResult.error.errors });
    return;
  }
  const { feeId, amount } = parseResult.data;

  try {
    const fee = await prisma.fee.findUnique({ where: { id: feeId } });
    if (!fee) {
      res.status(404).json({ success: false, error: "Fee not found" });
      return;
    }

    const paymentSecret = await prisma.paymentSecret.findUnique({
      where: { schoolId: fee.schoolId },
    });
    if (!paymentSecret) {
      res.status(404).json({ success: false, error: "Payment secret not found" });
      return;
    }

    const razorpay = new Razorpay({
      key_id: paymentSecret.keyId,
      key_secret: paymentSecret.keySecret,
    });

    let order;
    try {
      order = await razorpay.orders.create({
        amount: amount * 100, // in paise
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
        payment_capture: true,
      });
    } catch (razorpayError: any) {
      console.error("🟥 Razorpay error:", razorpayError);
      res
        .status(500)
        .json({
          success: false,
          error: "Razorpay order creation failed",
          details: razorpayError.message || razorpayError,
        });
      return;
    }

    await prisma.payment.create({
      data: {
        feeId,
        amount,
        razorpayOrderId: order.id,
        status: "PENDING",
        paymentDate: new Date(),
      },
    });

    res.status(201).json({
      success: true,
      orderId: order.id,
      amount: amount * 100,
      currency: "INR",
    });
  } catch (err: any) {
    console.error("🟥 Prisma or server error:", err);
    res.status(500).json({ success: false, error: "Internal server error", details: err.message || err });
  }
};

// Verify Razorpay Payment
export const verifyRazorpayPayment = async (req: Request, res: Response): Promise<void> => {
  const parseResult = verifyFeePaymentSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: parseResult.error.errors });
    return;
  }
  const { orderId, paymentId, razorpaySignature, feeId } = parseResult.data;

  try {
    // Fetch the fee details
    const fee = await prisma.fee.findUnique({ where: { id: feeId } });
    if (!fee) {
      res.status(404).json({ error: "Fee not found" });
      return;
    }

    // Fetch Razorpay credentials from PaymentSecret for the school
    const paymentSecret = await prisma.paymentSecret.findUnique({
      where: { schoolId: fee.schoolId },
    });
    if (!paymentSecret) {
      res.status(404).json({ error: "Payment secret not found" });
      return;
    }
    const paymentDetails = await razorpayInstance.payments.fetch(paymentId);

    // Generate the expected signature to verify the payment
    const generatedSignature = crypto
      .createHmac("sha256", paymentSecret.keySecret)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    // Validate the Razorpay signature
    if (generatedSignature !== razorpaySignature) {
      res.status(400).json({ error: "Invalid signature" });
      return;
    }

    // Update the Payment status to "PAID"
    const payment = await prisma.payment.update({
      where: { razorpayOrderId: orderId, feeId }, // Ensure payment matches fee
      data: {
        razorpayPaymentId: paymentId,
        status: "PAID",
        paymentMethod: paymentDetails.method,
      },
    });

    // Fetch all paid payments for the fee
    const existingPayments = await prisma.payment.findMany({
      where: { feeId, status: "PAID" },
    });

    const totalPaid = existingPayments.reduce((sum, p) => sum + p.amount, 0);

    // Determine if the fee is fully paid or partially paid
    const newStatus = totalPaid >= fee.amount ? "PAID" : "PARTIAL";

    // Update the Fee status based on the payment
    await prisma.fee.update({
      where: { id: feeId },
      data: {
        amountPaid: totalPaid,
        status: newStatus,
        paymentDate: new Date(),
      },
    });

    // const student = await prisma.student.findUnique({ where: { id: fee.studentId } });
    // if (student?.guardianEmail) {
    //   const razorpay = new Razorpay({
    //     key_id: paymentSecret.keyId,
    //     key_secret: paymentSecret.keySecret,
    //   });
    //   try {
    //     const invoice = await razorpay.invoices.create({
    //       type: "invoice",
    //       customer: { email: student.guardianEmail },
    //       line_items: [
    //         {
    //           name: "School Fee",
    //           amount: Math.round(payment.amount * 100),
    //           currency: "INR",
    //           quantity: 1,
    //         },
    //       ],
    //     });
    //     await razorpay.invoices.issue(invoice.id);
    //   } catch (err) {
    //     console.error("Razorpay invoice error:", err);
    //   }
    // }

    const invoiceDetails = await createFeeInvoice(payment.id);

    res.status(200).json({
      message: "Payment successfully verified",
      totalPaid,
      status: newStatus,
      paymentId: payment.id,
      invoiceNumber: invoiceDetails?.invoiceNumber,
      invoiceUrl: invoiceDetails?.url,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Error verifying Razorpay payment" });
  }
};

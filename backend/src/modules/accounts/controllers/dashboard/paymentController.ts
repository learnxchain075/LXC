import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../../db/prisma";
import Razorpay from "razorpay";
import { createCashFeeReceipts } from "../../../../utils/invoiceUtils";
import { paymentDataSchema } from "../../../../validations/Module/AccountsDashboard/paymentValidation";


// helper to validate payment creation


// Create a cash payment record
export async function recordCashPayment(req: Request, res: Response, next: NextFunction):Promise<any> {
  try {
    const parseResult = paymentDataSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: parseResult.error.errors });
    }
    const { feeId, amount } = parseResult.data;
    const { razorpayOrderId } = req.body;

    const fee = await prisma.fee.findUnique({ where: { id: feeId } });
    if (!fee) {
      return res.status(404).json({ message: "Fee not found" });
    }

    const payment = await prisma.payment.create({
      data: {
        feeId,
        amount,
        status: "Success",
        paymentDate: new Date(),
        paymentMethod: "Cash",
        razorpayOrderId, // Set to null for cash payments
      },
    });

    const totalPayments = await prisma.payment.aggregate({
      where: { feeId, status: "Success" },
      _sum: { amount: true },
    });

    if ((totalPayments._sum.amount || 0) >= fee.amount) {
      await prisma.fee.update({
        where: { id: feeId },
        data: { status: "Paid" },
      });
    }

    const receipt = await createCashFeeReceipts(payment.id, req.user?.name || '', 'Cash');

    res.status(201).json({ payment, receipt });
  } catch (error) {
    next(error);
  }
}

// Create an online payment order via Razorpay
export async function createPaymentOrder(req: Request, res: Response, next: NextFunction) :Promise<any> {
  try {
    const parseResult = paymentDataSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: parseResult.error.errors });
    }
    const { feeId, amount } = parseResult.data;

    const fee = await prisma.fee.findUnique({ where: { id: feeId } });
    if (!fee) {
      return res.status(404).json({ message: "Fee not found" });
    }

    const paymentSecret = await prisma.paymentSecret.findUnique({
      where: { schoolId: fee.schoolId },
    });
    if (!paymentSecret) {
      return res.status(404).json({ message: "Payment secret not found" });
    }

    const razorpay = new Razorpay({
      key_id: paymentSecret.keyId,
      key_secret: paymentSecret.keySecret,
    });

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt#${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    await prisma.payment.create({
      data: {
        feeId,
        amount,
        razorpayOrderId: order.id,
        status: "Pending",
        paymentDate: new Date(),
        paymentMethod: "Online",
      },
    });

    res.json(order);
  } catch (error) {
    next(error);
  }
}

// Handle Razorpay webhook for payment success/failure
export async function handleWebhook(req: Request, res: Response, next: NextFunction) :Promise<any> {
  try {
    const { event, payload } = req.body;

    const payment = await prisma.payment.findFirst({
      where: { razorpayOrderId: payload.payment.entity.order_id },
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    if (event === "payment.failed") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "Failed" },
      });
    } else if (event === "payment.succeeded") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "Success",
          razorpayPaymentId: payload.payment.entity.id,
        },
      });

      if (!payment.feeId) {
        return res.status(400).json({ message: "Invalid fee ID" });
      }
      const fee = await prisma.fee.findUnique({ where: { id: payment.feeId } });

      if (!fee) {
        return res.status(404).json({ message: "Fee record not found" });
      }

      const totalPayments = await prisma.payment.aggregate({
        where: { feeId: payment.feeId, status: "Success" },
        _sum: { amount: true },
      });

      if ((totalPayments._sum.amount || 0) >= fee.amount) {
        await prisma.fee.update({
          where: { id: payment.feeId ?? undefined },
          data: { status: "Paid" },
        });
      }
    }

    res.json({ message: "Webhook handled successfully" });
  } catch (error) {
    next(error);
  }
}

// Get all payments
export async function getAllPayments(req: Request, res: Response, next: NextFunction) {
  try {
    const payments = await prisma.payment.findMany();
    res.json(payments);
  } catch (error) {
    next(error);
  }
}

// Get a single payment by ID
export async function getPaymentById(req: Request, res: Response, next: NextFunction):Promise<any> {
  try {
    const { id } = req.params;
    const payment = await prisma.payment.findUnique({ where: { id } });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (error) {
    next(error);
  }
}

// Update payment status manually
export async function updatePayment(req: Request, res: Response, next: NextFunction):Promise<any> {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: { status },
    });

    res.json(updatedPayment);
  } catch (error) {
    next(error);
  }
}

// Delete a payment record
export async function deletePayment(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    await prisma.payment.delete({ where: { id } });

    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    next(error);
  }
}

import { Request, Response } from "express";
import { prisma } from "../../db/prisma";
import crypto from "crypto";
import { razorpayInstance } from "../../config/razorpay";
import { createPlanInvoice } from "../../utils/invoiceUtils";
import Razorpay from "razorpay";

const calculateAmounts = (planPrice: number, discount: number, isTrial?: boolean) => {
  let baseAmount = Math.max(planPrice - discount, 0);
  if (isTrial) {
    baseAmount = Number(process.env.TRIAL_PRICE || 2);
  }
  const gstAmount = Number((baseAmount * 0.18).toFixed(2));
  const totalAmount = Number((baseAmount + gstAmount).toFixed(2));
  return { baseAmount, gstAmount, totalAmount };
};
import {
  createPlanOrderSchema,
  verifyPlanPaymentSchema,
  razorpayWebhookSchema,
} from "../../validations/payment/planPaymentValidation";

// Create Razorpay Order
export const createRazorpayOrder = async (req: Request, res: Response): Promise<any> => {
  const parseResult = createPlanOrderSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: parseResult.error.errors });
  }
  const { planId, schoolId, couponCode, isTrial } = parseResult.data;

  try {
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    let coupon;
    if (couponCode) {
      coupon = await prisma.coupon.findFirst({ where: { code: couponCode, planId } });
      if (!coupon) return res.status(404).json({ message: "Coupon not found" });
      if (new Date() > coupon.expiryDate || coupon.usedCount >= coupon.maxUsage) {
        return res.status(400).json({ message: "Coupon is not valid" });
      }
    }

    let discount = 0;

    const previousSubscriptions = await prisma.subscription.count({ where: { schoolId } });
    if (previousSubscriptions === 0) {
      if (plan.durationDays >= 360) {
        discount += plan.price * 0.2;
      } else if (plan.durationDays >= 180) {
        discount += plan.price * 0.1;
      }
    }

    if (coupon) {
      const couponDiscount =
        coupon.discountType === "FLAT" ? coupon.discountValue : (plan.price * coupon.discountValue) / 100;
      discount += couponDiscount;
    }

    const { baseAmount, gstAmount, totalAmount } = calculateAmounts(plan.price, discount, isTrial);

    const orderOptions = {
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(orderOptions);

    // Create a Payment record with "Pending" status
    const payment = await prisma.payment.create({
      data: {
        amount: totalAmount,
        razorpayOrderId: order.id,
        status: "Pending",
        planId,
        schoolId,
      },
    });

    res.status(201).json({
      success: true,
      orderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      planId,
      schoolId,
      couponCode: couponCode || null,
      isTrial: !!isTrial,
      discountApplied: discount,
      baseAmount,
      gstAmount,
      totalAmount,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// Verify Razorpay Payment

// export const verifyRazorpayPayment = async (req: Request, res: Response): Promise<any> => {
//   const parseResult = verifyPlanPaymentSchema.safeParse(req.body);
//   if (!parseResult.success) {
//     return res.status(400).json({ message: parseResult.error.errors });
//   }
//   const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, schoolId, couponCode, isTrial } =
//     parseResult.data;

//   try {
//     const body = `${razorpay_order_id}|${razorpay_payment_id}`;
//     const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!).update(body).digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({ message: "Invalid signature" });
//     }

//     // Find the existing Payment record by razorpayOrderId
//     const payment = await prisma.payment.findUnique({
//       where: { razorpayOrderId: razorpay_order_id },
//     });

//     if (!payment) {
//       return res.status(404).json({ message: "Payment not found" });
//     }

//     if (payment.planId !== planId || payment.schoolId !== schoolId) {
//       return res.status(400).json({ message: "Payment details mismatch" });
//     }

//     // Update Payment with success details
//     await prisma.payment.update({
//       where: { id: payment.id },
//       data: {
//         razorpayPaymentId: razorpay_payment_id,
//         status: "SUCCESS",
//         paymentDate: new Date(),
//       },
//     });

//     const plan = await prisma.plan.findUnique({ where: { id: planId } });
//     if (!plan) return res.status(404).json({ message: "Plan not found" });

//     let coupon;
//     if (couponCode) {
//       coupon = await prisma.coupon.findFirst({ where: { code: couponCode, planId } });
//       if (!coupon) return res.status(404).json({ message: "Coupon not found" });
//       if (new Date() > coupon.expiryDate || coupon.usedCount >= coupon.maxUsage) {
//         return res.status(400).json({ message: "Coupon is not valid" });
//       }
//     }

//     // Check for any active subscription for the school
//     const activeSubscription = await prisma.subscription.findFirst({
//       where: {
//         schoolId,
//         isActive: true,
//         endDate: { gte: new Date() },
//       },
//     });

//     const school = await prisma.school.findUnique({
//       where: { id: schoolId },
//       include: { user: true },
//     });

//     // Calculate discount as in createRazorpayOrder
//     let discount = 0;
//     const previousSubscriptions = await prisma.subscription.count({ where: { schoolId } });
//     if (previousSubscriptions === 0) {
//       if (plan.durationDays >= 360) {
//         discount += plan.price * 0.2;
//       } else if (plan.durationDays >= 180) {
//         discount += plan.price * 0.1;
//       }
//     }
//     if (coupon) {
//       const couponDiscount =
//         coupon.discountType === "FLAT" ? coupon.discountValue : (plan.price * coupon.discountValue) / 100;
//       discount += couponDiscount;
//     }

//     const { baseAmount, gstAmount, totalAmount } = calculateAmounts(
//       plan.price,
//       discount,
//       isTrial
//     );

//     const duration = isTrial ? 15 : plan.durationDays;
//     let subscription;
//     const subscriptionData = {
//       planId,
//       schoolId,
//       startDate: new Date(),
//       endDate: new Date(Date.now() + duration * 86400000),
//       paymentId: payment.id,
//       orderId: razorpay_order_id,
//       receipt: `receipt_${Date.now()}`,
//       status: "SUCCESS" as const,
//       isActive: true,
//       couponId: coupon?.id,
//     };

//     if (activeSubscription) {
//       subscription = await prisma.subscription.update({
//         where: { id: activeSubscription.id },
//         data: subscriptionData,
//       });
//     } else {
//       subscription = await prisma.subscription.create({
//         data: subscriptionData,
//       });
//     }

//     if (coupon) {
//       await prisma.coupon.update({
//         where: { id: coupon.id },
//         data: { usedCount: { increment: 1 } },
//       });
//     }

//     if (school?.user?.email) {
//       await sendInvoiceEmail(
//         school.user.email,
//         subscription?.id,
//         totalAmount,
//         { baseAmount, gstAmount, totalAmount }
//       );
//       try {
//         const invoice = await razorpayInstance.invoices.create({
//           type: "invoice",
//           customer: { email: school.user.email },
//           line_items: [
//             {
//               name: plan.name,
//               amount: Math.round(totalAmount * 100),
//               currency: "INR",
//               quantity: 1,
//             },
//           ],
//         });
//         await razorpayInstance.invoices.issue(invoice.id);
//       } catch (err) {
//         console.error("Razorpay invoice error:", err);
//       }
//     }

//     res.status(200).json({
//       message: "Payment verified and subscription processed",
//       subscription,
//     });
//   } catch (error) {
//     console.error("Error verifying Razorpay payment:", error);
//     res.status(500).json({ message: "Error verifying payment" });
//   }
// };

// Verify Payment




export const verifyRazorpayPayment = async (req: Request, res: Response): Promise<any> => {
  const parseResult = verifyPlanPaymentSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ message: parseResult.error.errors });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, schoolId, couponCode, isTrial } =
    parseResult.data;

  try {
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!).update(body).digest("hex");
    const paymentDetails = await razorpayInstance.payments.fetch(razorpay_payment_id);
    console.log("🔍 Razorpay Payment Details:", paymentDetails);
    // const paymentMethod = paymentDetails.method;
    const paymentMethod = paymentDetails?.method || "UNKNOWN";

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const payment = await prisma.payment.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
    });

    if (!payment) {
      console.warn("❗ Payment not found for Razorpay Order ID:", razorpay_order_id);
      return res.status(404).json({ message: "Payment not found" });
    }
    if (payment.planId !== planId || payment.schoolId !== schoolId) {
      return res.status(400).json({ message: "Payment details mismatch" });
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        status: "SUCCESS",
        paymentDate: new Date(),
        paymentMethod,
      },
    });

    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    let coupon;
    if (couponCode) {
      coupon = await prisma.coupon.findFirst({ where: { code: couponCode, planId } });
      if (!coupon) return res.status(404).json({ message: "Coupon not found" });
      if (new Date() > coupon.expiryDate || coupon.usedCount >= coupon.maxUsage) {
        return res.status(400).json({ message: "Coupon is not valid" });
      }
    }

    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        schoolId,
        isActive: true,
        endDate: { gte: new Date() },
      },
    });

    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      include: { user: true },
    });

    let discount = 0;
    const previousSubscriptions = await prisma.subscription.count({ where: { schoolId } });
    if (previousSubscriptions === 0) {
      if (plan.durationDays >= 360) discount += plan.price * 0.2;
      else if (plan.durationDays >= 180) discount += plan.price * 0.1;
    }

    if (coupon) {
      const couponDiscount =
        coupon.discountType === "FLAT" ? coupon.discountValue : (plan.price * coupon.discountValue) / 100;
      discount += couponDiscount;
    }

    const { baseAmount, gstAmount, totalAmount } = calculateAmounts(plan.price, discount, isTrial);
    const duration = isTrial ? 15 : plan.durationDays;

    const subscriptionData = {
      planId,
      schoolId,
      startDate: new Date(),
      endDate: new Date(Date.now() + duration * 86400000),
      paymentId: payment.id,
      orderId: razorpay_order_id,
      receipt: `receipt_${Date.now()}`,
      status: "SUCCESS" as const,
      isActive: true,
      couponId: coupon?.id,
    };

    const subscription = activeSubscription
      ? await prisma.subscription.update({ where: { id: activeSubscription.id }, data: subscriptionData })
      : await prisma.subscription.create({ data: subscriptionData });

    if (coupon) {
      await prisma.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    // Generate and send invoice PDF
    if (school?.user?.email) {
      await createPlanInvoice(subscription.id);
    }

    return res.status(200).json({
      message: "Payment verified and subscription processed",
      subscription,
    });
  } catch (error: any) {
    console.error("❌ Error verifying Razorpay payment:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    return res.status(500).json({
      message: "Error verifying payment",
      debug: error.message, // TEMP: helps frontend log exact failure
    });
  }
};





// Handle Razorpay Webhook
export const razorpayWebhook = async (req: Request, res: Response): Promise<any> => {
  try {
    const parseResult = razorpayWebhookSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ message: parseResult.error.errors });
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const signature = req.headers["x-razorpay-signature"] as string;

    const body = JSON.stringify(req.body);
    const expectedSignature = crypto.createHmac("sha256", secret).update(body).digest("hex");

    if (expectedSignature !== signature) {
      console.warn("❌ Webhook signature verification failed");
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const { event, payload } = parseResult.data;

    if (event === "payment.failed") {
      const orderId = payload.payment.entity.order_id;

      const existingPayment = await prisma.payment.findUnique({
        where: { razorpayOrderId: orderId },
      });

      if (existingPayment && existingPayment.status !== "FAILED") {
        await prisma.payment.update({
          where: { id: existingPayment.id },
          data: { status: "FAILED", failureReason: payload.payment.entity.error_description || "Unknown" },
        });

        console.log(`🔻 Payment failed for order ${orderId}`);
      }
    }

    // Handle other webhook events if needed here (e.g., payment.captured)

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

import cron from 'node-cron';
import { prisma } from '../db/prisma';
import { razorpayInstance } from '../config/razorpay';
import { sendInvoiceEmail } from '../utils/mailer';

// Check subscriptions daily at midnight
cron.schedule('0 0 * * *', async () => {
  const now = new Date();
  const expiring = await prisma.subscription.findMany({
    where: {
      isActive: true,
      endDate: { lte: now },
    },
    include: { school: { include: { user: true } }, plan: true },
  });

  for (const sub of expiring) {
    await prisma.subscription.update({
      where: { id: sub.id },
      data: { isActive: false },
    });
    if (sub.school.user?.email) {
      await sendInvoiceEmail(
        sub.school.user.email,
        `EXP-${sub.id}`,
        sub.plan.price
      );
    }
  }

  const renewals = await prisma.subscription.findMany({
    where: {
      isActive: true,
      endDate: { lte: new Date(now.getTime() + 24 * 60 * 60 * 1000) },
    },
    include: { school: { include: { user: true } }, plan: true },
  });

  for (const sub of renewals) {
    try {
      const order = await razorpayInstance.orders.create({
        amount: sub.plan.price * 100,
        currency: 'INR',
        receipt: `renew_${Date.now()}`,
      });

      const payment = await prisma.payment.create({
        data: {
          amount: sub.plan.price,
          razorpayOrderId: order.id,
          status: 'Pending',
        },
      });

      await prisma.subscription.create({
        data: {
          planId: sub.planId,
          schoolId: sub.schoolId,
          startDate: now,
          endDate: new Date(
            now.getTime() + sub.plan.durationDays * 86400000
          ),
          paymentId: payment.id,
          orderId: order.id,
          receipt: order.receipt,
          status: 'PENDING',
          userLimit: sub.userLimit ?? undefined,
        },
      });

      if (sub.school.user?.email) {
        await sendInvoiceEmail(
          sub.school.user.email,
          order.id,
          sub.plan.price
        );
      }
    } catch (err) {
      console.error('Auto renewal failed', err);
    }
  }
});

export {}; 

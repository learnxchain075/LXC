import { Request, Response } from "express";
import { prisma } from "../../db/prisma";
import {
  schoolIdParamSchema,
  studentIdParamSchema,
} from "../../validations/common/commonValidation";
import { transactionQuerySchema } from "../../validations/payment/paymentTransactionValidation";

// Get All Transaction for a School

export const getAllTransactionsForSchool = async (req: Request, res: Response) => {
  const parseResult = schoolIdParamSchema.safeParse(req.params);
  if (!parseResult.success) {
    res.status(400).json({ success: false, message: parseResult.error.errors });
    return;
  }
  const { schoolId } = parseResult.data;

  try {
    const payments = await prisma.payment.findMany({
      where: {
        fee: {
          schoolId: schoolId,
        },
      },
      include: {
        fee: {
          include: {
            student: true,  // Get student details from fee.studentId
            school: true,   // Get school details from fee.schoolId
          },
        },
        Student: true, // optional — for backwards compatibility
      },
    });

    res.json({ success: true, data: payments });
  } catch (error) {
    console.error("Error fetching school transactions:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



// Get All Transaction for Plans



export const getAllTransactionsForPlans = async (req: Request, res: Response): Promise<any> => {
  const queryResult = transactionQuerySchema.safeParse(req.query);

  if (!queryResult.success) {
    return res.status(400).json({
      success: false,
      message: queryResult.error.errors,
    });
  }

  const { page, limit } = queryResult.data;
  const skip = (page - 1) * limit;

  try {
    const payments = await prisma.payment.findMany({
      where: {
        subscription: {
          some: {}, // Ensures payment is linked to at least one subscription
        },
      },
      include: {
        subscription: {
          include: {
            plan: true,   // Include plan details
            school: true, // Include school details
          },
        },
        fee: true,
        Student: true,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc', // Newest first
      },
    });

    const formatted = payments.map((payment) => ({
      transactionId: payment.id,
      providerName: payment.subscription[0]?.school?.schoolName || "N/A",
      planType: payment.subscription[0]?.plan?.name || "N/A",
      transactionDate: payment.createdAt,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      startDate: payment.subscription[0]?.startDate || null,
      endDate: payment.subscription[0]?.endDate || null,
      status: payment.status,
    }));

    return res.json({
      success: true,
      data: formatted,
      total: formatted.length,
    });
  } catch (error) {
    console.error("Error fetching plan transactions:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

  

// Get All Transaction for a Student


export const getAllTransactionsForStudent = async (req: Request, res: Response) => {
  const parseResult = studentIdParamSchema.safeParse(req.params);
  if (!parseResult.success) {
    res.status(400).json({ success: false, message: parseResult.error.errors });
    return;
  }
  const { studentId } = parseResult.data;

  try {
    const payments = await prisma.payment.findMany({
      where: {
        fee: {
          studentId: studentId,
        },
      },
      include: {
        fee: {
          include: {
            student: true, // Include full student details
            school: true,  // Include school details
          },
        },
      },
    });

    res.json({ success: true, data: payments });
  } catch (error) {
    console.error("Error fetching student transactions:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

  


// Get Subscription of a School
export const getSubscriptionOfSchool = async (req: Request, res: Response) => {
  const parseResult = schoolIdParamSchema.safeParse(req.params);
  if (!parseResult.success) {
    res.status(400).json({ success: false, message: parseResult.error.errors });
    return;
  }
  const { schoolId } = parseResult.data;

  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        schoolId: schoolId,
      },
      include: {
        plan: true,
        school: true,
      },
    });

    res.json({ success: true, data: subscriptions });
  } catch (error) {
    console.error("Error fetching subscriptions for school:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

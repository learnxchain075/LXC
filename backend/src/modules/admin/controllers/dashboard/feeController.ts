import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import { createFeeSchema, updateFeeSchema } from "../../../../validations/Module/AdminDashboard/feeValidation";
import { schoolIdParamSchema, studentIdParamSchema, cuidSchema } from "../../../../validations/common/commonValidation";
import { z } from "zod";

// Create fee

export const createFee = async (req: Request, res: Response): Promise<any> => {
  const parsed = createFeeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
  }

  const { studentId, amount, dueDate, finePerDay, category, schoolId } = parsed.data;

  try {
    const fee = await prisma.fee.create({
      data: {
        studentId,
        amount,
        dueDate,
        finePerDay,
        category,
        schoolId,
        status: "PENDING",
        amountPaid: 0,
        createdAt: new Date(),
      },
    });

    res.status(201).json(fee);
  } catch (error: any) {
    console.error("Fee creation error:", error);
    res.status(500).json({ error: error.message || "Unknown error" });
  }
};

// Get all fees

export const getAllFees = async (req: Request, res: Response) => {
  try {
    const fees = await prisma.fee.findMany({
      include: {
        student: true, 
        Payment: true, 
      },
    });
    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ error: "Error fetching fees" });
  }
};

// Get fee by id

export const getFeeById = async (req: Request, res: Response): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }
  const { id } = params.data;
  try {
    const fee = await prisma.fee.findUnique({
      where: { id },
      include: {
        student: true, // Include student details
        Payment: true, // Include payment details
      },
    });
    if (!fee) res.status(404).json({ error: "Fee not found" });
    res.status(200).json(fee);
  } catch (error) {
    res.status(500).json({ error: "Error fetching fee" });
  }
};

// Update a fee

export const updateFee = async (req: Request, res: Response): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  const body = updateFeeSchema.safeParse(req.body);
  if (!params.success || !body.success) {
    return res.status(400).json({
      errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)],
    });
  }
  const { id } = params.data;
  const { amount, dueDate, finePerDay, status } = body.data;
  try {
    const fee = await prisma.fee.update({
      where: { id },
      data: { amount, dueDate, finePerDay, status },
    });
    res.status(200).json(fee);
  } catch (error) {
    res.status(500).json({ error: "Error updating fee" });
  }
};

// delete a fee

export const deleteFee = async (req: Request, res: Response): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }
  const { id } = params.data;
  try {
    await prisma.fee.delete({ where: { id } });
    res.status(200).json({ message: "Fee deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting fee" });
  }
};

// get overdue fees

export const getOverdueFees = async (req: Request, res: Response) => {
  try {
    const fees = await prisma.fee.findMany({
      where: {
        status: "PENDING",
        dueDate: {
          lt: new Date(),
        },
      },
    });
    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ error: "Error fetching overdue fees" });
  }
};

// Get fees for a specific student
export const getFeesByStudentId = async (req: Request, res: Response): Promise<any> => {
  const params = studentIdParamSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }
  const { studentId } = params.data;

  try {
    const fees = await prisma.fee.findMany({
      where: { studentId },
      include: {
        Payment: true, // Optional: include all related payments if you want to show history
      },
    });

    if (!fees || fees.length === 0) {
      return res.status(404).json({ message: "No fees found for this student" });
    }

    res.status(200).json(fees);
  } catch (error) {
    console.error("Error fetching student fees:", error);
    res.status(500).json({ error: "Error fetching student fees" });
  }
};

// Get fees for a specific school

// export const getFeesBySchoolId = async (req: Request, res: Response): Promise<any> => {
//   const params = schoolIdParamSchema.safeParse(req.params);
//   if (!params.success) {
//     return res.status(400).json({ errors: params.error.errors });
//   }
//   const { schoolId } = params.data;

//   try {
//     const fees = await prisma.fee.findMany({
//       where: { schoolId },
//       include: {
//         Payment: true, // Optional: include all related payments if you want to show history
//       },
//     });

//     if (!fees || fees.length === 0) {
//       return res.status(404).json({ message: "No fees found for this school" });
//     }

//     res.status(200).json(fees);
//   } catch (error) {
//     console.error("Error fetching school fees:", error);
//     res.status(500).json({ error: "Error fetching school fees" });
//   }
// };

export const getFeesBySchoolId = async (req: Request, res: Response): Promise<any> => {
  const params = schoolIdParamSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }
  const { schoolId } = params.data;

  try {
    const fees = await prisma.fee.findMany({
      where: { schoolId },
      include: {
        Payment: true,
        student: {
          include: {
            user: true,   // for student name
            class: true,  // for class name
          },
        },
      },
    });

    if (!fees || fees.length === 0) {
      return res.status(404).json({ message: "No fees found for this school" });
    }

    const formattedFees = fees.map((fee) => ({
      feeId: fee.id,
      studentName: fee.student.user.name,
      className: fee.student.class.name,
      amount: fee.amount,
      amountPaid: fee.amountPaid,
      dueDate: fee.dueDate,
      status: fee.status,
      discount: fee.discount,
      finePerDay: fee.finePerDay,
      scholarship: fee.scholarship,
      paymentDate: fee.paymentDate,
      payments: fee.Payment,
    }));

    res.status(200).json(formattedFees);
  } catch (error) {
    console.error("Error fetching school fees:", error);
    res.status(500).json({ error: "Error fetching school fees" });
  }
};







// Get fees for a specific category

export const getFeesByCategory = async (req: Request, res: Response) :Promise<any> => {
  const params = z.object({ category: z.string().min(1) }).safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }
  const { category } = params.data;

  try {
    const fees = await prisma.fee.findMany({
      where: { category },
      include: {
        Payment: true, // Optional: include all related payments if you want to show history
      },
    });

    if (!fees || fees.length === 0) {
      return res.status(404).json({ message: "No fees found for this category" });
    }

    res.status(200).json(fees);
  } catch (error) {
    console.error("Error fetching category fees:", error);
    res.status(500).json({ error: "Error fetching category fees" });
  }
};

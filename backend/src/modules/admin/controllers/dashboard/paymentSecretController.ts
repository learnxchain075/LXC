import { Request, Response } from "express";

import { prisma } from "../../../../db/prisma";
import {
  createPaymentSecretSchema,
  updatePaymentSecretSchema,
} from "../../../../validations/Module/AdminDashboard/paymentSecretValidation";
import { schoolIdParamSchema, cuidSchema } from "../../../../validations/common/commonValidation";
import { z } from "zod";

export const createPaymentSecret = async (req: Request, res: Response): Promise<any> => {
  try {
    const parsed = createPaymentSecretSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }
    const { keyId, keySecret, schoolId } = parsed.data;

    const existingSchool = await prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!existingSchool) {
      return res.status(404).json({ message: "School not found" });
    }

    const paymentSecret = await prisma.paymentSecret.create({
      data: {
        keyId,
        keySecret,
        school: {
          connect: { id: schoolId },
        },
      },
    });

    return res.status(200).json({
      message: "Payment Secret Admin registered successfully",
      paymentSecret,
    });
  } catch (error) {
    console.error("Error registering Payment Secret admin:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

// Get all payment secrets

export const getAllPaymentSecrets = async (req: Request, res: Response) => {
  try {
    const paymentSecrets = await prisma.paymentSecret.findMany({
      include: {
        school: true,
      },
    });

    res.status(200).json(paymentSecrets);
  } catch (error) {
    console.error("Error fetching payment secrets:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Get payment secret by id

export const getPaymentSecretById = async (req: Request, res: Response): Promise<any> => {
  try {
    const params = z.object({ id: cuidSchema }).safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const { id } = params.data;

    const paymentSecret = await prisma.paymentSecret.findUnique({
      where: { id },
      include: {
        school: true,
      },
    });

    res.status(200).json(paymentSecret);
  } catch (error) {
    console.error("Error fetching payment secret:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Update a payment secret

export const updatePaymentSecret = async (req: Request, res: Response): Promise<any> => {
  try {
    const params = z.object({ id: cuidSchema }).safeParse(req.params);
    const body = updatePaymentSecretSchema.safeParse(req.body);
    if (!params.success || !body.success) {
      return res.status(400).json({
        errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)],
      });
    }
    const { id } = params.data;
    const { keyId, keySecret } = body.data;

    const paymentSecret = await prisma.paymentSecret.update({
      where: { id },
      data: {
        keyId,
        keySecret,
      },
    });
    res.status(200).json({ message: "Payment Secret updated successfully", paymentSecret });
  } catch (error) {
    console.error("Error updating payment secret:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Delete a payment secret

export const deletePaymentSecret = async (req: Request, res: Response): Promise<any> => {
  try {
    const params = z.object({ id: cuidSchema }).safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const { id } = params.data;

    const paymentSecret = await prisma.paymentSecret.delete({
      where: { id },
    });

    res.status(200).json({ message: "Payment Secret deleted successfully", paymentSecret });
  } catch (error) {
    console.error("Error deleting payment secret:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Get a payment secret by school id

export const getPaymentSecretBySchoolId = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log("Received schoolId:", req.params.schoolId);
    const params = schoolIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ errors: params.error.errors });
    }
    const { schoolId } = params.data;

    const paymentSecret = await prisma.paymentSecret.findUnique({
      where: { schoolId },
      include: { school: true },
    });

    if (!paymentSecret) {
      res.status(404).json({ message: "Payment secret not found" });
      return;
    }

    res.status(200).json(paymentSecret);
  } catch (error) {
    console.error("Error fetching payment secret:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

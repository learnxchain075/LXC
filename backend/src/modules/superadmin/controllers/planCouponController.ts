import { Request, Response } from "express";
import { prisma } from "../../../db/prisma";
import {
  couponSchema,
  couponUpdateSchema,
  couponIdParamSchema,
  couponCodeSchema,
} from "../../../validations/Module/SuperadminDashboard/planCouponValidation";

// Create coupon
export const createCoupon = async (req: Request, res: Response): Promise<any> => {
  const parsed = couponSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
  }

  const { code, discountType, discountValue, expiryDate, maxUsage, planId } = parsed.data;

  try {
    // Check if a coupon with the same code already exists
    const existingCoupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (existingCoupon) {
      return res.status(409).json({ error: "Coupon code already exists." });
    }

    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code,
        discountType,
        discountValue,
        expiryDate: new Date(expiryDate),
        maxUsage,
        planId,
      },
    });

    res.status(201).json(coupon);
  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Get all coupons
export const getAllCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await prisma.coupon.findMany();
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ error: "Error fetching coupons" });
  }
};

// Get coupon by id

export const getCouponById = async (req: Request, res: Response): Promise<any> => {
  const params = couponIdParamSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ message: "Invalid id", errors: params.error.errors });
  }

  const { id } = params.data;
  try {
    const coupon = await prisma.coupon.findUnique({ where: { id } });
    if (!coupon) return res.status(404).json({ error: "Coupon not found" });
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ error: "Error fetching coupon" });
  }
};

// Update coupon

export const updateCoupon = async (req: Request, res: Response) :Promise<any> => {
  const params = couponIdParamSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ message: "Invalid id", errors: params.error.errors });
  }

  const body = couponUpdateSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ message: "Validation failed", errors: body.error.errors });
  }

  const { id } = params.data;
  const { code, discountType, discountValue, expiryDate, maxUsage, planId } = body.data;
  try {
    let plan;
    if (planId) {
      plan = await prisma.plan.findUnique({ where: { id: planId } });
      if (!plan) {
        return res.status(404).json({ error: "Plan not found" });
      }
    }

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        code,
        discountType,
        discountValue,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        maxUsage,
        planId: planId ?? undefined,
      },
    });
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ error: "Error updating coupon" });
  }
};

// Delete coupon

export const deleteCoupon = async (req: Request, res: Response):Promise<any> => {
  const params = couponIdParamSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ message: "Invalid id", errors: params.error.errors });
  }

  const { id } = params.data;
  try {
    await prisma.coupon.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting coupon" });
  }
};

// Validate coupon

export const validateCoupon = async (req: Request, res: Response): Promise<any> => {
  const parsed = couponCodeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
  }

  const { code, planId } = parsed.data;
  try {
    const coupon = await prisma.coupon.findFirst({ where: { code, planId } });
    if (!coupon) return res.status(404).json({ error: "Coupon not found" });
    if (new Date() > coupon.expiryDate) return res.status(400).json({ error: "Coupon expired" });
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ error: "Error validating coupon" });
  }
};

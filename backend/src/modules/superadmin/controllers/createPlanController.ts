import { Request, Response } from "express";
import { prisma } from "../../../db/prisma";
import { planSchema, planIdParamSchema } from "../../../validations/Module/SuperadminDashboard/planValidation";

// Create plan

export const createPlan = async (req: Request, res: Response) => {
  try {
    const parseResult = planSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({ message: "Validation failed", errors: parseResult.error.errors });
      return;
    }

    // If validation passes, extract the validated data

    const { name, price, durationDays, discountedPrice,userLimit } = parseResult.data;

    if (!name || !price || !durationDays) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const plan = await prisma.plan.create({
      data: {
        name,
        price,
        durationDays,
        userLimit,
        discountedPrice: discountedPrice ?? null,
      },
    });

    res.status(200).json({
      message: "Plan created successfully",
      plan,
    });
  } catch (error) {
    console.error("Error creating plan:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Get all plans

export const getAllPlans = async (req: Request, res: Response) => {
  try {
    const plans = await prisma.plan.findMany();

    res.status(200).json(plans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Get plan by id

export const getPlanById = async (req: Request, res: Response):Promise<any> => {
  try {
    const params = planIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ message: "Invalid id", errors: params.error.errors });
    }

    const { id } = params.data;

    const plan = await prisma.plan.findUnique({
      where: {
        id: id,
      },
    });

    res.status(200).json(plan);
  } catch (error) {
    console.error("Error fetching plan:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Update plan

export const updatePlan = async (req: Request, res: Response): Promise<any> => {
  try {
    const params = planIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ message: "Invalid id", errors: params.error.errors });
    }

    const { id } = params.data;

    const parseResult = planSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parseResult.error.errors,
      });
    }

    const { name, price, discountedPrice, durationDays } = parseResult.data;

    if (!name || !price || !durationDays) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const plan = await prisma.plan.update({
      where: { id },
      data: {
        name,
        price,
        discountedPrice: discountedPrice ?? null,
        durationDays,
      },
    });

    res.status(200).json({
      message: "Plan updated successfully",
      plan,
    });
  } catch (error) {
    console.error("Error updating plan:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Delete plan

export const deletePlan = async (req: Request, res: Response):Promise<any> => {
  try {
    const params = planIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ message: "Invalid id", errors: params.error.errors });
    }

    const { id } = params.data;

    const plan = await prisma.plan.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json({
      message: "Plan deleted successfully",
      plan,
    });
  } catch (error) {
    console.error("Error deleting plan:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

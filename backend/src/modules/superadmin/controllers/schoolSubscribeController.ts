import { Request, Response } from "express";
import { prisma } from "../../../db/prisma";
import { FeaturesListObj } from "../../../constants";
import {
  subscribeSchema,
  upgradeSchema,
  subscriptionIdParamSchema,
  schoolIdParamSchema,
  planIdParamSchema,
} from "../../../validations/Module/SuperadminDashboard/schoolSubscribeValidation";

// Function to approve all modules for a school


// const approveAllModulesForSchool = async (schoolId: string) => {
//   const school = await prisma.school.findUnique({ where: { id: schoolId } });
//   if (!school || !school.userId) return;

//   for (const feature of FeaturesListObj) {
//     const modules = [feature.name, ...(feature.subModules || [])];

//     for (const moduleName of modules) {
//       const existing = await prisma.userPermissions.findFirst({
//         where: { userId: school.userId, moduleName },
//       });

//       if (!existing) {
//         await prisma.userPermissions.create({
//           data: {
//             userId: school.userId,
//             moduleName,
//             modulePermission: "11111",
//             status: 1,
//           },
//         });
//       } else if (existing.status === 0) {
//         await prisma.userPermissions.update({
//           where: { id: existing.id },
//           data: { status: 1 },
//         });
//       }
//     }
//   }
// };

export const approveAllModulesForSchool = async (schoolId: string) => {
  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    select: { userId: true },
  });

  if (!school?.userId) return;

  const userId = school.userId;

  // Get all module names including submodules
  const allModules: string[] = FeaturesListObj.flatMap((feature) => [feature.name, ...(feature.subModules || [])]);

  // Fetch existing permissions for the user
  const existingPermissions = await prisma.userPermissions.findMany({
    where: {
      userId,
      moduleName: { in: allModules },
    },
  });

  const existingMap = new Map(existingPermissions.map((perm) => [perm.moduleName, perm]));

  const permissionsToCreate: {
    userId: string;
    moduleName: string;
    modulePermission: string;
    status: number;
  }[] = [];

  const permissionsToUpdate: number[] = [];

  for (const moduleName of allModules) {
    const existing = existingMap.get(moduleName);

    if (!existing) {
      permissionsToCreate.push({
        userId,
        moduleName,
        modulePermission: "11111", // full access
        status: 1,
      });
    } else if (existing.status === 0) {
      permissionsToUpdate.push(existing.id);
    }
    // If already exists and is active (status 1), do nothing
  }

  // Create new permissions in bulk
  if (permissionsToCreate.length > 0) {
    await prisma.userPermissions.createMany({
      data: permissionsToCreate,
      skipDuplicates: true, // avoid error on rare race condition
    });
  }

  // Update inactive permissions to active
  if (permissionsToUpdate.length > 0) {
    await Promise.all(
      permissionsToUpdate.map((id) =>
        prisma.userPermissions.update({
          where: { id },
          data: { status: 1 },
        })
      )
    );
  }

  // ✅ Optionally log result
  console.log(`✅ Permissions approved for school ${schoolId}:`);
  console.log("New permissions:", permissionsToCreate.length);
  console.log("Reactivated permissions:", permissionsToUpdate.length);
};

// School Subsribe to Plan

export const subscribeToPlan = async (req: Request, res: Response): Promise<any> => {
  const parsed = subscribeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
  }

  const { schoolId, planId, paymentId, couponCode } = parsed.data;

  try {
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) {
      res.status(404).json({ error: "Plan not found" });
      return;
    }

    // Check for any active subscription for the school
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        schoolId,
        isActive: true,
        endDate: { gte: new Date() },
      },
    });

    let discount = 0;
    let coupon = null;

    const previousSubscriptions = await prisma.subscription.count({ where: { schoolId } });

    // If coupon code is passed, validate it
    if (couponCode) {
      coupon = await prisma.coupon.findFirst({ where: { code: couponCode, planId } });

      if (!coupon) {
        res.status(400).json({ error: "Invalid coupon code" });
        return;
      }

      if (new Date(coupon.expiryDate) < new Date()) {
        res.status(400).json({ error: "Coupon expired" });
        return;
      }

      if (coupon.usedCount >= coupon.maxUsage) {
        res.status(400).json({ error: "Coupon usage limit exceeded" });
        return;
      }

      // Calculate discount from coupon
      if (coupon.discountType === "PERCENTAGE") {
        discount += (plan.price * coupon.discountValue) / 100;
      } else if (coupon.discountType === "FLAT") {
        discount += coupon.discountValue;
      }
    }

    if (previousSubscriptions === 0) {
      if (plan.durationDays >= 360) {
        discount += plan.price * 0.2;
      } else if (plan.durationDays >= 180) {
        discount += plan.price * 0.1;
      }
    }

    // Apply discounted price if needed
    const finalPrice = Math.max(plan.price - discount, 0);

    // If an active subscription exists, update it instead of creating new
    if (activeSubscription) {
      const updatedSubscription = await prisma.subscription.update({
        where: { id: activeSubscription.id },
        data: {
          planId,
          paymentId,
          startDate: new Date(),
          endDate: new Date(Date.now() + plan.durationDays * 86400000),
          couponId: coupon ? coupon.id : undefined,
          isActive: true,
        },
      });

      if (coupon) {
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      await approveAllModulesForSchool(schoolId);
      res.status(200).json({ subscription: updatedSubscription, finalPrice, discountApplied: discount });
      return;
    }

    const subscription = await prisma.subscription.create({
      data: {
        schoolId,
        paymentId,
        planId,
        startDate: new Date(),
        endDate: new Date(Date.now() + plan.durationDays * 86400000),
        couponId: coupon ? coupon.id : undefined,
      },
    });

    // Increment coupon usage if coupon was applied
    if (coupon) {
      await prisma.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    await approveAllModulesForSchool(schoolId);
    res.status(201).json({ subscription, finalPrice, discountApplied: discount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error subscribing" });
  }
};

// Get all subscriptions

export const getAllSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptions = await prisma.subscription.findMany();
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching subscriptions" });
  }
};

// Get subscription by id --

export const getSubscriptionById = async (req: Request, res: Response): Promise<any> => {
  const params = subscriptionIdParamSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ message: "Invalid id", errors: params.error.errors });
  }

  const { id } = params.data;
  try {
    const subscription = await prisma.subscription.findUnique({ where: { id } });
    if (!subscription) res.status(404).json({ error: "Subscription not found" });
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ error: "Error fetching subscription" });
  }
};

// School Unsubscribe from Plan

export const unsubscribeFromPlan = async (req: Request, res: Response): Promise<any> => {
  const params = subscriptionIdParamSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ message: "Invalid id", errors: params.error.errors });
  }

  const { id } = params.data;
  try {
    const subscription = await prisma.subscription.findUnique({ where: { id } });
    if (!subscription) res.status(404).json({ error: "Subscription not found" });

    await prisma.subscription.delete({ where: { id } });

    res.status(200).json({ message: "Subscription deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting subscription" });
  }
};

// school upgrade plan

export const upgradePlan = async (req: Request, res: Response): Promise<any> => {
  const params = subscriptionIdParamSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ message: "Invalid id", errors: params.error.errors });
  }

  const body = upgradeSchema.safeParse(req.body);
  if (!body.success) {
    return res.status(400).json({ message: "Validation failed", errors: body.error.errors });
  }

  const { id } = params.data;
  const { planId } = body.data;
  try {
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) {
      res.status(404).json({ error: "Plan not found" });
      return;
    }

    const subscription = await prisma.subscription.update({
      where: { id },
      data: { planId, endDate: new Date(Date.now() + plan.durationDays * 86400000) },
    });

    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ error: "Error upgrading plan" });
  }
};

// Get all School Subscription

export const getAllSchoolSubscriptions = async (req: Request, res: Response): Promise<any> => {
  const params = schoolIdParamSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ message: "Invalid school id", errors: params.error.errors });
  }

  const { schoolId } = params.data;
  try {
    const subscriptions = await prisma.subscription.findMany({ where: { schoolId } });
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching subscriptions" });
  }
};

// Get all School Subscription

export const getSchoolSubscriptionById = async (req: Request, res: Response): Promise<any> => {
  const params = subscriptionIdParamSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ message: "Invalid id", errors: params.error.errors });
  }

  const { id } = params.data;
  try {
    const subscription = await prisma.subscription.findUnique({ where: { id } });
    if (!subscription) res.status(404).json({ error: "Subscription not found" });
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ error: "Error fetching subscription" });
  }
};

// Get all School Subscription

export const getSchoolSubscriptionByPlanId = async (req: Request, res: Response): Promise<any> => {
  const params = planIdParamSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ message: "Invalid plan id", errors: params.error.errors });
  }

  const { planId } = params.data;
  try {
    const subscriptions = await prisma.subscription.findMany({ where: { planId } });
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching subscriptions" });
  }
};

// Get all School Subscription

export const getSchoolSubscriptionBySchoolIdAndPlanId = async (req: Request, res: Response): Promise<any> => {
  const params = schoolIdParamSchema.merge(planIdParamSchema).safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ message: "Invalid parameters", errors: params.error.errors });
  }

  const { schoolId, planId } = params.data;

  try {
    const subscription = await prisma.subscription.findFirst({
      where: { schoolId, planId },
    });

    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    return res.status(200).json(subscription);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return res.status(500).json({ error: "Error fetching subscription" });
  }
};


// Get Active Subscription of a School 



export const getActiveSchoolSubscription = async (req: Request, res: Response): Promise<any> => {
  const params = schoolIdParamSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ message: "Invalid school id", errors: params.error.errors });
  }

  const { schoolId } = params.data;

  try {
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        schoolId,
        endDate: {
          gt: new Date(),
        },
      },
      orderBy: {
        startDate: "desc",
      },
      include: {
        plan: true, // Include plan details
      },
    });

    if (!activeSubscription) {
      return res.status(404).json({ message: "No active subscription found" });
    }

    // Calculate days remaining
    const today = new Date();
    const endDate = new Date(activeSubscription.endDate);
    const timeDiff = endDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    // Extract needed fields and return with plan name
    const {
      plan,
      planId: _planId, // ignore planId in response
      ...rest
    } = activeSubscription;

    res.status(200).json({
      ...rest,
      planName: plan?.name || "N/A",
      daysLeft,
    });
  } catch (error) {
    console.error("Error fetching active subscription:", error);
    res.status(500).json({ error: "Error fetching active subscription" });
  }
};

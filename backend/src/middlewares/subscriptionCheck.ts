// import { Request, Response, NextFunction } from 'express';
// import { prisma } from '../db/prisma';

// export const checkSubscription = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<any> => {
//   try {
//     const user: any = (req as any).user;
//     if (!user || !user.schoolId) {
//       return res.status(403).json({ message: 'Subscription required' });
//     }
//     const active = await prisma.subscription.findFirst({
//       where: {
//         schoolId: user.schoolId,
//         isActive: true,
//         endDate: { gte: new Date() },
//       },
//     });
//     if (!active) {
//       return res.status(403).json({ message: 'Subscription expired' });
//     }
//     next();
//   } catch (err) {
//     next(err);
//   }
// };

import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/prisma";

export const checkSubscription = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const user: any = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    if (user.role === "superadmin") {
      return next();
    }

    let schoolId: string | null = null;

    switch (user.role) {
      case "admin":
        schoolId = user.schoolId || null;
        break;

      case "teacher":
        const teacher = await prisma.teacher.findUnique({
          where: { id: user.teacherId },
          select: { schoolId: true },
        });
        schoolId = teacher?.schoolId || null;
        break;

      case "student":
        const student = await prisma.student.findUnique({
          where: { id: user.studentId },
          select: { schoolId: true },
        });
        schoolId = student?.schoolId || null;
        break;

      // case 'parent':
      //   const studentFromParentLogin = await prisma.student.findFirst({
      //     where: { userId: user.id },
      //     select: { schoolId: true },
      //   });
      //   schoolId = studentFromParentLogin?.schoolId || null;
      //   break;
      case "parent": {
        // Step 1: Get the parent record from the authenticated user
        const parentRecord = await prisma.parent.findUnique({
          where: { userId: user.id },
          select: { id: true },
        });

        if (!parentRecord) {
          return res.status(403).json({ message: "Parent record not found" });
        }

        // Step 2: Get any one student linked to this parent
        const studentLinkedToParent = await prisma.student.findFirst({
          where: {
            parent: {
              some: {
                id: parentRecord.id,
              },
            },
          },
          select: { schoolId: true },
        });

        schoolId = studentLinkedToParent?.schoolId || null;
        break;
      }

      case "library":
        const library = await prisma.library.findUnique({
          where: { id: user.libraryId },
          select: { schoolId: true },
        });
        schoolId = library?.schoolId || null;
        break;

      case "hostel":
        const hostel = await prisma.hostel.findUnique({
          where: { id: user.hostelId },
          select: { schoolId: true },
        });
        schoolId = hostel?.schoolId || null;
        break;

      case "transport":
        const transport = await prisma.transport.findUnique({
          where: { id: user.transportId },
          select: { schoolId: true },
        });
        schoolId = transport?.schoolId || null;
        break;

      case "account":
        const account = await prisma.account.findUnique({
          where: { id: user.accountId },
          select: { schoolId: true },
        });
        schoolId = account?.schoolId || null;
        break;

      default:
        return res.status(403).json({ message: "Unsupported role for subscription validation" });
    }

    if (!schoolId) {
      return res.status(403).json({ message: "School not associated with user" });
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        schoolId,
        isActive: true,
        endDate: { gte: new Date() },
      },
    });

    if (!subscription) {
      return res.status(403).json({ message: "Subscription expired or not found" });
    }

    next();
  } catch (err) {
    console.error("checkSubscription error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

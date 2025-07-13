import { Request, Response, NextFunction } from "express";
import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";
import {
  leaveRequestSchema,
  leaveIdParamSchema,
  schoolIdParamSchema,
} from "../../../validations/Module/SuperadminDashboard/leaveRequestValidation";

// Create Leave Request
export const createLeaveRequest = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const parsed = leaveRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
    }

    const { reason, fromDate, toDate, userId } = parsed.data;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: User information is missing" });
    }

    let targetUserId = req.user.id;

    // allow parents to submit leave on behalf of their child
    if (userId && req.user.role === "parent") {
      const parent = await prisma.parent.findUnique({
        where: { userId: req.user.id },
        include: { students: true },
      });

      const isChild = parent?.students.some((s) => s.userId === userId);
      if (!isChild) {
        return res.status(403).json({ error: "Not authorized for this student" });
      }
      targetUserId = userId;
    }

    const leave = await prisma.leaveRequest.create({
      data: {
        userId: targetUserId,
        reason,
        fromDate: new Date(fromDate),
        toDate: new Date(toDate),
      },
    });

    res.status(201).json(leave);
  } catch (err) {
    next(handlePrismaError(err));
  }
};

// Get all leave requests (admin/super admin)
export const getAllLeaveRequests = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const leaves = await prisma.leaveRequest.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(leaves);
  } catch (err) {
    next(handlePrismaError(err));
  }
};

// Approve leave request
export const approveLeaveRequest = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = leaveIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ message: "Invalid id", errors: params.error.errors });
    }

    const { id } = params.data;
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: User information is missing" });
    }

    const approverRole = req.user.role;

    const leave = await prisma.leaveRequest.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!leave) return res.status(404).json({ error: "Leave request not found" });

    const requesterRole = leave.user.role;

    // Approval Logic
    const canApprove =
      ((requesterRole === "teacher" || requesterRole === "staff") && approverRole === "admin") ||
      (requesterRole === "student" && (approverRole === "teacher" || approverRole === "admin")) ||
      (requesterRole === "employee" && approverRole === "superadmin");

    if (!canApprove) {
      return res.status(403).json({ error: "You are not authorized to approve this request" });
    }

    const updatedLeave = await prisma.leaveRequest.update({
      where: { id },
      data: {
        isApproved: "APPROVED",
        status: "APPROVED",
      },
    });

    res.json(updatedLeave);
  } catch (err) {
    next(handlePrismaError(err));
  }
};

// Reject leave request
export const rejectLeaveRequest = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = leaveIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ message: "Invalid id", errors: params.error.errors });
    }

    const { id } = params.data;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: User information is missing" });
    }

    const approverRole = req.user.role;

    const leave = await prisma.leaveRequest.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!leave) return res.status(404).json({ error: "Leave request not found" });

    const requesterRole = leave.user.role;

    // Rejection Logic (same as approval)
    const canApprove =
      ((requesterRole === "teacher" || requesterRole === "staff") && approverRole === "admin") ||
      (requesterRole === "student" && (approverRole === "teacher" || approverRole === "admin")) ||
      (requesterRole === "employee" && approverRole === "superadmin");

    if (!canApprove) {
      return res.status(403).json({ error: "You are not authorized to reject this request" });
    }

    const updatedLeave = await prisma.leaveRequest.update({
      where: { id },
      data: {
        isApproved: "REJECTED",
        status: "REJECTED",
      },
    });

    res.json(updatedLeave);
  } catch (err) {
    next(handlePrismaError(err));
  }
};

// Get my leave requests
export const getMyLeaves = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: User information is missing" });
    }

    const myLeaves = await prisma.leaveRequest.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(myLeaves);
  } catch (err) {
    next(handlePrismaError(err));
  }
};

export const getLeaveRequestsBySchool = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = schoolIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ message: "Invalid school id", errors: params.error.errors });
    }

    const { schoolId } = params.data;

    // Step 1: Find users linked to the given schoolId through their respective role models
    const usersInSchool = await prisma.user.findMany({
      where: {
        OR: [
          { student: { schoolId } },
          { teacher: { schoolId } },

          // { librarian: { schoolId } },
          // { receptionist: { schoolId } },
          // { accountant: { schoolId } },
          // { school: { schoolId } }, // Optional: if you have admin model
        ],
      },
      select: { id: true },
    });

    const userIds = usersInSchool.map((user) => user.id);

    if (userIds.length === 0) {
      return res.status(200).json([]); // No users found for school
    }

    // Step 2: Fetch leave requests of those users
    const leaves = await prisma.leaveRequest.findMany({
      where: {
        userId: { in: userIds },
      },
      include: {
        user: {
          include: {
            student: true,
            teacher: true,
            parent: true,
            // librarian: true,
            // receptionist: true,
            // accountant: true,
            // admin: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(leaves);
  } catch (err) {
    next(handlePrismaError(err));
  }
};

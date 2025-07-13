import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";

// Get leave requests of students belonging to classes assigned to a teacher
export const getTeacherStudentsLeaveRequests = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { teacherId } = req.params;

    if (!teacherId) {
      return res.status(400).json({ error: "teacherId is required" });
    }

    const classes = await prisma.class.findMany({
      where: {
        Teacher: {
          some: { id: teacherId },
        },
      },
      select: { id: true },
    });

    const classIds = classes.map((c) => c.id);

    if (classIds.length === 0) {
      return res.status(404).json({ error: "No classes found for this teacher" });
    }

    const students = await prisma.student.findMany({
      where: { classId: { in: classIds } },
      select: { userId: true },
    });

    const userIds = students.map((s) => s.userId);

    if (userIds.length === 0) {
      return res.status(200).json([]);
    }

    const leaves = await prisma.leaveRequest.findMany({
      where: { userId: { in: userIds } },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(leaves);
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    return res.status(500).json({ error: (error as any).message });
  }
};

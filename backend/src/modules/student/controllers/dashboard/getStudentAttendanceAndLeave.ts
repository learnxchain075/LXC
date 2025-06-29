import { Request, Response } from 'express';
import { prisma } from '../../../../db/prisma';
import { studentIdParamSchema } from '../../../../validations/Module/StudentDashboard/getStudentAttendanceAndLeaveValidation';


export const getStudentAttendanceAndLeave = async (req: Request, res: Response):Promise<any> => {
  const paramsResult = studentIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { studentId } = paramsResult.data;

  try {

    // 🟢 Fetch attendance records
    const attendanceRecords = await prisma.attendance.findMany({
      where: { studentId },
      include: {
        lesson: {
          select: {
            id: true,
            name: true,
            day: true,
            startTime: true,
            endTime: true,
            subject: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    // 🟢 Fetch leave requests
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { userId: true }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const leaveRequests = await prisma.leaveRequest.findMany({
      where: { userId: student.userId },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      attendance: attendanceRecords,
      leaveRequests
    });
  } catch (error) {
    console.error('Error fetching student data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

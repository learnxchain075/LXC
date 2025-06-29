import { Request, Response } from 'express';
import { prisma } from '../../../../db/prisma';
import { studentIdParamSchema } from '../../../../validations/Module/StudentDashboard/getStudentNoticesEventsHolidaysValidation';


export const getStudentNoticesEventsHolidays = async (req: Request, res: Response):Promise<any> => {
  const paramsResult = studentIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { studentId } = paramsResult.data;

  try {

    // Get student and schoolId
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        schoolId: true,
        classId: true,
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const { schoolId, classId } = student;

    // 🟢 Fetch notices targeted to students
    const notices = await prisma.notice.findMany({
      where: {
        schoolId,
        recipients: {
          some: {
            userType: 'STUDENT'
          }
        }
      },
      include: {
        recipients: true,
        creator: {
          select: {
            name: true,
            email: true,
            profilePic: true
          }
        }
      },
      orderBy: {
        publishDate: 'desc'
      }
    });

    // 🟢 Fetch holidays for the student's school
    const holidays = await prisma.holiday.findMany({
      where: {
        schoolId
      },
      orderBy: {
        date: 'asc'
      }
    });

    // 🟢 Fetch events targeted to student's class or to all (targetAudience: ALL)
    const events = await prisma.event.findMany({
      where: {
        schoolId,
        OR: [
          { targetAudience: 'ALL' },
          {
            Class: {
              some: {
                id: classId
              }
            }
          }
        ]
      },
      include: {
        roles: true,
        sections: true
      },
      orderBy: {
        start: 'asc'
      }
    });

    return res.status(200).json({
      success: true,
      notices,
      holidays,
      events
    });
  } catch (error) {
    console.error('Error fetching student dashboard data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

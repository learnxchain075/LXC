import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import { studentIdParamSchema } from "../../../../validations/Module/StudentDashboard/getLessonsForStudentValidation";

export const getLessonsForStudentController = async (req: Request, res: Response): Promise<any> => {
  const paramsResult = studentIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { studentId } = paramsResult.data;

  try {
    // 2. Find student with classId
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        classId: true,
        class: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    // 3. Get lessons for the class
    const lessons = await prisma.lesson.findMany({
      where: {
        classId: student.classId,
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
        teacher: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
                email: true,
                profilePic: true,
              },
            },
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });

    // 4. Return lessons
    return res.status(200).json({ success: true, lessons });
  } catch (error) {
    console.error("Error fetching lessons for student:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

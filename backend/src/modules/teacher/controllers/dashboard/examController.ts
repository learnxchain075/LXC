import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import {
  createExamSchema,
  updateExamSchema,
  scheduleExamSchema,
  createExamAttendanceSchema,
} from "../../../../validations/Module/TeacherDashboard/examValidation";

// Create Exam
export const createExam = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = createExamSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.error.errors });
    }

    const exam = await prisma.exam.create({
      data: { ...result.data },
    });

    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Get All Exams
export const getExams = async (_req: Request, res: Response): Promise<any> => {
  try {
    const exams = await prisma.exam.findMany();
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Get Exams by Class ID
// export const getExamsByClassId = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { classId } = req.params;
//     if (!classId) return res.status(400).json({ error: "classId is required." });

//     const exams = await prisma.exam.findMany({
//       where: { classId },
//     });

//     res.json(exams);
//   } catch (error) {
//     res.status(500).json({ error: (error as any).message });
//   }
// };

export const getExamsByClassId = async (req: Request, res: Response): Promise<any> => {
  try {
    const { classId } = req.params;
    if (!classId) return res.status(400).json({ error: "classId is required." });

    const exams = await prisma.exam.findMany({
      where: { classId },
      include: {
        subject: true, // Include subject to access name
      },
      orderBy: {
        startTime: "asc", // optional: sort by startTime
      },
    });

    const formattedExams = exams.map((exam) => ({
      id: exam.id,
      title: exam.title,
      startTime: exam.startTime,
      endTime: exam.endTime,
      scheduleDate: exam.scheduleDate,
      duration: exam.duration,
      totalMarks: exam.totalMarks,
      passMark: exam.passMark,
      roomNumber: exam.roomNumber,
      subjectName: exam.subject?.name || null,
    }));

    res.json(formattedExams);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Get Exam by ID
export const getExamById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Exam ID is required." });

    const exam = await prisma.exam.findUnique({ where: { id } });
    if (!exam) return res.status(404).json({ error: "Exam not found." });

    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Update Exam
export const updateExam = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const result = updateExamSchema.safeParse(req.body);
    if (!id || !result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.success ? [] : result.error.errors });
    }

    const exam = await prisma.exam.update({
      where: { id },
      data: { ...result.data },
    });

    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Delete Exam
export const deleteExam = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Exam ID is required." });

    await prisma.exam.delete({ where: { id } });
    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Schedule Exam
export const scheduleExam = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = scheduleExamSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Validation failed", errors: result.error.errors });
    }

    const { title, startTime, endTime, subjectId, classId, scheduleDate } = result.data;

    const lesson = await prisma.lesson.findUnique({ where: { id: subjectId } });
    if (!lesson) return res.status(404).json({ message: "Lesson (subject) not found." });

    const exam = await prisma.exam.create({
      data: {
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        scheduleDate: scheduleDate ? new Date(scheduleDate) : undefined,
        subject: { connect: { id: subjectId } },
        class: { connect: { id: classId } },
      },
    });

    return res.status(201).json({ message: "Exam scheduled successfully", exam });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: (error as any).message });
  }
};

// Create Exam Attendance
export const createExamAttendance = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = createExamAttendanceSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.error.errors });
    }
    const { studentId, examId, date, present } = result.data;

    const attendance = await prisma.examAttendance.create({
      data: {
        studentId,
        examId,
        date: date ? new Date(date) : new Date(),
        present,
      },
    });

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Get Exam Attendance
// export const getExamAttendance = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { id } = req.params;
//     if (!id) return res.status(400).json({ error: "Exam ID is required." });

//     const attendance = await prisma.examAttendance.findMany({
//       where: { examId: id },
//     });

//     res.json(attendance);
//   } catch (error) {
//     res.status(500).json({ error: (error as any).message });
//   }
// };

export const getExamAttendance = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Exam ID is required." });

    const attendance = await prisma.examAttendance.findMany({
      where: { examId: id },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true, // getting name from User model
              },
            },
          },
        },
        exam: {
          select: {
            title: true, // optional: exam title
          },
        },
      },
    });

    const formatted = attendance.map((a) => ({
      id: a.id,
      studentName: a.student.user.name,
      examTitle: a.exam.title,
      present: a.present,
      date: a.date,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Get Exam by ID for Attendance
export const getExamByIdForAttendance = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const exam = await prisma.exam.findUnique({ where: { id } });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Get Exam Attendance Of A school by classid and student

export const getExamAttendanceOfSchool = async (req: Request, res: Response): Promise<any> => {
  try {
    const { classId, studentId } = req.params;
    if (!classId || !studentId) {
      return res.status(400).json({ error: "classId and studentId are required." });
    }

    const attendance = await prisma.examAttendance.findMany({
      where: {
        exam: {
          classId,
        },
        studentId,
      },
      include: {
        exam: true,
      },
    });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Get All Exam Of a School class

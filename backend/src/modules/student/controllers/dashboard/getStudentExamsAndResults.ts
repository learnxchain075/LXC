import { Request, Response } from 'express';
import { prisma } from '../../../../db/prisma';
import { studentIdParamSchema } from '../../../../validations/Module/StudentDashboard/getStudentExamsAndResultsValidation';


export const getStudentExamsAndResults = async (req: Request, res: Response):Promise<any> => {
  const paramsResult = studentIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { studentId } = paramsResult.data;

  try {

    // Get student's class
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { classId: true }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const { classId } = student;

    // 🟢 Fetch all exams for the student's class
    const exams = await prisma.exam.findMany({
      where: { classId },
      include: {
        subject: true,
        ExamAttendance: {
          where: { studentId },
          select: {
            id: true,
            date: true,
            present: true
          }
        },
        results: {
          where: { studentId },
          select: {
            id: true,
            score: true
          }
        }
      },
      orderBy: { startTime: 'asc' }
    });

    return res.status(200).json({
      success: true,
      exams
    });
  } catch (error) {
    console.error('Error fetching student exams and results:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};







export const getStudentSubjectWiseResults = async (req: Request, res: Response):Promise<any> => {
  const paramsResult = studentIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { studentId } = paramsResult.data;

  try {

    // ✅ Fetch all results for the student with related exam & subject
    const results = await prisma.result.findMany({
      where: { studentId },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            subjectId: true,
            totalMarks: true,
            scheduleDate: true,
            subject: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        exam: {
          scheduleDate: 'asc'
        }
      }
    });

    if (!results.length) {
      return res.status(200).json({ success: true, message: "No results found for this student", subjectWise: [], overall: {} });
    }

    // ✅ Subject-wise grouping
    const subjectMap: Record<string, any> = {};
    let totalScore = 0;
    let examCount = 0;
    let maxScore = -Infinity;
    let minScore = Infinity;

    for (const result of results) {
      const subjectName = result.exam?.subject?.name ?? 'Unknown Subject';
      const examTitle = result.exam?.title ?? 'Untitled';
      const score = result.score;

      if (!subjectMap[subjectName]) {
        subjectMap[subjectName] = {
          subject: subjectName,
          exams: [],
          total: 0,
          count: 0
        };
      }

      subjectMap[subjectName].exams.push({
        examId: result.exam?.id,
        title: examTitle,
        score: score,
        totalMarks: result.exam?.totalMarks,
        scheduleDate: result.exam?.scheduleDate
      });

      subjectMap[subjectName].total += score;
      subjectMap[subjectName].count += 1;

      totalScore += score;
      examCount += 1;
      maxScore = Math.max(maxScore, score);
      minScore = Math.min(minScore, score);
    }

    const subjectWise = Object.values(subjectMap).map((s: any) => ({
      ...s,
      average: Math.round(s.total / s.count)
    }));

    const overall = {
      examsAttempted: examCount,
      totalScore,
      averageScore: Math.round(totalScore / examCount),
      highestScore: maxScore,
      lowestScore: minScore
    };

    return res.status(200).json({ success: true, subjectWise, overall });
  } catch (error) {
    console.error('Error fetching student result summary:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

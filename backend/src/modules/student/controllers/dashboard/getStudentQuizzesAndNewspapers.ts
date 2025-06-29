import { Request, Response } from 'express';
import { prisma } from '../../../../db/prisma';
import { studentIdParamSchema } from '../../../../validations/Module/StudentDashboard/getStudentQuizzesAndNewspapersValidation';


export const getStudentQuizzesAndNewspapers = async (req: Request, res: Response):Promise<any> => {
  const paramsResult = studentIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { studentId } = paramsResult.data;

  try {

    // Get student's class and userId
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        classId: true,
        userId: true
      }
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const { classId, userId } = student;

    // ✅ Get all quizzes for student's class
    const quizzes = await prisma.quiz.findMany({
      where: { classId },
      include: {
        quizResult: {
          where: { userId },
          select: {
            score: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const quizzesWithScore = quizzes.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
      answer: q.answer, // You may want to hide this in frontend
      createdAt: q.createdAt,
      score: q.quizResult.length ? q.quizResult[0].score : null,
      attemptedAt: q.quizResult.length ? q.quizResult[0].createdAt : null
    }));

    // ✅ Get all newspapers for student's class
    const newspapers = await prisma.newspaper.findMany({
      where: { classId },
      include: {
        NewspaperSubmission: {
          where: { studentId: userId },
          select: {
            translatedText: true,
            voiceUrl: true,
            submittedAt: true,
            feedback: true,
            score: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const newspapersWithSubmission = newspapers.map(n => ({
      id: n.id,
      title: n.title,
      content: n.content,
      attachment: n.attachment,
      createdAt: n.createdAt,
      submission: n.NewspaperSubmission.length ? n.NewspaperSubmission[0] : null
    }));

    return res.status(200).json({
      success: true,
      quizzes: quizzesWithScore,
      newspapers: newspapersWithSubmission
    });

  } catch (error) {
    console.error("Error fetching quizzes and newspapers:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

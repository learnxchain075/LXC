import { Request, Response } from 'express';
import { classIdParamSchema } from '../../../../validations/Module/StudentDashboard/getClassInternalLeaderboardValidation';

import { startOfMonth, endOfMonth } from 'date-fns';
import { prisma } from '../../../../db/prisma';

export const getClassInternalLeaderboard = async (req: Request, res: Response):Promise<any> => {
  const paramsResult = classIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { classId } = paramsResult.data;

  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  try {
    // 🟢 Homework submissions this month
    const homeworks = await prisma.homeworkSubmission.groupBy({
      by: ['studentId'],
      where: {
        submittedAt: { gte: start, lte: end },
        homework: { classId }
      },
      _count: { id: true }
    });

    // 🟢 Assignment results this month
    const assignmentResults = await prisma.result.groupBy({
      by: ['studentId'],
      where: {
        assignmentId: { not: null },
        student: { classId },
        createdAt: { gte: start, lte: end }
      },
      _sum: { score: true }
    });

    // 🟢 Exam results this month
    const examResults = await prisma.result.groupBy({
      by: ['studentId'],
      where: {
        examId: { not: null },
        student: { classId },
        createdAt: { gte: start, lte: end }
      },
      _sum: { score: true }
    });

    // 🧠 Merge results
    const leaderboardMap: Record<string, any> = {};

    for (const hw of homeworks) {
      leaderboardMap[hw.studentId] = {
        studentId: hw.studentId,
        homeworkCount: hw._count.id,
        assignmentScore: 0,
        examScore: 0
      };
    }

    for (const ar of assignmentResults) {
      if (!leaderboardMap[ar.studentId]) {
        leaderboardMap[ar.studentId] = {
          studentId: ar.studentId,
          homeworkCount: 0,
          assignmentScore: ar._sum?.score || 0,
          examScore: 0
        };
      } else {
        leaderboardMap[ar.studentId].assignmentScore = ar._sum?.score || 0;
      }
    }

    for (const er of examResults) {
      if (!leaderboardMap[er.studentId]) {
        leaderboardMap[er.studentId] = {
          studentId: er.studentId,
          homeworkCount: 0,
          assignmentScore: 0,
          examScore: (er._sum?.score ?? 0)
        };
      } else {
        leaderboardMap[er.studentId].examScore = er._sum?.score || 0;
      }
    }

    // 🏆 Enrich with student names
    const leaderboard = await Promise.all(
      Object.values(leaderboardMap).map(async (entry: any) => {
        const student = await prisma.student.findUnique({
          where: { id: entry.studentId },
          select: {
            user: { select: { name: true, profilePic: true } }
          }
        });

        const totalPoints =
          (entry.homeworkCount * 5) +
          (entry.assignmentScore || 0) +
          (entry.examScore || 0);

        return {
          ...entry,
          name: student?.user?.name || 'Unknown',
          profilePic: student?.user?.profilePic || '',
          totalPoints
        };
      })
    );

    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
    leaderboard.forEach((entry, i) => (entry.rank = i + 1));

    return res.status(200).json({
      success: true,
      leaderboard,
      start,
      end
    });

  } catch (error) {
    console.error("Error generating class leaderboard:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

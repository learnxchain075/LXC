import { Request, Response } from 'express';

import { startOfMonth, endOfMonth } from 'date-fns';
import { prisma } from '../../../../db/prisma';
import { monthlyLeaderboardQuerySchema } from '../../../../validations/Module/StudentDashboard/getMonthlyLeaderboardValidation';

export const getMonthlyLeaderboard = async (req: Request, res: Response) : Promise<any> => {
  const queryResult = monthlyLeaderboardQuerySchema.safeParse(req.query);
  if (!queryResult.success) {
    return res.status(400).json({ error: queryResult.error.errors });
  }
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  try {
    // ✅ Aggregate Quiz Scores
    const quizResults = await prisma.quizResult.groupBy({
      by: ['userId'],
      where: {
        createdAt: {
          gte: start,
          lte: end
        }
      },
      _sum: {
        score: true
      }
    });

    // ✅ Aggregate Newspaper Scores
    const newspaperScores = await prisma.newspaperSubmission.groupBy({
      by: ['studentId'],
      where: {
        submittedAt: {
          gte: start,
          lte: end
        }
      },
      _sum: {
        score: true
      }
    });

    // ✅ Aggregate Doubt Answers
    const doubtAnswers = await prisma.answer.groupBy({
      by: ['userId'],
      where: {
        createdAt: {
          gte: start,
          lte: end
        }
      },
      _count: {
        id: true
      }
    });

    // ✅ Combine all results
    const leaderboardMap: Record<string, any> = {};

    // Add quiz scores
    for (const q of quizResults) {
      leaderboardMap[q.userId] = {
        userId: q.userId,
        quizScore: q._sum.score || 0,
        newspaperScore: 0,
        doubtsSolved: 0
      };
    }

    // Add newspaper scores
    for (const n of newspaperScores) {
      const userId = n.studentId;
      if (!leaderboardMap[userId]) {
        leaderboardMap[userId] = {
          userId,
          quizScore: 0,
          newspaperScore: n._sum.score || 0,
          doubtsSolved: 0
        };
      } else {
        leaderboardMap[userId].newspaperScore = n._sum.score || 0;
      }
    }

    // Add doubt answers
    for (const a of doubtAnswers) {
      const userId = a.userId;
      if (!leaderboardMap[userId]) {
        leaderboardMap[userId] = {
          userId,
          quizScore: 0,
          newspaperScore: 0,
          doubtsSolved: a._count.id
        };
      } else {
        leaderboardMap[userId].doubtsSolved = a._count.id;
      }
    }

    // ✅ Final leaderboard array
    const leaderboard = await Promise.all(
      Object.values(leaderboardMap).map(async (entry: any) => {
        const user = await prisma.user.findUnique({
          where: { id: entry.userId },
          select: { name: true, profilePic: true, email: true }
        });

        const totalPoints =
          (entry.quizScore || 0) +
          (entry.newspaperScore || 0) +
          (entry.doubtsSolved * 5); // 🟡 you can customize the weightage

        return {
          ...entry,
          name: user?.name || 'Unknown',
          email: user?.email || '',
          profilePic: user?.profilePic || '',
          totalPoints
        };
      })
    );

    // ✅ Sort by totalPoints
    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

    // ✅ Assign ranks
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return res.status(200).json({
      success: true,
      start,
      end,
      leaderboard
    });

  } catch (error) {
    console.error('Error generating leaderboard:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


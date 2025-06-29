import { Request, Response } from "express";
import { differenceInCalendarDays } from "date-fns";
import { prisma } from "../../../../db/prisma";
import { classIdParamSchema } from "../../../../validations/Module/StudentDashboard/getRoadmapLeaderboardValidation";

function calcStreak(dates: Date[]): number {
  const sorted = Array.from(new Set(dates.map((d) => d.toISOString().split("T")[0]))).sort();
  let streak = 0;
  let max = 0;
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) {
      streak = 1;
    } else {
      const diff = differenceInCalendarDays(new Date(sorted[i]), new Date(sorted[i - 1]));
      streak = diff === 1 ? streak + 1 : 1;
    }
    if (streak > max) max = streak;
  }
  return max;
}

export const getRoadmapLeaderboard = async (req: Request, res: Response): Promise<any> => {
  const paramsResult = classIdParamSchema.safeParse(req.params);
  if (!paramsResult.success) {
    return res.status(400).json({ error: paramsResult.error.errors });
  }
  const { classId } = paramsResult.data;

  try {
    const students = await prisma.student.findMany({
      where: { classId },
      select: { id: true, userId: true, user: { select: { name: true, profilePic: true, coins: true } } },
    });

    const leaderboard: any[] = [];

    for (const s of students) {
      const roadmaps = await prisma.roadmap.findMany({
        where: { userId: s.userId },
        include: { topics: true },
      });

      const completionSum = roadmaps.reduce((sum, r) => sum + (r.progress || 0), 0);
      const completionRate = roadmaps.length ? Math.round(completionSum / roadmaps.length) : 0;

      const dates: Date[] = [];
      for (const r of roadmaps) {
        for (const t of r.topics) {
          if (t.completedAt) dates.push(t.completedAt);
        }
      }

      const streak = calcStreak(dates);
      const coins = s.user?.coins || 0;
      const score = streak * 10 + coins + completionRate;

      leaderboard.push({
        studentId: s.id,
        name: s.user?.name || "-",
        profilePic: s.user?.profilePic || "",
        streak,
        coins,
        completionRate,
        score,
      });
    }

    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard.forEach((entry, i) => (entry.rank = i + 1));

    res.json({ leaderboard });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

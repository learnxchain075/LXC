import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import {
  marksheetParamSchema,
  topperListParamSchema,
} from "../../../../validations/Module/TeacherDashboard/marksheetValidation";

export const getMarksheet = async (req: Request, res: Response): Promise<any> => {
  try {
    const params = marksheetParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ error: "Validation failed", details: params.error.errors });
    }
    const { classId, studentId } = params.data;

    const results = await prisma.result.findMany({
      where: {
        studentId,
        exam: {
          classId,
        },
      },
      include: {
        exam: {
          select: { id: true, title: true, totalMarks: true },
        },
        assignment: {
          select: { id: true, title: true },
        },
      },
    });

    const totalScore = results.reduce((sum, r) => sum + r.score, 0);

    return res.status(200).json({ classId, studentId, totalScore, results });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const getClassTopperList = async (req: Request, res: Response): Promise<any> => {
  try {
    const params = topperListParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ error: "Validation failed", details: params.error.errors });
    }
    const { classId } = params.data;

    const totals = await prisma.result.groupBy({
      by: ["studentId"],
      where: {
        exam: {
          classId,
        },
      },
      _sum: { score: true },
    });

    type TopperEntry = {
      studentId: string;
      name: string;
      totalScore: number;
      rank?: number;
    };

    const topperList: TopperEntry[] = await Promise.all(
      totals.map(async (t) => {
        const student = await prisma.student.findUnique({
          where: { id: t.studentId },
          select: { id: true, user: { select: { name: true } } },
        });
        return {
          studentId: t.studentId,
          name: student?.user?.name || "",
          totalScore: t._sum.score || 0,
        };
      })
    );

    topperList.sort((a, b) => b.totalScore - a.totalScore);
    topperList.forEach((entry, index) => (entry.rank = index + 1));

    return res.status(200).json({ classId, toppers: topperList });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

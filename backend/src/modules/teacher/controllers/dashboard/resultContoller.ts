import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import {
  createResultSchema,
  updateResultSchema,
} from "../../../../validations/Module/TeacherDashboard/resultValidation";

export const createResult = async (req: Request, res: Response): Promise<any> => {
  try {
    const parseResult = createResultSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: "Validation failed", details: parseResult.error.errors });
    }
    const { studentId, examId, assignmentId, score } = parseResult.data;

    const result = await prisma.result.create({
      data: {
        studentId,
        examId,
        assignmentId,
        score,
      },
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
};

// get all results // no use

export const getResults = async (req: Request, res: Response) => {
  try {
    const results = await prisma.result.findMany({
      include: {
        exam: {
          include: {
            subject: {
              select: { name: true },
            },
          },
        },
        assignment: true,
        student: {
          select: {
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    const transformed = results.map((result) => ({
      id: result.id,
      score: result.score,
      subject: result.exam?.subject?.name || null,
      assignment: result.assignment || null,
      studentName: result.student?.user?.name || null,
      examId: result.examId,
      assignmentId: result.assignmentId,
      createdAt: result.createdAt,
    }));

    res.status(200).json(transformed);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
};

// get result by id

// export const getResultById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const result = await prisma.result.findUnique({
//       where: { id },
//     });
//     if (!result) {
//       res.status(404).json({ error: "Result not found." });
//       return;
//     }
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(400).json({ error: (error as any).message });
//   }
// };

export const getResultById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const result = await prisma.result.findUnique({
      where: { id },
      include: {
        exam: {
          include: {
            subject: {
              select: { name: true },
            },
          },
        },
        assignment: true,
        student: {
          select: {
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!result) {
      return res.status(404).json({ error: "Result not found." });
    }

    const response = {
      id: result.id,
      score: result.score,
      subject: result.exam?.subject?.name || null,
      assignment: result.assignment || null,
      studentName: result.student?.user?.name || null,
      examId: result.examId,
      assignmentId: result.assignmentId,
      createdAt: result.createdAt,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
};

// update result

export const updateResult = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const parseResult = updateResultSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: "Validation failed", details: parseResult.error.errors });
    }
    const { score } = parseResult.data;
    const result = await prisma.result.update({
      where: { id },
      data: {
        score,
      },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
};

// delete result

export const deleteResult = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await prisma.result.delete({
      where: { id },
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: (error as any).message });
  }
};

// GET: Get result of a student in a class

// export const getResultOfSchool = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { classId, studentId } = req.params;

//     if (!classId || !studentId) {
//       return res.status(400).json({ error: "classId and studentId are required." });
//     }

//     const results = await prisma.result.findMany({
//       where: {
//         studentId,
//         exam: {
//           classId,
//         },
//       },
//       include: {
//         exam: true,
//         assignment: true,
//       },
//     });

//     res.status(200).json(results);
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// };

export const getResultOfSchool = async (req: Request, res: Response): Promise<any> => {
  try {
    const { classId, studentId } = req.params;

    if (!classId || !studentId) {
      return res.status(400).json({ error: "classId and studentId are required." });
    }

    const results = await prisma.result.findMany({
      where: {
        studentId,
        exam: {
          classId,
        },
      },
      include: {
        exam: {
          include: {
            subject: {
              select: { name: true },
            },
          },
        },
        assignment: true,
        student: {
          select: {
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    const transformed = results.map((result) => ({
      id: result.id,
      score: result.score,
      subject: result.exam?.subject?.name || null,
      assignment: result.assignment || null,
      studentName: result.student?.user?.name || null,
      examId: result.examId,
      assignmentId: result.assignmentId,
      createdAt: result.createdAt,
    }));

    res.status(200).json(transformed);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

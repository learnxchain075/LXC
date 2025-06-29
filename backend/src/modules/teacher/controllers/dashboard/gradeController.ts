import { prisma } from "../../../../db/prisma";
import { Request, Response } from "express";
import {
  createGradeSchema,
  updateGradeSchema,
} from "../../../../validations/Module/TeacherDashboard/gradeValidation";

// Create Grade


// Create Grade
export const createGrade = async (req: Request, res: Response):Promise<any> => {
  try {
    const result = createGradeSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.error.errors });
    }

    const { level, grade, marksFrom, marksUpto, gradePoint, status, description, studentId } = result.data;

    const newGrade = await prisma.grade.create({
      data: {
        level,
        grade,
        marksFrom,
        marksUpto,
        gradePoint,
        status,
        description,
        students: studentId
          ? {
              connect: { id: studentId },
            }
          : undefined,
      },
    });

    res.status(201).json(newGrade);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};


// Get Grades

export const getGrades = async (req: Request, res: Response) => {
    try {
      const grades = await prisma.grade.findMany();
      res.json(grades);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

// Get Grade by ID

export const getGradeById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const grade = await prisma.grade.findUnique({ where: { id } });
      res.json(grade);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

// Update Grade


export const updateGrade = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const result = updateGradeSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.error.errors });
    }
    const { level, grade, marksFrom, marksUpto, gradePoint, status, description } = result.data;

    const updatedGrade = await prisma.grade.update({
      where: { id },
      data: {
        level,
        grade,
        marksFrom,
        marksUpto,
        gradePoint,
        status,
        description,
      },
    });

    res.json(updatedGrade);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};


// Delete Grade

export const deleteGrade = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await prisma.grade.delete({ where: { id } });
      res.json({ message: "Grade deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };



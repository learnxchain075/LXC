import { Request, Response } from "express";

import { prisma } from "../../../../db/prisma";
import {
  createSubjectSchema,
  updateSubjectSchema,
} from "../../../../validations/Module/TeacherDashboard/subjectValidation";

// create subject
export const createSubject = async (req: Request, res: Response):Promise<any> => {
  try {
    const result = createSubjectSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.error.errors });
    }
    const { name, code, type, classId } = result.data;

    // Check if the subject with the same name already exists in the same class
    const existingSubject = await prisma.subject.findFirst({
      where: {
        name,
        classId,
      },
    });

    if (existingSubject) {
      return res.status(400).json({
        error: `Subject '${name}' already exists in this class.`,
      });
    }

    const subject = await prisma.subject.create({
      data: { name, code, type, classId },
    });

    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};


// get subjects

export const getSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await prisma.subject.findMany();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};



// get subject by ID

export const getSubjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subject = await prisma.subject.findUnique({ where: { id } });
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// update subject
export const updateSubject = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const result = updateSubjectSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.error.errors });
    }
    const { name, type, code } = result.data;
    const subject = await prisma.subject.update({ where: { id }, data: { name, type, code } });
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// delete subject

export const deleteSubject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.subject.delete({ where: { id } });
    res.json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};


// get subject of a school class
  
export const getSubjectsOfClass = async (req: Request, res: Response):Promise<any> => {
  const { schoolId, classId } = req.params;

  try {
    const subjects = await prisma.subject.findMany({
      where: {
        class: {
          id: classId,
          schoolId: schoolId,
        },
      },
      include: {
        class: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Subjects fetched successfully',
      data: subjects,
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch subjects',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get All Subject Of a School 

export const getAllSubjectsOfSchool = async (req: Request, res: Response):Promise<any> => {
  const { schoolId } = req.params;

  try {
    const subjects = await prisma.subject.findMany({
      where: {
        class: {
          schoolId: schoolId,
        },
      },
      include: {
        class: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Subjects fetched successfully',
      data: subjects,
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch subjects',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get Subject By Class ID


export const getSubjectByClassId = async (req: Request, res: Response):Promise<any> => {
  const { classId } = req.params;

  try {
    const subjects = await prisma.subject.findMany({
      where: {
        class: {
          id: classId,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Subjects fetched successfully',
      data: subjects,
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch subjects',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
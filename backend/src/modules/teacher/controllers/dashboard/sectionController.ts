import express from "express";

import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import {
  createSectionSchema,
  updateSectionSchema,
} from "../../../../validations/Module/TeacherDashboard/sectionValidation";

// Create Section

export const createSection = async (req: Request, res: Response):Promise<any> => {
  try {
    const result = createSectionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.error.errors });
    }
    const { name, classId } = result.data;

    const schoolClass = await prisma.class.findUnique({ where: { id: classId } });
    if (!schoolClass) {
      return res.status(404).json({ error: "Class not found" });
    }

    const section = await prisma.section.create({
      data: {
        name,
        class: {
          connect: { id: classId },
        },
      },
    });

    res.status(201).json(section);
  } catch (error) {
    console.error("Error creating section:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};


// Get all Sections of a School Class
export const getSections = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;

    const sections = await prisma.section.findMany({
      where: { classId },
      include: {
        class: true,
      },
    });

    res.json(sections);
  } catch (error) {
    console.error("Error getting sections:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Get Section by ID
export const getSectionById = async (req: Request, res: Response):Promise<any> => {
  try {
    const { id } = req.params;

    const section = await prisma.section.findUnique({
      where: { id },
      include: {
        class: true,
      },
    });

    if (!section) {
      return res.status(404).json({ error: "Section not found" });
    }

    res.json(section);
  } catch (error) {
    console.error("Error getting section:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

 // Update Section

export const updateSection = async (req: Request, res: Response):Promise<any> => {
  try {
    const { id } = req.params;
    const result = updateSectionSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.error.errors });
    }
    const { name, classId } = result.data;

    const section = await prisma.section.update({
      where: { id },
      data: {
        name,
        class: {
          connect: { id: classId },
        },
      },
    });

    res.json(section);
  } catch (error) {
    console.error("Error updating section:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  } 
};


// Delete Section

export const deleteSection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.section.delete({ where: { id } });

    res.json({ message: "Section deleted successfully" });
  } catch (error) {
    console.error("Error deleting section:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};


// Get all Student of a Class Section 


// export const getStudentsBySection = async (req: Request, res: Response) => {
//   try {
//     const { sectionId } = req.params;

//     const students = await prisma.student.findMany({
//       where: { sectionId },
//       include: {
//         user: true,
//         section: true,
//         class: true,
//       },
//     });

//     if (!students || students.length === 0) {
//       return res.status(404).json({ error: "No students found in this section" });
//     }

//     res.json(students);
//   } catch (error) {
//     console.error("Error getting students by section:", error);
//     res.status(500).json({ error: "Something went wrong. Please try again." });
//   }
// };
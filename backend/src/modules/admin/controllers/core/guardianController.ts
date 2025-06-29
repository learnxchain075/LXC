import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
// import { prisma } from "../../db/prisma";
import { updateGuardianSchema } from "../../../../validations/Module/SchoolAuth/guardianValidation";

export const getAllGuardians = async (req: Request, res: Response) => {
  try {
    const guardians = await prisma.student.findMany({
      select: {
        id: true,
        guardianName: true,
        guardianRelation: true,
        guardianEmail: true,
        guardianPhone: true,
        guardianOccupation: true,
        guardianAddress: true,

        user: {
          select: {
            name: true,
          },
        },
      },
    });
    res.status(200).json(guardians);
  } catch (error) {
    res.status(500).json({ error: "Failed to get guardians", details: error });
  }
};

// Get guardian of a specific student
export const getGuardianOfStudent = async (req: Request, res: Response): Promise<any> => {
  const { studentId } = req.params;
  try {
    const guardian = await prisma.student.findUnique({
      where: { id: studentId },
      select: {
        guardianName: true,
        guardianRelation: true,
        guardianEmail: true,
        guardianPhone: true,
        guardianOccupation: true,
        guardianAddress: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!guardian) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.status(200).json(guardian);
  } catch (error) {
    res.status(500).json({ error: "Failed to get guardian of student", details: error });
  }
};

// Get all guardians of a specific school
export const getGuardiansOfSchool = async (req: Request, res: Response) => {
  const { schoolId } = req.params;
  try {
    const guardians = await prisma.student.findMany({
      where: { schoolId },
      select: {
        id: true,
        guardianName: true,
        guardianRelation: true,
        guardianEmail: true,
        guardianPhone: true,
        guardianOccupation: true,
        guardianAddress: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    res.status(200).json(guardians);
  } catch (error) {
    res.status(500).json({ error: "Failed to get guardians of school", details: error });
  }
};

// Update guardian info
export const updateGuardian = async (req: Request, res: Response): Promise<any> => {
  const { studentId } = req.params;
  const parsed = updateGuardianSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
  }
  const { guardianName, guardianRelation, guardianEmail, guardianPhone, guardianOccupation, guardianAddress } =
    parsed.data;

  try {
    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: {
        guardianName,
        guardianRelation,
        guardianEmail,
        guardianPhone,
        guardianOccupation,
        guardianAddress,
      },
    });

    res.status(200).json({ message: "Guardian info updated successfully", updatedStudent });
  } catch (error) {
    res.status(500).json({ error: "Failed to update guardian info", details: error });
  }
};

// Delete guardian info (just clears guardian fields)
export const deleteGuardian = async (req: Request, res: Response) => {
  const { studentId } = req.params;

  try {
    const clearedGuardian = await prisma.student.update({
      where: { id: studentId },
      data: {
        guardianName: "",
        guardianRelation: "",
        guardianEmail: "",
        guardianPhone: "",
        guardianOccupation: "",
        guardianAddress: "",
      },
    });

    res.status(200).json({ message: "Guardian info deleted (cleared)", clearedGuardian });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete guardian info", details: error });
  }
};

// controllers/guardianController.ts


export const getStudentsByAuthenticatedGuardian = async (req: Request, res: Response): Promise<any> => {
  const guardianUserId = (req as any).user?.id;

  if (!guardianUserId) {
    return res.status(401).json({ error: "Unauthorized: Guardian not authenticated" });
  }

  try {
    const parent = await prisma.parent.findUnique({
      where: { userId: guardianUserId },
      include: {
        user: true,
        students: {
          include: {
            class: {
              select: {
                id: true,
                name: true,
              },
            },
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!parent || !parent.user) {
      return res.status(404).json({ error: "Guardian not found" });
    }

    const students = parent.students;

    res.status(200).json({
      guardianEmail: parent.user.email,
      totalStudents: students.length,
      students: students.map((student) => ({
        id: student.id,
        admissionNo: student.admissionNo,
        rollNo: student.rollNo,
        dateOfBirth: student.dateOfBirth,
        classId: student.class?.id,
        className: student.class?.name,
        studentName: student.user.name,
        studentEmail: student.user.email,
        studentPhone: student.user.phone,
      })),
    });
  } catch (error) {
    console.error("Error fetching students by guardian relationship:", error);
    res.status(500).json({ error: "Failed to fetch students", details: error });
  }
};

import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import {
  createClassSchema,
  updateClassSchema,
  assignTeacherSchema,
  assignStudentSchema,
} from "../../../../validations/Module/TeacherDashboard/classValidation";

// create Class

export const createClass = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = createClassSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.error.errors });
    }

    const { name, capacity, schoolId, section, roomNumber } = result.data;

    const school = await prisma.school.findUnique({ where: { id: schoolId } });
    if (!school) {
      res.status(400).json({ error: "School not found" });
      return;
    }

    // Todo:  instead of teacher id add school id to the class and add section Functionality in class
    const newClass = await prisma.class.create({
      data: {
        name,
        capacity,
        // section,
        roomNumber,
        school: {
          connect: { id: schoolId },
        },
      },
    });

    console.log(newClass);
    res.json(newClass);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// get Classes

export const getClasses = async (req: Request, res: Response) => {
  try {
    const classes = await prisma.class.findMany();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// get Class by ID

export const getClassById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const classById = await prisma.class.findUnique({ where: { id } });
    res.json(classById);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// update Class

export const updateClass = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const result = updateClassSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.error.errors });
    }
    const { name, capacity, schoolId,  roomNumber } = result.data;
    const updatedClass = await prisma.class.update({
      where: { id },
      data: { name, capacity, schoolId,  roomNumber },
    });
    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// delete Class

export const deleteClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.class.delete({ where: { id } });
    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Get School Classes by school id

export const getClassesBySchoolId = async (req: Request, res: Response): Promise<any> => {
  try {
    const { schoolId } = req.params;

    if (!schoolId) {
      return res.status(400).json({ success: false, message: "schoolId is required" });
    }

    const classes = await prisma.class.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
      include: {
        Section: true, 
      },
    });

    if (classes.length === 0) {
      return res.status(404).json({ success: false, message: "No classes found for this school." });
    }

    return res.status(200).json({ success: true, data: classes });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: (error as any).message });
  }
};


// Assign Teacher to Class

export const assignTeacherToClass = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = assignTeacherSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.error.errors });
    }
    const { classId, teacherId } = result.data;

    await prisma.class.update({
      where: { id: classId },
      data: {
        Teacher: {
          connect: { id: teacherId },
        },
      },
    });

    res.json({ message: "Teacher assigned to class successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Assign Student to Class
export const assignStudentToClass = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = assignStudentSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.error.errors });
    }

    const { classId, studentId } = result.data;

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: {
        class: {
          connect: { id: classId },
        },
      },
    });

    res.json({ message: "Student assigned to class successfully", student: updatedStudent });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// Get Classes of a Teacher
export const getClassesOfTeacher = async (req: Request, res: Response): Promise<any> => {
  try {
    const { teacherId } = req.params;

    if (!teacherId) {
      return res.status(400).json({ success: false, message: "Teacher ID is required" });
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: {
        classes: {
          orderBy: { name: 'asc' }, 
          include: {
            Section: true,         
            Subject: true,         
          },
        },
      },
    });

    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    return res.status(200).json({ success: true, data: teacher.classes });
  } catch (error) {
    console.error("Error fetching teacher's classes:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error: (error as any).message });
  }
};


// Get Class of a Student
export const getClassOfStudent = async (req: Request, res: Response): Promise<any> => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ success: false, message: "Student ID is required" });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        class: {
          include: {
            Section: true,    // Optional
            Subject: true,    // Optional
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    return res.status(200).json({
      success: true,
      data: student.class,
    });
  } catch (error) {
    console.error("Error fetching student's class:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: (error as any).message,
    });
  }
};


// Get Students of a Class
export const getStudentsOfClass = async (req: Request, res: Response): Promise<any> => {
  try {
    const { classId } = req.params;

    if (!classId) {
      return res.status(400).json({ error: "Class ID is required" });
    }

    const students = await prisma.student.findMany({
      where: { classId },
       include: {
        user: true, 
        fees: true,
        attendances: true
      },

    });

    return res.status(200).json({ students });
  } catch (error: any) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
};


// Get Classes of a Teacher by teacherId

export const getTeacherClasses = async (req: Request, res: Response): Promise<any> => {
  try {
    const { teacherId } = req.params;

    if (!teacherId) {
      return res.status(400).json({ error: "teacherId is required" });
    }

    const classes = await prisma.class.findMany({
      where: {
        Teacher: {
          some: { id: teacherId }, // many-to-many relation filter
        },
      },
      include: {
        school: true,
        Subject: true,
        Section: true,
      },
    });

    if (!classes || classes.length === 0) {
      return res.status(404).json({ error: "No classes assigned to this teacher." });
    }

    return res.status(200).json({ classes });
  } catch (error) {
    return res.status(500).json({ error: (error as any).message });
  }
};


// Get all assigned teachers to classes for a school
export const getAssignedTeachersBySchool = async (req: Request, res: Response): Promise<any> => {
  try {
    const { schoolId } = req.params;

    if (!schoolId) {
      return res.status(400).json({ error: "schoolId is required" });
    }

    const classes = await prisma.class.findMany({
      where: { schoolId },
      include: {
        Teacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    res.json({ classes });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

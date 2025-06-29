
import { Request, Response } from 'express';
import { prisma } from '../../../../db/prisma';
import { promoteStudentSchema, bulkPromoteSchema } from '../../../../validations/Module/AdminDashboard/studentPromotionValidation';
import { cuidSchema } from '../../../../validations/common/commonValidation';
import { z } from 'zod';
import { generateTransferCertificate } from '../../../../utils/certificateGenerator';
import { sendTransferCertificateEmail } from '../../../../utils/mailer';


// Promote a single student to a new class/section for a new session
export const promoteStudent = async (req: Request, res: Response): Promise<any> => {
  const parsed = promoteStudentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.errors });
  }
  const { studentId, fromClassId, toClassId, fromSection, toSection, academicYear, toSession } = parsed.data;
  try {
    const promotion = await prisma.studentPromotion.create({
      data: { studentId, fromClassId, toClassId, fromSection, toSection, academicYear, toSession },
    });

    await prisma.student.update({
      where: { id: studentId },
      data: { classId: toClassId, academicYear: toSession },
    });

    res.status(201).json({ message: "Student promoted successfully", promotion });
  } catch (error: any) {
    console.error("Promotion Error:", error);
    res.status(500).json({ error: error.message || "Failed to promote student" });
  }
};

// Promote all students of a class to another class/section
export const bulkPromoteClass = async (req: Request, res: Response): Promise<any> => {
  const parsed = bulkPromoteSchema.extend({ excludeIds: z.array(cuidSchema).optional() }).safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.errors });
  }
  const { fromClassId, toClassId, fromSection, toSection, academicYear, toSession, excludeIds } = parsed.data;

  try {
    const students = await prisma.student.findMany({ where: { classId: fromClassId } });
    const filtered = students.filter((s) => !(excludeIds || []).includes(s.id));

    await prisma.$transaction(
      filtered.map((s) =>
        prisma.studentPromotion.create({
          data: {
            studentId: s.id,
            fromClassId,
            toClassId,
            fromSection,
            toSection,
            academicYear,
            toSession,
          },
        })
      )
    );

    await prisma.student.updateMany({
      where: { id: { in: filtered.map((s) => s.id) } },
      data: { classId: toClassId, academicYear: toSession },
    });

    res.status(200).json({ message: "Class promoted", count: filtered.length });
  } catch (error: any) {
    console.error("Bulk Promotion Error:", error);
    res.status(500).json({ error: error.message || "Failed to promote class" });
  }
};

// Promote selected students individually
export const selectivePromotion = async (req: Request, res: Response) => {
  const { promotions } = req.body as {
    promotions: Array<{ studentId: string; toClassId: string; toSection: string; toSession: string }>;
  };

  try {
    for (const p of promotions) {
      await prisma.studentPromotion.create({
        data: {
          studentId: p.studentId,
          fromClassId: (await prisma.student.findUnique({ where: { id: p.studentId } }))?.classId || "",
          toClassId: p.toClassId,
          fromSection: "",
          toSection: p.toSection,
          academicYear: "",
          toSession: p.toSession,
        },
      });
      await prisma.student.update({
        where: { id: p.studentId },
        data: { classId: p.toClassId, academicYear: p.toSession },
      });
    }
    res.status(200).json({ message: "Selected students promoted", count: promotions.length });
  } catch (error: any) {
    console.error("Selective Promotion Error:", error);
    res.status(500).json({ error: error.message || "Failed to promote selected students" });
  }
};

// Mark a student as withdrawn or transferred
export const withdrawStudent = async (req: Request, res: Response): Promise<any> => {

  const body = z.object({ studentId: cuidSchema }).safeParse(req.body);

  if (!body.success) {
    return res.status(400).json({ errors: body.error.errors });
  }
  const { studentId } = body.data;
  try {

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { user: true, class: true },
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const certificateUrl = await generateTransferCertificate(student);

    await sendTransferCertificateEmail(
      student.user.email,
      student.user.name,
      student.admissionNo,
      certificateUrl
    );

    await prisma.student.update({
      where: { id: studentId },
      data: { status: 'INACTIVE', transferCertificate: certificateUrl },
    });
    return res.status(200).json({
      message: 'Student status updated to INACTIVE',
      transferCertificate: certificateUrl,
    });

  } catch (error: any) {
    console.error("Withdraw Error:", error);
    res.status(500).json({ error: error.message || "Failed to update student status" });
  }
};

import { Request, Response } from 'express';
import { prisma } from '../../../../db/prisma';
import { submitAssignmentSchema } from '../../../../validations/Module/StudentDashboard/submitAssignmentValidation';
import { uploadFile } from '../../../../config/upload';


export const submitAssignment = async (req: Request, res: Response): Promise<any> => {
  const upload = req.file as Express.Multer.File | undefined;
  let fileUrl: string | undefined;

  if (upload) {
    const fileType = upload.mimetype.startsWith('image/') ? 'image' : 'raw';
    const uploaded = await uploadFile(
      upload.buffer,
      'assignment_submissions',
      fileType
    );
    fileUrl = uploaded.url;
  }

  const bodyResult = submitAssignmentSchema.safeParse({
    ...req.body,
    file: fileUrl,
  });
  if (!bodyResult.success) {
    return res.status(400).json({ error: bodyResult.error.errors });
  }
  const { studentId, assignmentId } = bodyResult.data;

  try {

    // Check if already submitted
    const alreadySubmitted = await prisma.assignmentSubmission.findFirst({
      where: {
        studentId,
        assignmentId
      }
    });

    if (alreadySubmitted) {
      return res.status(409).json({ error: "Assignment already submitted." });
    }

    // Save submission
    if (!fileUrl) {
      return res.status(400).json({ error: "File is required for submission" });
    }

    const submission = await prisma.assignmentSubmission.create({
      data: {
        studentId,
        assignmentId,
        file: fileUrl,
      },
    });

    return res.status(201).json({ success: true, submission });
  } catch (error) {
    console.error("Error submitting assignment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

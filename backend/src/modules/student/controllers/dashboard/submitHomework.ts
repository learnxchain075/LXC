import { Request, Response } from 'express';
import { prisma } from '../../../../db/prisma';
import { submitHomeworkSchema } from '../../../../validations/Module/StudentDashboard/submitHomeworkValidation';
import { uploadFile } from '../../../../config/upload';


export const submitHomework = async (req: Request, res: Response): Promise<any> => {
  const upload = req.file as Express.Multer.File | undefined;
  let fileUrl: string | undefined;

  if (upload) {
    const fileType = upload.mimetype.startsWith('image/') ? 'image' : 'raw';
    try {
      const uploaded = await uploadFile(
        upload.buffer,
        'homework_submissions',
        fileType
      );
      fileUrl = uploaded.url;
    } catch (err) {
      console.error("File upload failed:", err);
      return res.status(500).json({ error: "File upload failed" });
    }
  }

  const bodyResult = submitHomeworkSchema.safeParse({
    ...req.body,
    file: fileUrl,
  });

  if (!bodyResult.success) {
    return res.status(400).json({ error: bodyResult.error.errors });
  }

  const { studentId, homeworkId } = bodyResult.data;

  try {
    // Check for duplicate submission
    const alreadySubmitted = await prisma.homeworkSubmission.findFirst({
      where: {
        studentId,
        homeworkId,
      },
    });

    if (alreadySubmitted) {
      return res.status(409).json({ error: "Homework already submitted." });
    }

    // Ensure file is provided
    if (!fileUrl) {
      return res.status(400).json({ error: "File is required for submission" });
    }

    // Save the submission
    const submission = await prisma.homeworkSubmission.create({
      data: {
        studentId,
        homeworkId,
        file: fileUrl,
      },
    });

    return res.status(201).json({ success: true, submission });
  } catch (error) {
    console.error("Homework submission error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

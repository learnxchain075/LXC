import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import { submitNewspaperTranslationSchema } from "../../../../validations/Module/TeacherDashboard/newspaperSubmissionValidation";
import { uploadFile } from "../../../../config/upload";



// 📌 Submit Translation + Voice by Student
export const submitNewspaperTranslation = async (
  req: Request,
  res: Response
) :Promise<any> => {
  try {
    const voice = req.file as Express.Multer.File | undefined;
    let voiceUrl: string | undefined;

    if (voice) {
      const uploaded = await uploadFile(
        voice.buffer,
        "newspaper_voice_notes",
        "raw"
      );
      voiceUrl = uploaded.url;
    }

    const result = submitNewspaperTranslationSchema.safeParse({
      ...req.body,
      voiceUrl,
    });
    if (!result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.error.errors });
    }
    const { newspaperId, studentId, translatedText } = result.data;

    if (!voiceUrl) {
      return res.status(400).json({ error: "Voice note is required" });
    }

    const submission = await prisma.newspaperSubmission.create({
      data: {
        newspaperId,
        studentId,
        translatedText,
        voiceUrl,
      },
    });

    res.status(201).json({ message: "Submission recorded", data: submission });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// 📌 Get All Submissions for a Newspaper Article
export const getSubmissionsByNewspaper = async (req: Request, res: Response) => {
  try {
    const { newspaperId } = req.params;

    const submissions = await prisma.newspaperSubmission.findMany({
      where: { newspaperId },
      include: { student: true },
    });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};


// 📌 Get All Submissions by a Student

export const getSubmissionsByStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    const submissions = await prisma.newspaperSubmission.findMany({
      where: { studentId },
      include: { newspaper: true },
    });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// 📌 Delete a Submission
export const deleteSubmission = async (req: Request, res: Response) => {
  try {
    const { submissionId } = req.params;

    const submission = await prisma.newspaperSubmission.delete({
      where: { id: submissionId },
    });

    res.json({ message: "Submission deleted successfully", data: submission });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

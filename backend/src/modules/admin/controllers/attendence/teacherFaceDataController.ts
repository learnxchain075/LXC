import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import { uploadFile } from "../../../../config/upload";
import { getFaceEmbedding, matchEmbedding } from "../../../../config/faceMatcher";

export const registerTeacherFace = async (req: Request, res: Response) => {
  try {
    const { teacherId } = req.body as { teacherId: string };
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const { url } = await uploadFile(file.buffer, "teacher_faces", "image", file.originalname);
    const embedding = await getFaceEmbedding(url);
    if (!embedding) {
      return res.status(500).json({ message: "Unable to extract face embedding" });
    }

    const data = await prisma.teacherFaceData.upsert({
      where: { teacherId },
      update: { faceImageUrl: url, faceEmbedding: embedding },
      create: { teacherId, faceImageUrl: url, faceEmbedding: embedding },
    });

    res.json({ data });
  } catch (err) {
    console.error("registerTeacherFace", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTeacherFaceData = async (req: Request, res: Response) => {
  try {
    const { teacherId } = req.params;
    const data = await prisma.teacherFaceData.findUnique({ where: { teacherId } });
    if (!data) return res.status(404).json({ message: "Face data not found" });
    res.json(data);
  } catch (err) {
    console.error("getTeacherFaceData", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markFaceAttendance = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const file = req.file;
    const { latitude, longitude } = req.body as { latitude?: number; longitude?: number };
    if (!file) return res.status(400).json({ message: "Selfie image required" });

    const teacher = await prisma.teacher.findFirst({ where: { userId: user?.id } });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const faceData = await prisma.teacherFaceData.findUnique({ where: { teacherId: teacher.id } });
    if (!faceData) return res.status(404).json({ message: "No face data registered" });

    const { url } = await uploadFile(file.buffer, "teacher_attendance", "image", file.originalname);
    const matched = await matchEmbedding(url, faceData.faceEmbedding);

    const record = await prisma.teacherAttendance.create({
      data: {
        teacherId: teacher.id,
        latitude: latitude ? Number(latitude) : 0,
        longitude: longitude ? Number(longitude) : 0,
        matched,
        attendanceDate: new Date(),
        attendanceTime: new Date(),
        status: matched ? "PRESENT" : "ABSENT",
        selfieImageUrl: url,
      },
    });

    if (!matched) {
      return res.status(401).json({ message: "Face not matched", record });
    }
    res.json({ message: "Attendance marked", record });
  } catch (err) {
    console.error("markFaceAttendance", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

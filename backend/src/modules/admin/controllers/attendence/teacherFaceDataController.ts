import { Request, Response } from "express";
import { prisma } from "../../../../db/prisma";
import { uploadFile } from "../../../../config/upload";
import { getFaceEmbedding, matchEmbedding } from "../../../../config/faceMatcher";
import path from "path";

export const registerTeacherFace = async (req: Request, res: Response) :Promise<any> => {
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

    const ext = path.extname(file.originalname || "");
    const uniqueName = `${teacherId}_${Date.now()}${ext || ".png"}`;
    const { url } = await uploadFile(file.buffer, "teacher_faces", "image", uniqueName);
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

export const getTeacherFaceData = async (req: Request, res: Response) :Promise<any> => {
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

export const markFaceAttendance = async (req: Request, res: Response) :Promise<any> => {
  try {
    const user = req.user;
    const file = req.file;
    const { latitude, longitude } = req.body as { latitude?: number; longitude?: number };
    if (!file) return res.status(400).json({ message: "Selfie image required" });

    const teacher = await prisma.teacher.findFirst({ where: { userId: user?.id } });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const faceData = await prisma.teacherFaceData.findUnique({ where: { teacherId: teacher.id } });
    if (!faceData) return res.status(404).json({ message: "No face data registered" });

    const attendExt = path.extname(file.originalname || "");
    const attendName = `${teacher.id}_${Date.now()}${attendExt || ".png"}`;
    const { url } = await uploadFile(file.buffer, "teacher_attendance", "image", attendName);
    const matched = await matchEmbedding(url, faceData.faceEmbedding);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const already = await prisma.teacherAttendance.findFirst({
      where: {
        teacherId: teacher.id,
        attendanceDate: today,
      },
    });
    if (already) {
      return res.status(400).json({ message: "Attendance already marked" });
    }

    const record = await prisma.teacherAttendance.create({
      data: {
        teacherId: teacher.id,
        latitude: latitude ? Number(latitude) : 0,
        longitude: longitude ? Number(longitude) : 0,
        matched,
        attendanceDate: today,
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

export const getAllTeacherFaceDataBySchool = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { schoolId } = req.params;
    const data = await prisma.teacherFaceData.findMany({
      where: { teacher: { schoolId } },
      include: { teacher: { include: { user: true } } },
    });
    res.json({ data });
  } catch (err) {
    console.error("getAllTeacherFaceDataBySchool", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTeacherFaceData = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { teacherId } = req.params;
    await prisma.teacherFaceData.delete({ where: { teacherId } });
    res.json({ message: "Face data deleted" });
  } catch (err) {
    console.error("deleteTeacherFaceData", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

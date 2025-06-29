import { Request, Response } from "express";


import { prisma } from "../../../../db/prisma";
import { isWithinRadius } from "../../../../config/geoFence";
import { matchFace } from "../../../../config/faceMatcher";



// Upload face image for teacher
export const uploadTeacherFace = async (req: Request, res: Response) :Promise<any> => {
  const { teacherId, imageUrl } = req.body;

  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
  });

  if (!teacher) return res.status(404).json({ message: "Teacher not found" });

  await prisma.teacher.update({
    where: { id: teacherId },
    data: { faceImage: imageUrl },
  });

  return res.json({ message: "Face data uploaded successfully." });
};



// mark Teacher attendance
export const markAttendance = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { selfieBase64, latitude, longitude } = req.body;

    const teacher = await prisma.teacher.findUnique({
      where: { userId: user?.id },
      include: {
        school: true,
      },
    });

    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const storedFace = teacher.faceImage;
    const schoolLat = teacher.school.latitude;
    const schoolLon = teacher.school.longitude;

    if (!isWithinRadius(latitude, longitude, schoolLat!, schoolLon!)) {
      return res.status(403).json({ message: "Outside school premises" });
    }

    const faceMatched = await matchFace(selfieBase64, storedFace!);

    const now = new Date();
    const noon = new Date();
    noon.setHours(12, 0, 0, 0);
    const type = now > noon ? "HALF_DAY" : "FULL_DAY";

    await prisma.teacherAttendance.create({
      data: {
        teacherId: teacher.id,
        latitude,
        longitude,
        matched: faceMatched,
        type,
      },
    });

    if (!faceMatched) {
      return res.status(401).json({ message: "Face mismatch. Try again." });
    }

    return res.json({ message: "Attendance marked successfully!" });
  } catch (error) {
    console.error("Attendance Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

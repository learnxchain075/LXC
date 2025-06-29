import { Request, Response } from "express";
import { prisma } from "../../db/prisma";
import { decodeJwtToken } from "../../utils/jwt_utils";
import { matchFace } from "../../config/faceMatcher";
import { isWithinRadius } from "../../config/geoFence";

export const markAttendance = async (req: Request, res: Response):Promise<any> => {
  try {
    const auth = req.header("Authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = auth.replace("Bearer ", "");
    const decoded: any = await decodeJwtToken(token);

    const teacher = await prisma.teacher.findFirst({
      where: { userId: decoded.userId },
      include: { school: true },
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const { selfieBase64, latitude, longitude } = req.body as {
      selfieBase64: string;
      latitude: number;
      longitude: number;
    };

    const storedFace = teacher.faceImage;
    const schoolLat = teacher.school?.latitude;
    const schoolLon = teacher.school?.longitude;

    const faceMatched = await matchFace(selfieBase64, storedFace || "");
    const insideGeoFence =
      schoolLat !== null &&
      schoolLon !== null &&
      isWithinRadius(latitude, longitude, schoolLat!, schoolLon!);

    const now = new Date();
    const noon = new Date();
    noon.setHours(12, 0, 0, 0);
    const type = now > noon ? "HALF_DAY" : "FULL_DAY";

    await prisma.teacherAttendance.create({
      data: {
        teacherId: teacher.id,
        latitude,
        longitude,
        matched: faceMatched && insideGeoFence,
        type,
      },
    });

    if (!faceMatched) {
      return res.status(401).json({ message: "Face mismatch" });
    }

    if (!insideGeoFence) {
      return res.status(403).json({ message: "Outside school premises" });
    }

    return res.json({ message: "Attendance marked" });
  } catch (err) {
    console.error("Mark attendance error", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

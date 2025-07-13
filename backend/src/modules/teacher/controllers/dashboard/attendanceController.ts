import { Response, Request } from "express";
import { prisma } from "../../../../db/prisma";
import { AttendanceStatus } from "@prisma/client";
import {
  attendanceSchema,
  markMultipleAttendanceSchema,
} from "../../../../validations/Module/TeacherDashboard/attendanceValidation";

import ExcelJS from "exceljs";
import puppeteer from "puppeteer";
import { generateAttendanceHtmlTemplate } from "../../../../template/attendanceReportTemplate";

// create attendance

export const createAttendance = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = attendanceSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.error.errors });
    }

    const { studentId, lessonId, present } = result.data;

    const attendance = await prisma.attendance.create({
      data: {
        studentId,
        lessonId,
        present,
        status: present ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT,
        date: new Date(),
      },
    });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// get attendances

export const getAttendances = async (req: Request, res: Response) => {
  try {
    const attendances = await prisma.attendance.findMany();
    res.json(attendances);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// get attendance by ID

export const getAttendanceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const attendance = await prisma.attendance.findUnique({ where: { id } });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// update attendance

export const updateAttendance = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const result = attendanceSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.error.errors });
    }

    const { studentId, lessonId, present } = result.data;

    const attendance = await prisma.attendance.update({
      where: { id },
      data: {
        studentId,
        lessonId,
        present,
        status: present ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT,
      },
    });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};

// delete attendance
export const deleteAttendance = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.attendance.delete({ where: { id } });
    res.json({ message: "Attendance deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};


// Mark Multiple Students as Present or Absent
export const markMultipleAttendance = async (req: Request, res: Response):Promise<any> => {
  try {
    const result = markMultipleAttendanceSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.error.errors });
    }

    const { lessonId, records } = result.data;

    const attendanceEntries = await prisma.$transaction(
      records.map((record) =>
        prisma.attendance.create({
          data: {
            studentId: record.studentId,
            lessonId,
            present: record.present,
            status: record.present
              ? AttendanceStatus.PRESENT
              : AttendanceStatus.ABSENT,
            date: new Date(),
          },
        })
      )
    );

    res.status(201).json({ message: "Attendance marked for all students.", data: attendanceEntries });
  } catch (error) {
    res.status(500).json({ error: (error as any).message });
  }
};


// Get Attendece getReportData of a School 

export const getAttendanceReportData = async (req: Request, res: Response) => {
  try {
    const { schoolId, fromDate, toDate } = req.query;

    const records = await prisma.attendance.findMany({
      where: {
        student: {
          class: {
            schoolId: schoolId as string,
          },
        },
        ...(fromDate && toDate
          ? {
              date: {
                gte: new Date(fromDate as string),
                lte: new Date(toDate as string),
              },
            }
          : {}),
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const summaryMap: Record<string, { present: number; absent: number }> = {};

    records.forEach((rec) => {
      const name = rec.student.user.name; // ✅ Access name from User table

      if (!summaryMap[name]) {
        summaryMap[name] = { present: 0, absent: 0 };
      }

      if (rec.present) summaryMap[name].present += 1;
      else summaryMap[name].absent += 1;
    });

    const studentSummary = Object.entries(summaryMap).map(([name, data]) => ({
      name,
      present: data.present,
      absent: data.absent,
    }));

    res.status(200).json({ data: studentSummary });
  } catch (error) {
    console.error("Error generating attendance report:", error);
    res.status(500).json({ error: (error as any).message });
  }
};


// Download report Data For a School

// Download report Data For a School
export const downloadAttendanceReport = async (req: Request, res: Response): Promise<any> => {
  console.log("📥 Received request to download attendance report");

  try {
    const { fromDate, toDate, format = "pdf" } = req.query;
    console.log("🔍 Query Params:", { fromDate, toDate, format });

    const user = req.user as any;
    const schoolId = user?.schoolId;
    console.log("🏫 User schoolId:", schoolId);

    if (!schoolId) {
      console.log("❌ Missing schoolId in user object");
      return res.status(400).json({ error: "Unable to find school ID from user" });
    }

    console.log("📦 Fetching attendance records from DB...");
    const records = await prisma.attendance.findMany({
      where: {
        student: {
          class: {
            schoolId: schoolId,
          },
        },
        ...(fromDate && toDate
          ? {
              date: {
                gte: new Date(fromDate as string),
                lte: new Date(toDate as string),
              },
            }
          : {}),
      },
      include: {
        student: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    console.log(`✅ Retrieved ${records.length} attendance records`);

    const summaryMap: Record<string, { present: number; absent: number }> = {};
    records.forEach((rec) => {
      const name = rec.student.user.name;
      if (!summaryMap[name]) summaryMap[name] = { present: 0, absent: 0 };
      if (rec.present) summaryMap[name].present += 1;
      else summaryMap[name].absent += 1;
    });

    const studentSummary = Object.entries(summaryMap).map(([name, data]) => ({
      name,
      present: data.present,
      absent: data.absent,
    }));

    console.log("📊 Prepared student attendance summary:", studentSummary);

    // ✅ Excel Export
    if (format === "excel") {
      console.log("📄 Generating Excel file...");

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Attendance Summary");

      sheet.columns = [
        { header: "Student Name", key: "name", width: 30 },
        { header: "Present", key: "present", width: 10 },
        { header: "Absent", key: "absent", width: 10 },
      ];

      studentSummary.forEach((row) => sheet.addRow(row));

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", `attachment; filename=Attendance_Report_${Date.now()}.xlsx`);

      await workbook.xlsx.write(res);
      console.log("✅ Excel report generated and sent.");
      return res.end();
    }

    // ✅ PDF Export
    if (format === "pdf") {
      console.log("🖨️ Generating PDF...");

      const html = generateAttendanceHtmlTemplate(studentSummary);
      console.log("🧾 HTML content generated for PDF");

      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      console.log("🌐 Puppeteer launched, opening new page...");
      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({ format: "A4" });
      await browser.close();

      console.log("📎 PDF buffer generated. Length:", pdfBuffer?.length);

      if (!pdfBuffer || pdfBuffer.length === 0) {
        console.error("❌ PDF buffer is empty. Likely HTML rendering issue.");
        return res.status(500).json({ error: "PDF generation failed. Buffer is empty." });
      }

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=Attendance_Report_${Date.now()}.pdf`);
      console.log("📤 Sending PDF file to client...");
      return res.send(pdfBuffer);
    }

    console.warn("❌ Invalid format parameter:", format);
    return res.status(400).json({ error: "Invalid format. Use ?format=excel or ?format=pdf" });

  } catch (error) {
    console.error("🔥 Download attendance error:", error);
    return res.status(500).json({ error: (error as any).message || "Something went wrong" });
  }
};
import { prisma } from "../../db/prisma";
import { Request, Response } from "express";

export const getParentDashboard = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;

    const parentBasic = await prisma.parent.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!parentBasic) {
      return res.status(404).json({ message: "Parent not found" });
    }

    const parentId = parentBasic.id;

    const parent = await prisma.parent.findUnique({
      where: { id: parentId },
      include: {
        students: {
          include: {
            user: true,
            class: {
              include: {
                school: true,
              },
            },
          },
        },
        user: true, // Add to get parent name
      },
    });

    if (!parent || parent.students.length === 0) {
      return res.status(404).json({ error: "No students found for this parent" });
    }

    const dashboardData = await Promise.all(
      parent.students.map(async (student) => {
        const [studentInfo, academicPerformance, attendance, fees, assignments, timetable, events, communication] =
          await Promise.all([
            getStudentInfo(student),
            getAcademicPerformance(student.id),
            getAttendance(student.id),
            getFees(student.id),
            getAssignments(student.id),
            getTimetable(student.classId),
            getEvents(student.class.schoolId),
            getCommunication(parentId),
          ]);

        return {
          studentId: student.id,
          studentInfo,
          academicPerformance,
          attendance,
          fees,
          assignments,
          timetable,
          events,
          communication,
        };
      })
    );

    res.json({
      parentId,
      parentName: parent.user?.name || "Parent",
      students: dashboardData,
    });
  } catch (error) {
    console.error("Error fetching parent dashboard:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/** Student Info */
function getStudentInfo(student: any) {
  return {
    userId: student.user.id,
    name: student.user.name,
    class: student.class.name,
    rollNo: student.rollNo,
    profilePic: student.user.profilePic || null,
    email: student.user.email || null,
    phone: student.user.phone || null,
    dateOfBirth: student.user.dateOfBirth,
    admissionDate: student.admissionDate,
    schoolName: student.class.school.schoolName,
  };
}

/** Academic Performance */
async function getAcademicPerformance(studentId: string) {
  const results = await prisma.result.findMany({
    where: { studentId },
    include: {
      exam: { include: { subject: true } },
      assignment: { include: { subject: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const subjectScores: { [key: string]: { total: number; count: number; scores: any[] } } = {};

  results.forEach((result) => {
    const subject = result.exam?.subject?.name || result.assignment?.subject?.name || "Unknown Subject";

    if (!subjectScores[subject]) {
      subjectScores[subject] = { total: 0, count: 0, scores: [] };
    }
    subjectScores[subject].total += result.score;
    subjectScores[subject].count += 1;
    subjectScores[subject].scores.push({
      type: result.exam ? "Exam" : "Assignment",
      title: result.exam ? result.exam.title : result.assignment?.title || "Unknown Result",
      score: result.score,
      date: result.createdAt,
    });
  });

  // Fetch grade ranges once to use for mapping
  const grades = await prisma.grade.findMany();

  const averages = Object.entries(subjectScores).map(([subject, data]) => {
    const avg = data.total / data.count;
    const gradeInfo = grades.find((g) => avg >= g.marksFrom && avg <= g.marksUpto);

    return {
      subject,
      average: avg,
      grade: gradeInfo?.grade || "N/A",
      gradePoint: gradeInfo?.gradePoint || null,
      recentScores: data.scores.slice(0, 5),
    };
  });

  return { averages };
}

/** Attendance */
async function getAttendance(studentId: string) {
  const attendanceRecords = await prisma.attendance.findMany({
    where: { studentId },
    orderBy: { date: "desc" },
    take: 30,
  });

  const totalDays = attendanceRecords.length;
  const presentDays = attendanceRecords.filter((a) => a.present).length;
  const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

  const recentRecords = attendanceRecords.slice(0, 10).map((a) => ({
    date: a.date,
    status: a.present ? "Present" : "Absent",
    // remarks: a.remarks || null,
  }));

  return {
    percentage: Number(percentage.toFixed(2)),
    totalDays,
    presentDays,
    absentDays: totalDays - presentDays,
    recentRecords,
  };
}

/** Fees */
async function getFees(studentId: string) {
  const fees = await prisma.fee.findMany({
    where: { studentId },
    include: { Payment: true },
    orderBy: { dueDate: "asc" },
  });

  const pendingFees = fees
    .filter((f) => f.status === "Pending" || f.status === "Overdue")
    .map((f) => ({
      id: f.id,
      category: f.category,
      amount: f.amount,
      amountPaid: f.amountPaid,
      dueDate: f.dueDate,
      status: f.status,
    }));

  const totalPending = pendingFees.reduce((sum, fee) => sum + (fee.amount - fee.amountPaid), 0);

  const paymentHistory = fees
    .flatMap((f) =>
      f.Payment.filter((p) => p.paymentDate).map((p) => ({
        feeCategory: f.category,
        amount: p.amount,
        date: p.paymentDate,
        method: p.paymentMethod || "Unknown",
        receiptId: p.id,
      }))
    )
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

  return {
    pendingFees,
    totalPending,
    totalPaid: fees.reduce((sum, f) => sum + f.amountPaid, 0),
    paymentHistory,
  };
}

/** Assignments */
async function getAssignments(studentId: string) {
  const student = await prisma.student.findUnique({ where: { id: studentId }, select: { classId: true } });
  const assignments = await prisma.assignment.findMany({
    where: { classId: student?.classId },
    include: {
      subject: true,
      AssignmentSubmission: { where: { studentId } },
      results: { where: { studentId } },
    },
    orderBy: { dueDate: "asc" },
    take: 15,
  });

  return assignments.map((a) => ({
    id: a.id,
    title: a.title,
    subject: a.subject.name,
    description: a.description || null,
    dueDate: a.dueDate,
    status: a.AssignmentSubmission.length > 0 ? "Submitted" : "Not Submitted",
    submittedAt: a.AssignmentSubmission[0]?.submittedAt || null,
    score: a.results[0]?.score || null,
  }));
}

/** Timetable */
async function getTimetable(classId: string) {
  const timetable = await prisma.lesson.findMany({
    where: { classId },
    include: {
      subject: true,
      teacher: { include: { user: true } },
    },
    orderBy: [
      { day: "asc" },
      { startTime: "asc" }
    ],
  });

  return timetable.map((t) => ({
    day: t.day,
    startTime: t.startTime,
    endTime: t.endTime,
    subject: t.subject.name,
    teacher: t.teacher?.user.name || "TBD",
    // room: t.room || "TBD",
  }));
}

/** Events */
async function getEvents(schoolId: string) {
  // 1. Upcoming Events
  const events = await prisma.event.findMany({
    where: {
      schoolId,
      start: { gte: new Date() }, // only upcoming events
    },
    orderBy: { start: "asc" },
    take: 10,
    select: {
      id: true,
      title: true,
      description: true,
      start: true,
      end: true,
      //   location: true,
    },
  });

  // 2. Recent Announcements
  const announcements = await prisma.announcement.findMany({
    where: {
      class: {
        schoolId: schoolId,
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
    },
  });

  // 3. Recent Notices
  const notices = await prisma.notice.findMany({
    where: { schoolId },
    orderBy: { publishDate: "desc" },
    take: 5,
    select: {
      id: true,
      title: true,
      message: true,
      publishDate: true,
      attachment: true,
      createdAt: true,
      creator: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });

  return {
    events,
    announcements,
    notices,
  };
}

/** Communication */
async function getCommunication(parentId: string) {
  const messages = await prisma.message.findMany({
    where: { recipientUserId: parentId },
    include: { sender: { select: { name: true, role: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return messages.map((m) => ({
    id: m.id,
    sender: `${m.sender.name} (${m.sender.role})`,
    content: m.content,
    sentAt: m.createdAt,
    isRead: m.isRead,
  }));
}

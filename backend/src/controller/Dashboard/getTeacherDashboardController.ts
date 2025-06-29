import { prisma } from "../../db/prisma";
import { Request, Response } from "express";

export const getTeacherDashboard = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;

    const teacher = await prisma.teacher.findFirst({
      where: { userId },
      include: {
        user: true,
        school: true,
        classes: true,
        subjects: true,
      },
    });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    const teacherId = teacher.id;
    const schoolId = teacher.schoolId;

    const [personalInfo, classOverview, assignments, timetable, events, attendance] =
      await Promise.all([
        getPersonalInfo(teacher),
        getClassOverview(teacher.classes),
        getAssignments(teacher.classes),
        getTimetable(teacherId),
        getEvents(schoolId),
        getAttendance(teacher.classes),
      ]);

    res.json({
      personalInfo,
      classOverview,
      assignments,
      timetable,
      events,
      attendance,
    });
  } catch (error) {
    console.error("Error fetching teacher dashboard:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

function getPersonalInfo(teacher: any) {
  return {
    name: teacher.user.name,
    email: teacher.user.email,
    phone: teacher.user.phone,
    profilePic: teacher.user.profilePic || null,
    dateOfJoin: teacher.dateofJoin,
    subjects: teacher.subjects.map((s: any) => s.name),
    school: teacher.school.schoolName,
  };
}

async function getClassOverview(classes: any[]) {
  return Promise.all(
    classes.map(async (cls: any) => {
      const studentCount = await prisma.student.count({ where: { classId: cls.id } });
      return { classId: cls.id, className: cls.name, studentCount };
    })
  );
}

async function getAttendance(classes: any[]) {
  return Promise.all(
    classes.map(async (cls: any) => {
      const records = await prisma.attendance.findMany({
        where: { lesson: { classId: cls.id } },
        orderBy: { date: "desc" },
        take: 30,
      });
      const total = records.length;
      const present = records.filter((r) => r.present).length;
      const percentage = total ? (present / total) * 100 : 0;
      return { classId: cls.id, className: cls.name, percentage };
    })
  );
}

async function getAssignments(classes: any[]) {
  const data = await Promise.all(
    classes.map(async (cls: any) => {
      const assignments = await prisma.assignment.findMany({
        where: { classId: cls.id },
        include: { subject: { select: { name: true } } },
        orderBy: { dueDate: "asc" },
        take: 5,
      });
      return assignments.map((a) => ({
        id: a.id,
        title: a.title,
        subject: a.subject?.name ?? "N/A",
        dueDate: a.dueDate,
        classId: cls.id,
      }));
    })
  );
  return data.flat();
}

async function getTimetable(teacherId: string) {
  const lessons = await prisma.lesson.findMany({
    where: { teacherId },
    include: {
      subject: { select: { name: true } },
      class: { select: { name: true } },
    },
    orderBy: [{ day: "asc" }, { startTime: "asc" }],
  });

  return lessons.map((l) => ({
    day: l.day,
    startTime: l.startTime,
    endTime: l.endTime,
    subject: l.subject?.name ?? "N/A",
    class: l.class.name,
    room: l.name,
  }));
}

async function getEvents(schoolId: string) {
  return prisma.event.findMany({
    where: { schoolId, start: { gte: new Date() } },
    orderBy: { start: "asc" },
    take: 10,
    select: {
      id: true,
      title: true,
      description: true,
      start: true,
      end: true,
    },
  });
}











// import { prisma } from "../../db/prisma";
// import { Request, Response } from 'express';

// export const getTeacherDashboard = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const teacherId = req.user.id;

//     // Fetch teacher with related data
//     const teacher = await prisma.teacher.findUnique({
//       where: { id: teacherId },
//       include: {
//         user: true,
//         school: true,
//         classes: true,
//         subjects: true,
//       },
//     });

//     if (!teacher) {
//       return res.status(404).json({ error: 'Teacher not found' });
//     }

//     const schoolId = teacher.schoolId;
//     const userId = teacher.userId;

//     // Fetch all dashboard data concurrently with error handling
//     const [
//       personalInfo,
//       classOverview,
//       studentPerformance,
//       attendance,
//       assignments,
//       timetable,
//       events,
//       notifications,
//       communication,
//       grading,
//       systemHealth,
//     ] = await Promise.all([
//       getPersonalInfo(teacher).catch(() => ({ error: 'Failed to fetch personal info' })),
//       getClassOverview(teacher.classes).catch(() => ({ error: 'Failed to fetch class overview' })),
//       getStudentPerformance(teacher.classes).catch(() => ({ error: 'Failed to fetch student performance' })),
//       getAttendance(teacher.classes).catch(() => ({ error: 'Failed to fetch attendance' })),
//       getAssignments(teacher.classes).catch(() => ({ error: 'Failed to fetch assignments' })),
//       getTimetable(teacherId).catch(() => ({ error: 'Failed to fetch timetable' })),
//       getEvents(schoolId).catch(() => ({ error: 'Failed to fetch events' })),
//       getNotifications(userId).catch(() => ({ error: 'Failed to fetch notifications' })),
//       getCommunication(userId).catch(() => ({ error: 'Failed to fetch communication' })),
//       getGrading(teacher.classes).catch(() => ({ error: 'Failed to fetch grading' })),
//       getSystemHealth().catch(() => ({ error: 'Failed to fetch system health' })),
//     ]);

//     // Assemble and return the response
//     res.json({
//       personalInfo,
//       classOverview,
//       studentPerformance,
//       attendance,
//       assignments,
//       timetable,
//       events,
//       notifications,
//       communication,
//       grading,
//       systemHealth,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }

// /** Personal Information */
// function getPersonalInfo(teacher) {
//   return {
//     name: teacher.user.name,
//     email: teacher.user.email,
//     phone: teacher.user.phone,
//     profilePic: teacher.user.profilePic,
//     department: teacher.department || 'N/A',
//     designation: teacher.designation || 'N/A',
//     dateOfJoin: teacher.dateOfJoin?.toISOString() || null,
//     subjects: teacher.subjects.map(s => s.name),
//   };
// }

// /** Class Overview */
// async function getClassOverview(classes) {
//   const classData = await Promise.all(classes.map(async (cls) => {
//     const studentCount = await prisma.student.count({ where: { classId: cls.id } });
//     const averagePerformance = await prisma.result.aggregate({
//       _avg: { score: true },
//       where: { student: { classId: cls.id } },
//     });
//     return {
//       className: cls.name,
//       studentCount,
//       averagePerformance: averagePerformance._avg.score || 0,
//     };
//   }));
//   return classData;
// }

// /** Student Performance */
// async function getStudentPerformance(classes) {
//   const performanceData = await Promise.all(classes.map(async (cls) => {
//     const topPerformers = await prisma.student.findMany({
//       where: { classId: cls.id },
//       orderBy: { results: { _avg: { score: 'desc' } } },
//       take: 5,
//       select: {
//         id: true,
//         user: { select: { name: true } },
//         results: { select: { score: true } },
//       },
//     }).then(students => students.map(student => ({
//       id: student.id,
//       name: student.user.name,
//       averageScore: student.results.length > 0
//         ? student.results.reduce((sum, result) => sum + result.score, 0) / student.results.length
//         : 0,
//     })));

//     const improvementAreas = await prisma.subject.findMany({
//       where: { classId: cls.id },
//       select: {
//         name: true,
//         exams: { select: { results: { select: { score: true } } } },
//       },
//     }).then(subjects => subjects.map(subject => ({
//       name: subject.name,
//       averageScore: subject.exams.flatMap(exam => exam.results).length > 0
//         ? subject.exams.flatMap(exam => exam.results).reduce((sum, result) => sum + result.score, 0) / subject.exams.flatMap(exam => exam.results).length
//         : 0,
//     })).sort((a, b) => a.averageScore - b.averageScore).slice(0, 3));

//     return { className: cls.name, topPerformers, improvementAreas };
//   }));
//   return performanceData;
// }

// /** Attendance */
// async function getAttendance(classes) {
//   const attendanceData = await Promise.all(classes.map(async (cls) => {
//     const attendanceRecords = await prisma.attendance.groupBy({
//       by: ['date'],
//       _avg: { present: true },
//       where: { student: { classId: cls.id } },
//       orderBy: { date: 'desc' },
//       take: 30,
//     });
//     const totalStudents = await prisma.student.count({ where: { classId: cls.id } });
//     return {
//       className: cls.name,
//       attendanceTrends: attendanceRecords.map(record => ({
//         date: record.date.toISOString(),
//         attendanceRate: record._avg.present * 100,
//         presentCount: Math.round(record._avg.present * totalStudents),
//         totalStudents,
//       })),
//     };
//   }));
//   return attendanceData;
// }

// /** Assignments */
// async function getAssignments(classes) {
//   const assignmentData = await Promise.all(classes.map(async (cls) => {
//     const assignments = await prisma.assignment.findMany({
//       where: { classId: cls.id },
//       include: {
//         subject: true,
//         AssignmentSubmission: { include: { student: { select: { user: { select: { name: true } } } } } },
//       },
//       orderBy: { dueDate: 'asc' },
//       take: 5,
//     });
//     const totalStudents = await prisma.student.count({ where: { classId: cls.id } });
//     return assignments.map(a => ({
//       id: a.id,
//       title: a.title,
//       subject: a.subject.name,
//       dueDate: a.dueDate.toISOString(),
//       submissionCount: a.AssignmentSubmission.length,
//       totalStudents,
//       submissions: a.AssignmentSubmission.map(s => ({
//         studentName: s.student.user.name,
//         submittedAt: s.submittedAt.toISOString(),
//       })),
//     }));
//   }));
//   return assignmentData.flat();
// }

// /** Timetable */
// async function getTimetable(teacherId) {
//   const timetable = await prisma.lesson.findMany({
//     where: { teacherId },
//     include: { subject: true, class: true },
//     orderBy: { day: 'asc', startTime: 'asc' },
//   });
//   return timetable.map(t => ({
//     day: t.day,
//     startTime: t.startTime.toISOString(),
//     endTime: t.endTime.toISOString(),
//     subject: t.subject.name,
//     class: t.class.name,
//     room: t.room,
//   }));
// }

// /** Events */
// async function getEvents(schoolId) {
//   const events = await prisma.event.findMany({
//     where: { schoolId, start: { gte: new Date() } },
//     orderBy: { start: 'asc' },
//     take: 10,
//     select: {
//       id: true,
//       title: true,
//       description: true,
//       start: true,
//       end: true,
//       location: true,
//     },
//   });
//   return events.map(e => ({
//     ...e,
//     start: e.start.toISOString(),
//     end: e.end.toISOString(),
//   }));
// }

// /** Notifications */
// async function getNotifications(userId) {
//   const notifications = await prisma.notification.findMany({
//     where: { userId },
//     orderBy: { createdAt: 'desc' },
//     take: 15,
//   });
//   return notifications.map(n => ({
//     id: n.id,
//     title: n.title,
//     content: n.content,
//     createdAt: n.createdAt.toISOString(),
//     isRead: n.isRead,
//   }));
// }

// /** Communication */
// async function getCommunication(userId) {
//   const messages = await prisma.message.findMany({
//     where: { OR: [{ senderId: userId }, { recipientUserId: userId }] },
//     include: {
//       sender: { select: { name: true } },
//       recipientUser: { select: { name: true } },
//     },
//     orderBy: { createdAt: 'desc' },
//     take: 20,
//   });
//   return messages.map(m => ({
//     id: m.id,
//     sender: m.sender.name,
//     recipient: m.recipientUser.name,
//     content: m.content,
//     sentAt: m.createdAt.toISOString(),
//     isRead: m.isRead,
//   }));
// }

// /** Grading */
// async function getGrading(classes) {
//   const gradingData = await Promise.all(classes.map(async (cls) => {
//     const pendingGrades = await prisma.assignmentSubmission.findMany({
//       where: {
//         assignment: { classId: cls.id },
//         score: null,
//       },
//       include: {
//         student: { select: { user: { select: { name: true } } } },
//         assignment: { select: { title: true } },
//       },
//       take: 10,
//     });
//     return {
//       className: cls.name,
//       pendingGrades: pendingGrades.map(p => ({
//         studentName: p.student.user.name,
//         assignmentTitle: p.assignment.title,
//         submittedAt: p.submittedAt.toISOString(),
//       })),
//     };
//   }));
//   return gradingData;
// }

// /** System Health */
// async function getSystemHealth() {
//   const totalRequests = await prisma.log.count();
//   const errorRequests = await prisma.log.count({
//     where: { status: { gte: 400 } },
//   });
//   const errorRate = totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0;
//   const avgResponseTime = await prisma.log.aggregate({
//     _avg: { duration: true },
//   });
//   return {
//     errorRate,
//     avgResponseTime: avgResponseTime._avg.duration || 0,
//     lastSync: new Date().toISOString(),
//   };
// }
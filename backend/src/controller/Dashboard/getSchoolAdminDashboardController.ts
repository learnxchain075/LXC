import { prisma } from "../../db/prisma";
import { Request, Response } from "express";
import { startOfMonth, endOfMonth, subMonths, startOfQuarter, endOfQuarter, subQuarters } from "date-fns";

// Main Controller
export const getSchoolAdminDashboard = async (req: Request, res: Response): Promise<any> => {
  try {
    // Ensure authenticated user and schoolId are present
    const user = req.user;
    if (!user || !user.schoolId) {
      return res.status(401).json({ error: "Unauthorized: Missing school ID" });
    }

    const schoolId = user.schoolId;
    const [
      keyMetrics,
      schedules,
      attendance,
      classRoutines,
      earnings,
      expenses,
      feesCollected,
      notices,
      topSubjects,
      studentActivities,
      todos,
      feesCollectionChart,
      leaveRequests,
      upcomingEvents,
      bestPerformer,
      starStudents,
      performanceMetrics,
    ] = await Promise.all([
      getKeyMetrics(),
      getSchedules(),
      getAttendance(req.query.attendanceDate as string),
      getClassRoutines(),
      getTotalEarnings(),
      getTotalExpenses(),
      getTotalFeesCollected(),
      getNotices(),
      getTopSubjects((req.query.classFilter as string) || "Class II"),
      getStudentActivities((req.query.activityFilter as string) || "THIS MONTH"),
      getTodos((req.query.todoFilter as string) || "TODAY"),
      getFeesCollectionChart((req.query.feesFilter as string) || "Last 8 Quarters"),
      getLeaveRequests((req.query.leaveFilter as string) || "Today", req.user?.schoolId ?? ""),

      getUpcomingEvents(schoolId),
      getBestPerformer(),
      getStarStudents(),
      getPerformanceMetrics((req.query.performanceMonth as string) || "Oct 2024"),
    ]);

    res.json({
      keyMetrics,
      schedules,
      attendance,
      classRoutines,
      quickLinks: [
        { name: "Calendar", icon: "calendar", color: "green" },
        { name: "Exam Result", icon: "exam", color: "blue" },
        { name: "Fees", icon: "fees", color: "cyan" },
        { name: "Home Works", icon: "homework", color: "red" },
      ],
      earnings,
      expenses,
      feesCollected,
      notices,
      topSubjects,
      studentActivities,
      todos,
      feesCollectionChart,
      leaveRequests,
      upcomingEvents,
      bestPerformer,
      starStudents,
      performanceMetrics,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Helper Functions
function percentageChange(current: number, previous: number): string {
  if (previous === 0) return "0";
  return (((current - previous) / previous) * 100).toFixed(1);
}

async function getKeyMetrics() {
  const totalStudents = await prisma.student.count();
  const activeStudents = await prisma.student.count({ where: { status: "ACTIVE" } });
  const totalTeachers = await prisma.teacher.count();
  const activeTeachers = await prisma.teacher.count({ where: { status: "ACTIVE" } });
  const totalStaff = await prisma.user.count({
    where: { role: "staff" },
  });

  const activeStaff = await prisma.user.count({
    where: {
      role: "staff",
      // status: 'ACTIVE',
    },
  });

  const totalSubjects = await prisma.subject.count();
  const activeSubjects = await prisma.subject.count({ where: { status: "ACTIVE" } });

  return {
    totalStudents: {
      total: totalStudents,
      active: activeStudents,
      inactive: totalStudents - activeStudents,
      percentageChange: percentageChange(totalStudents, 3700),
    },
    totalTeachers: {
      total: totalTeachers,
      active: activeTeachers,
      inactive: totalTeachers - activeTeachers,
      percentageChange: percentageChange(totalTeachers, 280),
    },
    totalStaff: {
      total: totalStaff,
      active: activeStaff,
      inactive: totalStaff - activeStaff,
      percentageChange: percentageChange(totalStaff, 160),
    },
    totalSubjects: {
      total: totalSubjects,
      active: activeSubjects,
      inactive: totalSubjects - activeSubjects,
      percentageChange: percentageChange(totalSubjects, 80),
    },
  };
}

async function getSchedules() {
  const now = new Date();

  const upcomingEvents = await prisma.event.findMany({
    where: {
      start: { gte: now },
    },
    orderBy: {
      start: "asc",
    },
    take: 1,
    select: {
      title: true,
      start: true,
    },
  });

  const currentMonth = now.toLocaleString("default", {
    month: "long",
    year: "numeric",
  }); // e.g., "June 2025"

  return {
    currentMonth,
    highlightedDate: now.getDate(),
    upcomingEvents: upcomingEvents.length
      ? upcomingEvents
      : [{ title: "Parents, Teacher Meet", start: new Date("2024-07-15") }],
  };
}

async function getAttendance(dateFilter?: string) {
  const targetDate = dateFilter ? new Date(dateFilter) : new Date();

  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  const attendanceRecords = await prisma.attendance.findMany({
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      student: {
        include: {
          user: true,
        },
      },
    },
  });

  const totalRecords = attendanceRecords.length;
  const presentRecords = attendanceRecords.filter((r) => r.present).length;
  const overallPercentage = totalRecords ? Math.round((presentRecords / totalRecords) * 100) : 0;

  const studentsEmergency = attendanceRecords.filter(
    (r) => r.student?.user?.role === "student" && r.status === "EMERGENCY"
  ).length;

  const teachersAbsent = attendanceRecords.filter(
    (r) => r.student?.user?.role === "teacher" && r.status === "ABSENT"
  ).length;

  const staffLate = attendanceRecords.filter((r) => r.student?.user?.role === "staff" && r.status === "LATE").length;

  return {
    overallPercentage,
    issues: {
      students: { emergency: studentsEmergency },
      teachers: { absent: teachersAbsent },
      staff: { late: staffLate },
    },
    dateFilter: startOfDay.toISOString().split("T")[0],
  };
}

async function getClassRoutines() {
  const currentMonth = new Date().getMonth();
  const lastMonth = new Date().getMonth() - 1;

  // Get data for current and last month
  const months = [lastMonth, currentMonth].map((month) => {
    const now = new Date();
    const firstDay = startOfMonth(new Date(now.getFullYear(), month, 1));
    const lastDay = endOfMonth(new Date(now.getFullYear(), month, 1));
    return {
      label: firstDay.toLocaleString("default", { month: "long", year: "numeric" }),
      start: firstDay,
      end: lastDay,
    };
  });

  const routines = await Promise.all(
    months.map(async (m) => {
      const lessonCount = await prisma.lesson.count({
        where: {
          startTime: {
            gte: m.start,
            lte: m.end,
          },
        },
      });

      const progress = Math.min((lessonCount / 100) * 100, 100); // Assume 100 is the target/month

      return {
        month: m.label,
        progress: Math.round(progress),
      };
    })
  );

  return { routines };
}

async function getTotalEarnings() {
  // Total sum of all payments that are linked to a fee
  const earnings = await prisma.payment.aggregate({
    where: { feeId: { not: null }, status: "Success" },
    _sum: { amount: true },
  });

  // Generate earnings for the last 12 months
  const graphData = await Promise.all(
    Array.from({ length: 12 }, (_, i) => {
      const date = subMonths(new Date(), 11 - i); // Reverse order: oldest to latest
      const start = startOfMonth(date);
      const end = endOfMonth(date);

      return prisma.payment
        .aggregate({
          where: {
            feeId: { not: null },
            status: "Success",
            paymentDate: { gte: start, lte: end },
          },
          _sum: { amount: true },
        })
        .then((result) => ({
          month: start.toLocaleString("default", { month: "short" }),
          value: result._sum.amount || 0,
        }));
    })
  );

  return {
    total: earnings._sum.amount || 0,
    graphData,
  };
}

async function getTotalExpenses() {
  // Total expense amount across all schools
  const expenses = await prisma.schoolExpense.aggregate({
    _sum: { amount: true },
  });

  // Monthly expense breakdown for last 12 months
  const graphData = await Promise.all(
    Array.from({ length: 12 }, (_, i) => {
      const date = subMonths(new Date(), 11 - i);
      const start = startOfMonth(date);
      const end = endOfMonth(date);

      return prisma.schoolExpense
        .aggregate({
          where: {
            date: {
              gte: start,
              lte: end,
            },
          },
          _sum: { amount: true },
        })
        .then((result) => ({
          month: start.toLocaleString("default", { month: "short" }),
          value: result._sum.amount || 0,
        }));
    })
  );

  return {
    total: expenses._sum.amount || 0,
    graphData,
  };
}

async function getTotalFeesCollected() {
  // Total fee amount assigned to students
  const totalFee = await prisma.fee.aggregate({
    _sum: { amount: true },
  });

  // Total fee amount actually paid
  const totalPaid = await prisma.fee.aggregate({
    _sum: { amountPaid: true },
  });

  // Total outstanding amount
  const totalOutstanding = (totalFee._sum.amount || 0) - (totalPaid._sum.amountPaid || 0);

  // Count of students who haven't fully paid
  const studentNotPaid = await prisma.fee.count({
    where: {
      status: "Pending",
    },
  });

  return {
    total: totalPaid._sum.amountPaid || 0,
    fineCollected: 0, // Optional: implement custom logic if fine is tracked
    studentNotPaid,
    totalOutstanding,
    percentageChange: {
      total: 0, // Optional: Implement based on past data
      fine: 0,
      notPaid: 0,
      outstanding: 0,
    },
  };
}

async function getNotices() {
  const notices = await prisma.notice.findMany({
    orderBy: { noticeDate: "desc" },
    take: 5,
    select: {
      title: true,
      noticeDate: true,
      publishDate: true,
      createdAt: true,
    },
  });

  return notices.map((n) => {
    const daysSince = Math.floor((Date.now() - new Date(n.noticeDate).getTime()) / (1000 * 60 * 60 * 24));

    return {
      title: n.title,
      date: n.noticeDate.toLocaleDateString(),
      daysSince,
      icon: "document", // You can change this dynamically if needed
      color: "blue", // Same for color
    };
  });
}

async function getTopSubjects(classFilter: string) {
  const subjects = await prisma.subject.findMany({
    where: {
      class: {
        name: classFilter,
      },
      status: "ACTIVE",
    },
    select: {
      name: true,
      lessons: { select: { id: true } },
      Assignment: { select: { id: true } },
      Exam: { select: { id: true } },
    },
  });

  const colorPalette = ["blue", "lightblue", "green", "yellow", "red", "purple", "orange"];

  const subjectsWithCompletion = subjects.map((subject, index) => {
    const lessonCount = subject.lessons.length;
    const assignmentCount = subject.Assignment.length;
    const examCount = subject.Exam.length;

    const rawCompletion = lessonCount + assignmentCount + examCount;
    const completion = Math.min(100, rawCompletion * 10); // 10 points per item, max 100

    return {
      name: subject.name,
      completion,
      color: colorPalette[index % colorPalette.length],
    };
  });

  return {
    class: classFilter,
    subjects: subjectsWithCompletion,
  };
}

async function getStudentActivities(filter: string) {
  // Calculate date range based on filter
  const now = new Date();
  let fromDate = new Date();

  if (filter === "THIS WEEK") {
    fromDate.setDate(now.getDate() - 7);
  } else if (filter === "THIS MONTH") {
    fromDate.setDate(now.getDate() - 30);
  } else {
    fromDate.setDate(now.getDate() - 1); // Default to 1 day
  }

  // Top exam performers (score >= 80)
  const examActivities = await prisma.result.findMany({
    where: {
      examId: { not: null },
      createdAt: { gte: fromDate },
      score: { gte: 80 },
    },
    include: {
      exam: { select: { title: true } },
      student: {
        select: { user: { select: { name: true } } },
      },
    },
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  const examMapped = examActivities.map((result) => ({
    title: `Top score in "${result.exam?.title}"`,
    description: `${result.student.user.name} scored ${result.score} marks.`,
    image: "", // Add student profile picture if available
  }));

  // Recent assignment submissions
  const assignmentSubmissions = await prisma.assignmentSubmission.findMany({
    where: { submittedAt: { gte: fromDate } },
    include: {
      assignment: { select: { title: true } },
      student: {
        select: { user: { select: { name: true } } },
      },
    },
    take: 5,
    orderBy: { submittedAt: "desc" },
  });

  const assignmentMapped = assignmentSubmissions.map((submission) => ({
    title: `Submitted "${submission.assignment?.title}"`,
    description: `${submission.student.user.name} submitted assignment.`,
    image: "", // Add student profile picture if needed
  }));

  return {
    filter,
    activities: [...examMapped, ...assignmentMapped].slice(0, 5), // Limit to top 5 combined
  };
}

async function getTodos(filter: string) {
  const now = new Date();
  let fromDate = new Date();

  if (filter === "THIS WEEK") {
    fromDate.setDate(now.getDate() - 7);
  } else if (filter === "THIS MONTH") {
    fromDate.setDate(now.getDate() - 30);
  } else {
    fromDate.setDate(now.getDate() - 1); // default to today
  }

  const todos = await prisma.todo.findMany({
    where: {
      createdAt: {
        gte: fromDate,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    select: {
      title: true,
      status: true,
      createdAt: true,
    },
  });

  const statusColorMap: Record<string, string> = {
    COMPLETED: "green",
    INPROGRESS: "blue",
    PENDING: "yellow",
    "YET TO START": "yellow",
  };

  return {
    filter,
    tasks: todos.map((todo) => ({
      title: todo.title,
      time: todo.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: todo.status,
      color: statusColorMap[todo.status.toUpperCase()] || "gray",
    })),
  };
}

async function getFeesCollectionChart(filter: string) {
  const currentDate = new Date();

  // Create the last 8 quarters dynamically
  const quarters = Array.from({ length: 8 }, (_, index) => {
    const quarterDate = subQuarters(currentDate, 7 - index);
    const start = startOfQuarter(quarterDate);
    const end = endOfQuarter(quarterDate);
    const label = `Q${Math.floor(start.getMonth() / 3) + 1}:${start.getFullYear()}`;

    return { label, start, end };
  });

  const data = await Promise.all(
    quarters.map(async ({ label, start, end }) => {
      const [totalFee, collectedFee] = await Promise.all([
        prisma.fee.aggregate({
          where: {
            paymentDate: { gte: start, lte: end },
          },
          _sum: { amount: true },
        }),
        prisma.payment.aggregate({
          where: {
            paymentDate: { gte: start, lte: end },
            status: "SUCCESS",
          },
          _sum: { amount: true },
        }),
      ]);

      return {
        quarter: label,
        totalFee: totalFee._sum.amount || 0,
        collectedFee: collectedFee._sum.amount || 0,
      };
    })
  );

  return {
    filter,
    data,
  };
}

async function getLeaveRequests(filter: string, schoolId: string) {
  const leaveRequests = await prisma.leaveRequest.findMany({
    where: {
      user: {
        school: {
          id: schoolId,
        },
      },
    },
    include: {
      user: {
        select: {
          name: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return {
    filter,
    requests: leaveRequests.map((req) => ({
      name: req.user.name,
      designation: req.user.role,
      leaveType: req.reason,
      leaveDates: `${req.fromDate.toLocaleDateString()} - ${req.toDate.toLocaleDateString()}`,
      applyDate: req.createdAt.toLocaleDateString(),
      status: req.status,
    })),
  };
}

async function getUpcomingEvents(schoolId: string) {
  const today = new Date();

  const events = await prisma.event.findMany({
    where: {
      schoolId,
    },
    orderBy: {
      start: "asc",
    },
    take: 5,
  });

  return events.map((event) => ({
    time: `${event.start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${event.end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
    title: event.title,
    date: event.start
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase(),
    iconColor: event.start > today ? "blue" : "pink",
    status: event.start > today ? "upcoming" : "past",
  }));
}

async function getBestPerformer() {
  const topTeacher = await prisma.teacher.findFirst({
    where: {
      lessons: {
        some: {
          assignments: {
            some: {
              results: {
                some: {},
              },
            },
          },
        },
      },
    },
    select: {
      id: true,
      user: {
        select: {
          name: true,
          role: true,
          profilePic: true,
        },
      },
      lessons: {
        select: {
          assignments: {
            select: {
              results: {
                select: {
                  score: true,
                },
              },
            },
            take: 10, // prevent overload
          },
          subject: {
            select: { name: true },
          },
        },
        take: 5,
      },
    },
  });

  if (!topTeacher) {
    return {
      name: "No Data",
      role: "N/A",
      image: "/images/default.jpg",
      carouselPosition: 0,
      totalItems: 0,
    };
  }

  // Calculate average score
  const scores: number[] = [];

  for (const lesson of topTeacher.lessons) {
    for (const assignment of lesson.assignments) {
      for (const result of assignment.results) {
        if (typeof result.score === "number") scores.push(result.score);
      }
    }
  }

  const averageScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;

  return {
    name: topTeacher.user.name,
    role: topTeacher.user.role,
    image: topTeacher.user.profilePic || "/images/default.jpg",
    carouselPosition: 1,
    totalItems: 2,
    averageScore: Math.round(averageScore),
  };
}

async function getStarStudents() {
  // Step 1: Fetch students with their average scores
  const topScorer = await prisma.result.groupBy({
    by: ["studentId"],
    _avg: {
      score: true,
    },
    orderBy: {
      _avg: {
        score: "desc",
      },
    },
    take: 1,
  });

  const top = topScorer[0];
  if (!top) {
    return {
      name: "No Data",
      class: "-",
      image: "/images/default-student.jpg",
      carouselPosition: 0,
      totalItems: 0,
    };
  }

  // Step 2: Fetch student details
  const student = await prisma.student.findUnique({
    where: { id: top.studentId },
    select: {
      user: {
        select: {
          name: true,
          profilePic: true,
        },
      },
      class: {
        select: {
          name: true,
          Section: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!student || !student.user || !student.class) {
    return {
      name: "Data Missing",
      class: "-",
      image: "/images/default-student.jpg",
      carouselPosition: 0,
      totalItems: 0,
    };
  }

  return {
    name: student.user.name,
    class: `${student.class.name}, ${student.class.Section || ""}`,
    image: student.user.profilePic || "/images/default-student.jpg",
    averageScore: Math.round(top._avg.score ?? 0),
    carouselPosition: 1,
    totalItems: 2,
  };
}

async function getPerformanceMetrics(month: string) {
  const [monthName, yearStr] = month.split(" ");
  const year = parseInt(yearStr);
  const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();

  const start = startOfMonth(new Date(year, monthIndex));
  const end = endOfMonth(new Date(year, monthIndex));

  const results = await prisma.result.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    select: {
      score: true,
    },
  });

  if (results.length === 0) {
    return {
      month,
      data: {
        top: 0,
        average: 0,
        belowAverage: 0,
      },
    };
  }

  // Define thresholds
  const topThreshold = 75;
  const avgThreshold = 40;

  let top = 0;
  let average = 0;
  let belowAverage = 0;

  for (const r of results) {
    if (r.score >= topThreshold) {
      top++;
    } else if (r.score >= avgThreshold) {
      average++;
    } else {
      belowAverage++;
    }
  }

  return {
    month,
    data: {
      top,
      average,
      belowAverage,
    },
  };
}

import { prisma } from "../../db/prisma";
import { Request, Response } from "express";

export const getStudentDashboard = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.user?.id;

    // Find student by userId
    const student = await prisma.student.findFirst({
      where: { userId },
      include: {
        user: true,
        class: true,
        school:true,
      },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found for this user" });
    }

    const studentId = student.id;
    const classId = student.classId;
    const schoolId = student.schoolId;

    const [
      personalInfo,
      academicPerformance,
      attendance,
      fees,
      libraryInfo,
      // hostelInfo,
      transportInfo,
      events,
      doubts,
      quizzes,
      roadmaps,
      newspaperSubmissions,
      timetable,
      assignments,
   
    ] = await Promise.all([
      getPersonalInfo(student),
      getAcademicPerformance(studentId, classId),
      getAttendance(studentId),
      getFees(studentId),
      getLibraryInfo(studentId),
   
      getTransportInfo(studentId),
      getEvents(schoolId),
      getDoubts(studentId),
      getQuizzes(studentId, classId),
      getRoadmaps(studentId),
      getNewspaperSubmissions(studentId),
      getTimetable(classId),
      getAssignments(studentId, classId),
    
      getParentsInfo(studentId),
    ]);

    res.json({
      personalInfo,
      academicPerformance,
      attendance,
      fees,
      libraryInfo,
      
      transportInfo,
      events,
      doubts,
      quizzes,
      roadmaps,
      newspaperSubmissions,
      timetable,
      assignments,
   
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 1. Personal Info
function getPersonalInfo(student: any) {
  return {
    name: student.user.name,
    class: student.class.name,
    rollNo: student.rollNo,
    profilePic: student.user.profilePic,
    email: student.user.email,
    phone: student.user.phone,
    dateOfBirth: student.user.dateOfBirth,
    admissionDate: student.admissionDate,
  };
}

// 2. Academic Performance
async function getAcademicPerformance(studentId: string, classId: string) {
  const results = await prisma.result.findMany({
    where: { studentId },
    include: {
      exam: { include: { subject: true } },
      assignment: { include: { subject: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

const upcomingExams = await prisma.exam.findMany({
  where: {
    classId,
    scheduleDate: {
      gte: new Date(),
    },
  },
  orderBy: {
    scheduleDate: 'asc',
  },
  take: 5,
  select: {
    title: true,
    scheduleDate: true,
    subject: {
      select: {
        name: true,
      },
    },
  },
});


  return { recentResults: results, upcomingExams };
}

// 3. Attendance
async function getAttendance(studentId: string) {
  const attendance = await prisma.attendance.findMany({
    where: { studentId },
    orderBy: { date: "desc" },
  });

  const totalDays = attendance.length;
  const presentDays = attendance.filter((a) => a.present).length;
  const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
  const recentRecords = attendance.slice(0, 10).map((a) => ({
    date: a.date,
    status: a.present ? "Present" : "Absent",
    // remarks: a.remarks,
  }));

  return { percentage, totalDays, presentDays, recentRecords };
}


// 4. Fees
async function getFees(studentId: string) {
  const fees = await prisma.fee.findMany({
    where: { studentId },
    orderBy: { dueDate: "asc" },
    select: {
      id: true,
      category: true,
      amount: true,
      amountPaid: true,
      dueDate: true,
      status: true,
      createdAt: true,
      Payment: {
        select: {
          amount: true,
          paymentDate: true, // ✅ Corrected from 'date' to 'paymentDate'
          paymentMethod: true,
        },
      },
    },
  });

  const pendingFees = fees.filter((f) => f.amount - f.amountPaid > 0);

  const totalPending = pendingFees.reduce((sum, fee) => sum + (fee.amount - fee.amountPaid), 0);

  const paymentHistory = fees.flatMap((f) =>
    f.Payment.map((p) => ({
      category: f.category,
      amount: p.amount,
      date: p.paymentDate, 
      method: p.paymentMethod,
    }))
  );

  return { pendingFees, totalPending, paymentHistory };
}


// 5. Library
async function getLibraryInfo(userId: string) {
  const bookIssues = await prisma.bookIssue.findMany({
    where: { userId },
    include: {
      bookCopy: {
        include: {
          book: true,
        },
      },
      fine: true, // ✅ Include related fine details if needed
    },
    orderBy: {
      issueDate: "desc",
    },
  });

  const currentBooks = bookIssues
    .filter((b) => !b.returnDate)
    .map((issue) => ({
      title: issue.bookCopy.book.title,
      isbn: issue.bookCopy.book.isbn,
      issueDate: issue.issueDate,
      dueDate: issue.dueDate,
      fine: issue.fine?.amount || 0, // ✅ Use fine amount safely if available
    }));

  const pastBooks = bookIssues
    .filter((b) => b.returnDate)
    .map((issue) => ({
      title: issue.bookCopy.book.title,
      isbn: issue.bookCopy.book.isbn,
      issueDate: issue.issueDate,
      returnDate: issue.returnDate,
      fine: issue.fine?.amount || 0, // ✅ Use fine amount safely if available
    }));

  return {
    currentBooks,
    pastBooks,
  };
}





// 7. Transport
async function getTransportInfo(studentId: string) {
  // Get student's assigned bus
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: {
      busId: true,
    },
  });

  if (!student?.busId) return null;

  // Fetch the full bus info with route and stops
  const bus = await prisma.bus.findUnique({
    where: { id: student.busId },
    include: {
      drivers: {
        select: {
          name: true,
        },
        take: 1,
      },
      routes: {
        include: {
          busStops: {
            select: {
              name: true,
              location: true,
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
        take: 1,
      },
    },
  });

  if (!bus) return null;

  const driverName = bus.drivers.length > 0 ? bus.drivers[0].name : null;
  const route = bus.routes[0];

  return {
    busNumber: bus.busNumber,
    driverName: driverName,
    routeName: route?.name,
    stops: route?.busStops.map((stop) => ({
      name: stop.name,
      location: stop.location,
    })) || [],
  };
}


// 8. Events
async function getEvents(schoolId: string) {
  const upcomingEvents = await prisma.event.findMany({
    where: {
      schoolId,
      start: {
        gte: new Date(), // Fetch only upcoming events
      },
    },
    orderBy: {
      start: "asc",
    },
    take: 10,
    select: {
      id: true,
      title: true,
      description: true,
      start: true,
      end: true,
      category: true,
      attachment: true,
      targetAudience: true,
      roles: {
        select: {
          name: true,
        },
      },
      sections: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return upcomingEvents;
}


// 9. Doubts
async function getDoubts(userId: string) {
  const doubts = await prisma.doubt.findMany({
    where: { userId },
    include: {
      answers: { include: { user: { select: { name: true } } } },
      subject: true,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return doubts.map((doubt) => ({
    id: doubt.id,
    title: doubt.title,
    content: doubt.content,
    subject: doubt.subject?.name,
    createdAt: doubt.createdAt,
    answers: doubt.answers.map((a) => ({
      content: a.content,
      answeredBy: a.user.name,
      createdAt: a.createdAt,
    })),
  }));
}

// 10. Quizzes
async function getQuizzes(userId: string, classId: string) {
  // 1. Fetch quiz results for the user
  const quizResults = await prisma.quizResult.findMany({
    where: { userId },
    include: {
      quiz: {
        select: {
          question: true,
          maxScore: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // 2. Fetch active quizzes for the class
  const activeQuizzes = await prisma.quiz.findMany({
    where: {
      classId,
      endDate: {
        gte: new Date(),
      },
    },
    select: {
      id: true,
      question: true,
      startDate: true,
      endDate: true,
    },
  });

  return {
    results: quizResults.map((result) => ({
      quizTitle: result.quiz.question,
      score: result.score,
      maxScore: result.quiz.maxScore,
      attemptedAt: result.createdAt,
    })),
    activeQuizzes,
  };
}


// 11. Roadmaps

async function getRoadmaps(userId: string) {
  const roadmaps = await prisma.roadmap.findMany({
    where: { userId },
    include: {
      topics: {
        select: {
          name: true,
          isCompleted: true,
          completedAt: true,
        },
      },
    },
    orderBy: {
      startDate: "asc",
    },
  });

  return roadmaps.map((roadmap) => {
    const completedTopics = roadmap.topics.filter((t) => t.isCompleted).length;
    const totalTopics = roadmap.topics.length;
    const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    return {
      title: roadmap.title,
      // description: roadmap.description,
      progress,
      topics: roadmap.topics.map((t) => ({
        name: t.name,
        isCompleted: t.isCompleted,
        completedAt: t.completedAt,
      })),
    };
  });
}

// 12. Newspaper Submissions
async function getNewspaperSubmissions(studentId: string) {
  const submissions = await prisma.newspaperSubmission.findMany({
    where: { studentId },
    include: {
      newspaper: {
        select: {
          title: true,
        },
      },
    },
    orderBy: { submittedAt: "desc" },
    take: 10,
  });

  return submissions.map((sub) => ({
    newspaperTitle: sub.newspaper.title,
    articleTitle: sub.translatedText,
    voiceUrl: sub.voiceUrl,
    submittedAt: sub.submittedAt,
    // status: sub.newspaper.status,
    feedback: sub.feedback,
    score: sub.score,
  }));
}


// 13. Timetable
async function getTimetable(classId: string) {
  const timetable = await prisma.lesson.findMany({
    where: { classId },
    include: {
      subject: {
        select: { name: true }
      },
      teacher: {
        include: {
          user: {
            select: { name: true }
          }
        }
      }
    },
    orderBy: [
      { day: "asc" },
      { startTime: "asc" }
    ]
  });

  return timetable.map((t) => ({
    day: t.day,
    startTime: t.startTime,
    endTime: t.endTime,
    subject: t.subject?.name ?? "N/A",
    teacher: t.teacher?.user?.name ?? "TBD",
    room: t.name 
  }));
}


// 14. Assignments
async function getAssignments(studentId: string, classId: string) {
  const assignments = await prisma.assignment.findMany({
    where: { classId },
    include: {
      subject: { select: { name: true } },
      AssignmentSubmission: {
        where: { studentId },
        select: {
          submittedAt: true,
          file: true,
        },
      },
    },
    orderBy: { dueDate: "asc" },
  });

  return assignments.map((a) => {
    const submission = a.AssignmentSubmission[0];

    return {
      id: a.id,
      title: a.title,
      subject: a.subject?.name || "N/A",
      description: a.description,
      dueDate: a.dueDate,
      // maxScore: a.maxScore ?? null,
      status: submission ? "Submitted" : "Not Submitted",
      submittedAt: submission?.submittedAt || null,
      file: submission?.file || null,
    };
  });
}




// 16. Parents Info
async function getParentsInfo(studentId: string) {
  const parents = await prisma.parent.findMany({
    where: { students: { some: { id: studentId } } },
    include: { user: true },
  });

  return parents.map((p) => ({
    name: p.user?.name,
    email: p.user?.email,
    phone: p.user?.phone,
    // relationship: p.relationship,
  }));
}






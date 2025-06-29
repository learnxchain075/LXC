import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";

// Dashboard Response Interface
export interface IStudentDashboardResponse {
  personalInfo: IPersonalInfo;
  academicPerformance: IAcademicPerformance;
  attendance: IAttendance;
  fees: IFees;
  libraryInfo: ILibraryInfo;
  transportInfo: ITransportInfo | null;
  events: IEvent[];
  doubts: IDoubt[];
  quizzes: IQuiz;
  roadmaps: IRoadmap[];
  newspaperSubmissions: INewspaperSubmission[];
  timetable: ITimetable[];
  assignments: IAssignment[];
}

// Personal Info
export interface IPersonalInfo {
  name: string;
  class: string;
  rollNo: string;
  profilePic: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  admissionDate: string;
}

// Academic Performance
export interface IAcademicPerformance {
  recentResults: IResult[];
  upcomingExams: IUpcomingExam[];
}

export interface IResult {
  id: string;
  score: number;
  exam?: {
    title: string;
    subject: {
      name: string;
    };
  };
  assignment?: {
    title: string;
    subject: {
      name: string;
    };
  };
  createdAt: string;
}

export interface IUpcomingExam {
  title: string;
  scheduleDate: string;
  subject: {
    name: string;
  };
}

// Attendance
export interface IAttendance {
  percentage: number;
  totalDays: number;
  presentDays: number;
  recentRecords: IAttendanceRecord[];
}

export interface IAttendanceRecord {
  date: string;
  status: string;
}

// Fees
export interface IFees {
  pendingFees: IPendingFee[];
  totalPending: number;
  paymentHistory: IPaymentHistory[];
}

export interface IPendingFee {
  id: string;
  category: string;
  amount: number;
  amountPaid: number;
  dueDate: string;
  status: string;
  createdAt: string;
  Payment: IPayment[];
}

export interface IPayment {
  amount: number;
  paymentDate: string;
  paymentMethod: string;
}

export interface IPaymentHistory {
  category: string;
  amount: number;
  date: string;
  method: string;
}

// Library Info
export interface ILibraryInfo {
  currentBooks: ICurrentBook[];
  pastBooks: IPastBook[];
}

export interface ICurrentBook {
  title: string;
  isbn: string;
  issueDate: string;
  dueDate: string;
  fine: number;
}

export interface IPastBook {
  title: string;
  isbn: string;
  issueDate: string;
  returnDate: string;
  fine: number;
}

// Transport Info
export interface ITransportInfo {
  busNumber: string;
  driverName: string | null;
  routeName: string | null;
  stops: IBusStop[];
}

export interface IBusStop {
  name: string;
  location: string;
}

// Events
export interface IEvent {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  category: string;
  attachment: string | null;
  targetAudience: string;
  roles: { name: string }[];
  sections: { id: string; name: string }[];
}

// Doubts
export interface IDoubt {
  id: string;
  title: string;
  content: string;
  subject: string | null;
  createdAt: string;
  answers: IDoubtAnswer[];
}

export interface IDoubtAnswer {
  content: string;
  answeredBy: string;
  createdAt: string;
}

// Quizzes
export interface IQuiz {
  results: IQuizResult[];
  activeQuizzes: IActiveQuiz[];
}

export interface IQuizResult {
  quizTitle: string;
  score: number;
  maxScore: number;
  createdAt: string;
}

export interface IActiveQuiz {
  id: string;
  question: string;
  startDate: string;
  endDate: string;
}

// Roadmaps
export interface IRoadmap {
  id: string;
  title: string;
  description: string;
  progress: number;
  createdAt: string;
}

// Newspaper Submissions
export interface INewspaperSubmission {
  id: string;
  title: string;
  content: string;
  attachment: string | null;
  createdAt: string;
  submission: string | null;
}

// Timetable
export interface ITimetable {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: {
    name: string;
  };
  teacher: {
    name: string;
  };
  roomNumber: string;
}

// Assignments
export interface IAssignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  subject: {
    name: string;
  };
  createdAt: string;
}

// API Functions
export const getStudentDashboard = async (): Promise<AxiosResponse<IStudentDashboardResponse>> => {
  return await BaseApi.getRequest('/school-student/dashboard');
};

export const getStudentDashboardStats = async (): Promise<AxiosResponse<{
  attendance: IAttendance;
  fees: IFees;
  academicPerformance: IAcademicPerformance;
}>> => {
  return await BaseApi.getRequest('/school-student/dashboard/stats');
};

export const getStudentUpcomingEvents = async (): Promise<AxiosResponse<IEvent[]>> => {
  return await BaseApi.getRequest('/school-student/dashboard/events');
};

export const getStudentTimetable = async (): Promise<AxiosResponse<ITimetable[]>> => {
  return await BaseApi.getRequest('/school-student/dashboard/timetable');
};

export const getStudentAssignments = async (): Promise<AxiosResponse<IAssignment[]>> => {
  return await BaseApi.getRequest('/school-student/dashboard/assignments');
}; 
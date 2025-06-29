// Lesson-related interfaces
export interface ILessonResponse {
  success: boolean;
  lessons: ILesson[];
}

export interface ILesson {
  id?: string;
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  subjectId: string;
  classId: string;
  teacherId: string;
  subject: ISubject;
  teacher: ITeacher;
}

export interface ISubject {
  id: string;
  name: string;
}

export interface ITeacher {
  id: string;
  user: IUser;
}

export interface IUser {
  name: string;
  email: string;
  profilePic: string;
}

// Fee-related interfaces
export interface IFeeResponse {
  success: boolean;
  fees: IFee[];
}

export interface IFee {
  id: string;
  studentId: string;
  schoolId: string;
  amount: number;
  amountPaid: number;
  dueDate: string;
  category: string;
  finePerDay: number;
  status: string;
  discount: number;
  scholarship: number;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
  lastReminderSentAt: string | null;
  Payment: IPayment[];
  school: ISchool;
}

export interface IPayment {
  id: string;
  amount: number;
  status: string;
  method: string | null;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  paymentDate: string;
  createdAt: string;
}

export interface ISchool {
  id: string;
  schoolName: string;
}

// Resource-related interfaces
export interface IResourceResponse {
  success: boolean;
  assignments: IAssignment[];
  homeworks: IHomework[];
  pyqs: IPyq[];
}

export interface IAssignment {
  id: string;
  title: string;
  description: string;
  attachment: string | null;
  status: string;
  startDate: string;
  dueDate: string;
  lessonId: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  subject: ISubject;
  lesson: ILesson;
  AssignmentSubmission?: IAssignmentSubmission[];
}

export interface IAssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: string;
  file: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IHomework {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  attachment: string | null;
  status: string;
  classId: string;
  subjectId: string;
  createdAt: string;
  updatedAt: string;
  subject: ISubject;
  HomeworkSubmission: IHomeworkSubmission[];
}

export interface IHomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  submissionDate: string;
  submittedAt: string;
  attachment: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPyq {
  id: string;
  question: string;
  solution: string;
  subject: string;
  topic: string;
  uploaderId: string;
  createdAt: string;
}



import { AxiosResponse } from "axios";
import BaseApi from "../BaseApi";


export const getLessonsByStudentId = async (
  studentId: string
): Promise<AxiosResponse<ILessonResponse>> => {
  return await BaseApi.getRequest(`/student/${studentId}/lessons`);
};

export const getFeesByStudentId = async (
  studentId: string
): Promise<AxiosResponse<IFeeResponse>> => {
  return await BaseApi.getRequest(`/student/${studentId}/fees`);
};


export const getResourcesByStudentId = async (
  studentId: string
): Promise<AxiosResponse<IResourceResponse>> => {
  return await BaseApi.getRequest(`/student/${studentId}/resources`);
};




export interface IAttendanceLeavesResponse {
  success: boolean;
  attendance: IAttendance[];
  leaveRequests: ILeaveRequest[];
}


export interface IAttendance {
  id: string;
  date: string;
  present: boolean;
  studentId: string;
  lessonId: string;
  lesson: ILesson;
}


export interface ILesson {
  id?: string;
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: ISubject;
}

export interface ISubject {
  name: string;
}

export interface ILeaveRequest {
  id?: string;
  studentId?: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}


export const getAttendanceLeavesByStudentId = async (
  studentId: string
): Promise<AxiosResponse<IAttendanceLeavesResponse>> => {
  return await BaseApi.getRequest(`/student/${studentId}/attendance-leaves`);
};



export interface IDashboardResourcesResponse {
  success: boolean;
  notices: INotice[];
  holidays: IHoliday[];
  events: IEvent[];
}

export interface INotice {
  id: string;
  title: string;
  message: string;
  noticeDate: string;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  schoolId: string;
  attachment: string;
  recipients: IRecipient[];
  creator: ICreator;
}

export interface IRecipient {
  id: number;
  noticeId: string;
  userType: string;
}

export interface ICreator {
  name: string;
  email: string;
  profilePic: string;
}

export interface IHoliday {
  id: string;
  name: string;
  date: string;
  fromday: string | null;
  toDay: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  schoolId: string;
}

export interface IEvent {
  id?: string;
  name?: string;
  date?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  schoolId?: string;
}

export const getDashboardResourcesByStudentId = async (): Promise<AxiosResponse<IDashboardResourcesResponse>> => {
  const studentId = localStorage.getItem('studentId');
  return await BaseApi.getRequest(`/student/${studentId}/dashboard-resources`);
};




export interface IExamsResultsResponse {
  success: boolean;
  exams: IExam[];
}

export interface IExam {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  classId: string;
  passMark: number | null;
  totalMarks: number | null;
  duration: number | null;
  roomNumber: string | null;
  subjectId: string;
  scheduleDate: string | null;
  subject: ISubject;
  ExamAttendance: IExamAttendance[];
  results: IResult[];
}

export interface ISubject {
  id: string;
  name: string;
  code: string;
  type: string;
  classId: string;
}

export interface IExamAttendance {
  id: string;
  date: string;
  present: boolean;
}

export interface IResult {
  id: string;
  score: number;
}

export const getExamsResultsByStudentId = async (): Promise<AxiosResponse<IExamsResultsResponse>> => {
  const studentId = localStorage.getItem('studentId');
  return await BaseApi.getRequest(`/student/${studentId}/exams-results`);
};



export interface IQuizNewspaperResponse {
  success: boolean;
  quizzes: IQuiz[];
  newspapers: INewspaper[];
}

export interface IQuiz {
  id: string;
  question: string;
  options: string[];
  answer: string;
  createdAt: string;
  score: number | null;
  attemptedAt: string | null;
}

export interface INewspaper {
  id: string;
  title: string;
  content: string;
  attachment: string | null;
  createdAt: string;
  submission: string | null;
}

export const getQuizNewspaperByStudentId = async (): Promise<AxiosResponse<IQuizNewspaperResponse>> => {
  const studentId = localStorage.getItem('studentId');
  return await BaseApi.getRequest(`/student/${studentId}/quiz-newspaper`);
};


export interface IClass {
  id: string;
  roomNumber: string | null;
  name: string;
  capacity: number;
  schoolId: string;
  section: string;
}

export interface IStudent {
  id: string;
  academicYear: string;
  admissionNo: string;
  admissionDate: string;
  rollNo: string;
  status: string;
  dateOfBirth: string;
  Religion: string;
  category: string;
  caste: string;
  motherTongue: string;
  languagesKnown: string;
  fatherName: string;
  fatheremail: string;
  fatherPhone: string;
  fatherOccupation: string;
  motherName: string;
  motherEmail: string;
  motherPhone: string;
  motherOccupation: string;
  gardianName: string;
  gardianRealtion: string;
  gardianEmail: string;
  gardianPhone: string;
  gardianOccupation: string;
  gardianAddress: string;
  areSiblingStudying: string;
  siblingName: string;
  siblingClass: string;
  siblingRollNo: string;
  sibllingAdmissionNo: string;
  currentAddress: string;
  permanentAddress: string;
  vehicleNumber: string | null;
  routeId: string | null;
  busStopId: string | null;
  hostelName: string;
  roomNumber: string;
  medicalCertificate: string;
  transferCertificate: string;
  medicaConditon: string;
  allergies: string;
  medicationName: string;
  schoolName: string;
  address: string;
  schoolId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  classId: string;
  busId: string | null;
  class: IClass;
  route: any; 
  busStop: any;
}

export interface IStudentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePic: string;
  password: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  bloodType: string;
  sex: string;
  schoolId: string | null;
  reputation: number;
  coins: number;
  redeemedBalance: number;
  createdAt: string;
  updatedAt: string;
  teacherId: string | null;
  studentId: string;
  parentId: string | null;
  libraryId: string | null;
  hostelId: string | null;
  transportId: string | null;
  accountId: string | null;
  employeeType: string | null;
  departmentId: string | null;
  designationId: string | null;
  role: string;
  lastOnline: string | null;
  student: IStudent;
}

export const getStudentUserById = async (): Promise<{ data: IStudentUser }> => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    throw new Error("User  not found ");
  }
  return  await BaseApi.getRequest(`/student/user/${userId}`);

};

// 🔹 Submit Homework
export interface ISubmitHomeworkRequest {
  studentId: string;
  homeworkId: string;
  file:File; // required
}

export interface ISubmitHomeworkResponse {
  success: boolean;
  message: string;
}

// 🔹 Submit Assignment
export interface ISubmitAssignmentRequest {
  studentId: string;
  assignmentId: string;
  file?: File; // optional
}

export interface ISubmitAssignmentResponse {
  success: boolean;
  message: string;
}

// 🔹 Submit Homework API
export const submitHomework = async (
  payload: FormData
): Promise<AxiosResponse<ISubmitHomeworkResponse>> => {
  const studentId = payload.get('studentId') as string;
  return await BaseApi.postRequest(
    `/student/${studentId}/submit-homework`,
    payload,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};

// 🔹 Submit Assignment API
export const submitAssignment = async (
  payload: FormData
): Promise<AxiosResponse<ISubmitAssignmentResponse>> => {
  const studentId = payload.get('studentId') as string;
  return await BaseApi.postRequest(
    `/student/${studentId}/submit-assignment`,
    payload,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};


export const getstudentprofiledetails = async (
  id: any
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/student/user/${id}`);
};

// Library-related interfaces and APIs
export interface ILibraryResponse {
  success: boolean;
  books: IBookIssue[];
}

export interface IBookIssue {
  id: string;
  bookCopyId: string;
  userId: string;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  finePaid: boolean;
  bookCopy: IBookCopy;
}

export interface IBookCopy {
  id: string;
  accessionNumber: string;
  status: string;
  book: IBook;
}

export interface IBook {
  id: string;
  title: string;
  isbn: string;
  publicationDate: string;
  genre: string;
  type: string;
  department: string;
  class: string;
  subject: string;
  edition: string;
  coverImage: string | null;
}

export const getStudentLibraryBooks = async (): Promise<AxiosResponse<ILibraryResponse>> => {
  return await BaseApi.getRequest(`/student/library/books`);
};

// Fees Overview interfaces
export interface IFeesOverviewResponse {
  success: boolean;
  overview: IFeesOverview;
}

export interface IFeesOverview {
  totalFees: number;
  paidFees: number;
  dueFees: number;
  pendingFees: number;
  feeBreakdown: IFeeBreakdown[];
}

export interface IFeeBreakdown {
  category: string;
  total: number;
  paid: number;
  due: number;
  dueDate: string;
}

export const getStudentFeesOverview = async (): Promise<AxiosResponse<IFeesOverviewResponse>> => {
  return await BaseApi.getRequest('/student/fees-overview');
};

// Mock data for components that don't have APIs yet
export const mockLeaveData = {
  medicalLeave: { total: 10, used: 5, available: 5 },
  casualLeave: { total: 12, used: 1, available: 11 },
  maternityLeave: { total: 10, used: 0, available: 10 },
  paternityLeave: { total: 0, used: 0, available: 0 },
  leaveRequests: [
    {
      id: '1',
      leaveType: 'Medical Leave',
      leaveDate: '2024-01-15',
      noOfDays: '3',
      appliedOn: '2024-01-10',
      status: 'Approved'
    },
    {
      id: '2',
      leaveType: 'Casual Leave',
      leaveDate: '2024-01-20',
      noOfDays: '1',
      appliedOn: '2024-01-18',
      status: 'Pending'
    }
  ]
};

export const mockAttendanceData = {
  summary: {
    present: 265,
    absent: 5,
    halfDay: 1,
    late: 12
  },
  monthlyData: [
    { date: '1', jan: '1', feb: '1', mar: '1', apr: '1', may: '1', jun: '1', jul: '1', aug: '1', sep: '1', oct: '1', nov: '1', dec: '1' },
    { date: '2', jan: '1', feb: '1', mar: '1', apr: '1', may: '1', jun: '1', jul: '1', aug: '1', sep: '1', oct: '1', nov: '1', dec: '1' },
    { date: '3', jan: '1', feb: '1', mar: '1', apr: '1', may: '1', jun: '1', jul: '1', aug: '1', sep: '1', oct: '1', nov: '1', dec: '1' }
  ]
};

export const mockLibraryData = {
  books: [
    {
      id: '1',
      title: 'The Small-Town Library',
      coverImage: 'assets/img/books/book-01.jpg',
      issueDate: '2024-01-25',
      dueDate: '2024-02-25',
      status: 'Issued'
    },
    {
      id: '2',
      title: 'Apex Time',
      coverImage: 'assets/img/books/book-02.jpg',
      issueDate: '2024-01-22',
      dueDate: '2024-02-22',
      status: 'Issued'
    },
    {
      id: '3',
      title: 'The Cobalt Guitar',
      coverImage: 'assets/img/books/book-03.jpg',
      issueDate: '2024-01-30',
      dueDate: '2024-02-10',
      status: 'Issued'
    }
  ]
};

// Leaderboard-related interfaces
export interface ILeaderboardResponse {
  success: boolean;
  leaderboard: ILeaderboardEntry[];
  start?: string;
  end?: string;
}

export interface ILeaderboardEntry {
  userId: string;
  name: string;
  email: string;
  profilePic: string;
  quizScore: number;
  newspaperScore: number;
  doubtsSolved: number;
  totalPoints: number;
  rank: number;
}

export interface IClassLeaderboardResponse {
  success: boolean;
  leaderboard: IClassLeaderboardEntry[];
  start?: string;
  end?: string;
}

export interface IClassLeaderboardEntry {
  studentId: string;
  name: string;
  profilePic: string;
  homeworkCount: number;
  assignmentScore: number;
  examScore: number;
  totalPoints: number;
  rank: number;
}

export interface IRoadmapLeaderboardResponse {
  leaderboard: IRoadmapLeaderboardEntry[];
}

export interface IRoadmapLeaderboardEntry {
  studentId: string;
  name: string;
  profilePic: string;
  streak: number;
  coins: number;
  completionRate: number;
  score: number;
  rank: number;
}

// Leaderboard API functions
export const getMonthlyLeaderboard = async (): Promise<AxiosResponse<ILeaderboardResponse>> => {
  return await BaseApi.getRequest('/leader-board/monthly');
};

export const getClassInternalLeaderboard = async (classId: string): Promise<AxiosResponse<IClassLeaderboardResponse>> => {
  return await BaseApi.getRequest(`/student/class/${classId}/internal`);
};

export const getRoadmapLeaderboard = async (classId: string): Promise<AxiosResponse<IRoadmapLeaderboardResponse>> => {
  return await BaseApi.getRequest(`/student/class/${classId}/roadmap`);
};

export interface IApplyLeaveRequest {
  userId: string;
  reason: string;
  fromDate: string;
  toDate: string;
  status?: string;
  leaveType?: string;
}

export const applyStudentLeave = async (payload: IApplyLeaveRequest): Promise<AxiosResponse<any>> => {
  return await BaseApi.postRequest('/user/leave', payload);
};

// Get student's leave requests
export const getStudentLeaveRequests = async (): Promise<AxiosResponse<ILeaveRequest[]>> => {
  return await BaseApi.getRequest('/user/leave/me');
};
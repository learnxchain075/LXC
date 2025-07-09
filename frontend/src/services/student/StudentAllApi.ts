// Lesson-related interfaces

import { IquizResult } from "../types/teacher/quizeResultService";


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


export const getLessonsByStudentId = async (
  studentId: string
): Promise<AxiosResponse<ILessonResponse>> => {
  return await BaseApi.getRequest(`/student/${studentId}/lessons`);
};

export const getFeesByStudentId = async (
  studentId: string
): Promise<AxiosResponse<IFeeResponse>> => {
  // Validate studentId before making the request
  if (!studentId || studentId === 'undefined' || studentId === 'null') {
    throw new Error('Invalid student ID provided');
  }
  
  try {
    return await BaseApi.getRequest(`/student/${studentId}/fees`);
  } catch (error: any) {
    // Error fetching student fees
    if (error.response?.status === 400) {
      throw new Error('Invalid student ID format. Please check the student ID.');
    }
    throw error;
  }
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

export const getDashboardResourcesByStudentId = async (studentId?:string): Promise<AxiosResponse<IDashboardResourcesResponse>> => {
  const studentIdSend = localStorage.getItem('studentId') || studentId || '';
  return await BaseApi.getRequest(`/student/${studentIdSend}/dashboard-resources`);
};

export const getDashboardResourcesByStudentIdV2 = async (studentId: string) => {
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

export const getExamsResultsByStudentIdParam = async (studentId: string): Promise<AxiosResponse<IExamsResultsResponse>> => {
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
  guardianName: string;
  guardianRelation: string;
  guardianEmail: string;
  guardianPhone: string;
  guardianOccupation: string;
  guardianAddress: string;
  areSiblingStudying: string;
  siblingName: string;
  siblingClass: string;
  siblingRollNo: string;
  siblingAdmissionNo: string;
  currentAddress: string;
  permanentAddress: string;
  vehicleNumber: string | null;
  routeId: string | null;
  busStopId: string | null;
  hostelName: string;
  roomNumber: string;
  medicalCertificate: string;
  transferCertificate: string;
  medicalCondition: string;
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

export interface ISubmitHomeworkRequest {
  studentId: string;
  homeworkId: string;
  file:File; // required
}

export interface ISubmitHomeworkResponse {
  success: boolean;
  message: string;
}

export interface ISubmitAssignmentRequest {
  studentId: string;
  assignmentId: string;
  file?: File; // optional
}

export interface ISubmitAssignmentResponse {
  success: boolean;
  message: string;
}

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
  return await BaseApi.getRequest(`/user/get/${id}`);
};
export const getstudentprofiledetailsparents = async (
  id: any
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(`/school/student/${id}`); //fee
};

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

export interface ILeaderboardResponse {
  success: boolean;
  leaderboard: any[];
}

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

export const getStudentLeaveRequests = async (): Promise<AxiosResponse<ILeaveRequest[]>> => {
  return await BaseApi.getRequest('/user/leave/me');
};

export const getStudentUserDetails = async (userId: string) => {
 // console.log("Fetching student user details for userId:", userId);
  return await BaseApi.getRequest(`/student/user/${userId}`);
};

/**
 * Fetch all exams for a student by studentId
 * @param studentId - The student's unique ID
 * @returns AxiosResponse<{ success: boolean; exams: IExam[] }>
 */
export const getAllExamsForStudent = async (
  studentId: string
): Promise<AxiosResponse<{ success: boolean; exams: IExam[] }>> => {
  return await BaseApi.getRequest(`/student/${studentId}/exams-results`);
};

// Quiz Result Endpoints for Students
import BaseApi from "../BaseApi";
import { AxiosResponse } from "axios";

export const createQuizResult = async (
  data: IquizResult
): Promise<AxiosResponse<IquizResult>> => {
  return await BaseApi.postRequest(`/quiz-results`, {
    userId: data.userId,
    quizId: data.quizId,
    score: data.score,
  });
};

export const getQuizResultById = async (
  resultId: string
): Promise<AxiosResponse<IquizResult>> => {
  return await BaseApi.getRequest(`/quiz-results/${resultId}`);
};

export const getQuizResultsByUserId = async (
  userId: string
): Promise<AxiosResponse<IquizResult[]>> => {
  return await BaseApi.getRequest(`/users/${userId}/quiz-results`);
};

export const updateQuizResult = async (
  resultId: string,
  data: Partial<IquizResult>
): Promise<AxiosResponse<IquizResult>> => {
  return await BaseApi.putRequest(`/quiz-results/${resultId}`, {
    ...(data.userId && { userId: data.userId }),
    ...(data.quizId && { quizId: data.quizId }),
    ...(typeof data.score === "number" && { score: data.score }),
  });
};

export const deleteQuizResult = async (
  resultId: string
): Promise<AxiosResponse<IquizResult>> => {
  return await BaseApi.deleteRequest(`/quiz-results/${resultId}`);
};
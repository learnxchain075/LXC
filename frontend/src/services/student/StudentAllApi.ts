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
  payload: ISubmitHomeworkRequest
): Promise<AxiosResponse<ISubmitHomeworkResponse>> => {
  return await BaseApi.postRequest(
    `/student/${payload.studentId}/submit-homework`,
    payload
  );
};

// 🔹 Submit Assignment API
export const submitAssignment = async (
  payload: ISubmitAssignmentRequest
): Promise<AxiosResponse<ISubmitAssignmentResponse>> => {
  return await BaseApi.postRequest(
    `/student/${payload.studentId}/submit-assignment`,
    payload
  );
};


export const getstudentprofiledetails = async (
  id: any
): Promise<AxiosResponse<any>> => {
  return await BaseApi.getRequest(
    `/student/user/${id}`,
    
  );
};
/**
 * Parent interface matching backend schema
 */
export interface IParent {
  id: string;
  userId: string;
  students: Student[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Parent user details interface
 */
export interface IParentUserDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePic?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  bloodType?: string;
  sex: UserSex;
  reputation: number;
  coins: number;
  redeemedBalance: number;
  role: 'parent';
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User sex enum
 */
export enum UserSex {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHERS = 'OTHERS'
}

/**
 * Create parent input interface
 */
export interface ICreateParent {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  bloodType?: string;
  sex: UserSex;
  studentIds: string[];
}

/**
 * Update parent input interface
 */
export type IUpdateParent = Partial<Omit<IParentUserDetails, 'id' | 'role' | 'createdAt' | 'updatedAt'>>

/**
 * Parent student interface
 */
export interface IParentStudent {
  id: string;
  academicYear: string;
  admissionNo: string;
  name: string;
  class: string;
  section: string;
  rollNo: string;
  attendance: {
    present: number;
    total: number;
    percentage: number;
  };
  fees: {
    paid: number;
    pending: number;
    total: number;
  };
}

// Dashboard specific types
export interface StudentInfo {
  name: string;
  class: string;
  rollNo: string;
  profilePic: string;
  email: string;
  phone: string;
  admissionDate: string;
  schoolName: string;
}

export interface AttendanceData {
  percentage: number;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  recentRecords: any[];
}

export interface AcademicPerformance {
  averages: Array<{
    subject?: string;
    average?: number;
    score?: number;
    grade?: string;
    gradePoint?: number | null;
    recentScores?: Array<{
      type: string;
      title: string;
      score: number;
      date: string;
    }>;
  }>;
}

export interface FeeData {
  pendingFees: Array<{
    feeCategory: string;
    amount: number;
    dueDate?: string;
  }>;
  totalPending: number;
  totalPaid: number;
  paymentHistory: Array<{
    feeCategory: string;
    amount: number;
    date: string;
    method: string;
    receiptId: string;
  }>;
}

export interface EventData {
  events: any[];
  announcements: any[];
  notices: Array<{
    id: string;
    title: string;
    message: string;
    publishDate: string;
    attachment?: string;
    createdAt: string;
    creator: {
      id: string;
      name: string;
      role: string;
    };
  }>;
}

export interface TimetableEntry {
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacher: string;
}

export interface Student {
  studentId: string;
  studentInfo: StudentInfo;
  attendance: AttendanceData;
  academicPerformance: AcademicPerformance;
  fees: FeeData;
  events: EventData;
  assignments: any[];
  communication: any[];
  timetable: TimetableEntry[];
}

export interface ParentDashboardData {
  parentId: string;
  parentName: string;
  students: Student[];
}

export interface ParentDashboardResponse {
  data: ParentDashboardData;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request: any;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request: any;
}

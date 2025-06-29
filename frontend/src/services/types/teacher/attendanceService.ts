/**
 * Attendance interface matching backend schema
 */
export interface IAttendance {
  id: string;
  date: Date;
  present: boolean;
  status: AttendanceStatus;
  studentId: string;
  lessonId: string;
}

/**
 * Attendance status enum
 */
export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED'
}

/**
 * Create attendance input interface
 */
export interface ICreateAttendance {
  date: Date;
  present: boolean;
  status: AttendanceStatus;
  studentId: string;
  lessonId: string;
}

/**
 * Update attendance input interface
 */
export type IUpdateAttendance = Partial<Omit<IAttendance, 'id'>>

/**
 * Bulk attendance record interface
 */
export interface IAttendanceRecord {
  studentId: string;
  present: boolean;
  status: AttendanceStatus;
}

/**
 * Bulk attendance payload interface
 */
export interface IAttendancePayload {
  lessonId: string;
  date: Date;
  records: IAttendanceRecord[];
}

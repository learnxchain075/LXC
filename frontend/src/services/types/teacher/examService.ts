/**
 * Exam interface matching backend schema
 */
export interface IExam {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  scheduleDate?: Date | null;
  classId?: string;
  passMark?: number;
  totalMarks?: number;
  duration?: number;
  roomNumber?: number;
  createdAt?: Date;
  updatedAt?: Date;
  subjectName?: string;
  // Legacy field for backward compatibility
  subjectId?: string;
  date?: Date;
}

/**
 * Create exam input interface
 */
export interface ICreateExam {
  title: string;
  startTime: Date;
  endTime: Date;
  classId: string;
  passMark?: number;
  totalMarks?: number;
  duration?: number;
  roomNumber?: number;
}

/**
 * Update exam input interface
 */
export type IUpdateExam = Partial<Omit<IExam, 'id' | 'createdAt' | 'updatedAt'>>

/**
 * Exam result interface
 */
export interface IExamResult {
  id: string;
  score: number;
  examId: string;
  studentId: string;
  createdAt: Date;
}
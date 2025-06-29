/**
 * Homework status enum
 */
export enum HomeworkStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE'
}

/**
 * Homework interface matching backend schema
 */
export interface IHomework {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  attachment?: string;
  status: HomeworkStatus;
  classId: string;
  subjectId: string;
  sectionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create homework input interface
 */
export interface ICreateHomework {
  title: string;
  description: string;
  dueDate: Date;
  attachment?: File;
  classId: string;
  subjectId: string;
  sectionId?: string;
}

/**
 * Update homework input interface
 */
export type IUpdateHomework = Partial<Omit<IHomework, 'id' | 'createdAt' | 'updatedAt'>>

/**
 * Homework submission interface
 */
export interface IHomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  submissionDate: Date;
  attachment?: string;
  status: HomeworkStatus;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create homework submission input interface
 */
export interface ICreateHomeworkSubmission {
  homeworkId: string;
  studentId: string;
  attachment?: File;
  remarks?: string;
}
  
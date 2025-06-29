/**
 * Feedback status enum matching backend
 */
export enum FeedbackStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

/**
 * School interface matching backend schema
 */
export interface ISchool {
  id: string;
  schoolName: string;
  schoolLogo?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Feedback interface matching backend schema
 */
export interface IFeedback {
  id: string;
  title: string;
  description: string;
  schoolId: string;
  status: FeedbackStatus;
  dateAdded: Date;
  createdAt: Date;
  updatedAt: Date;
  school?: ISchool;
}

/**
 * Create feedback input interface
 */
export interface ICreateFeedback {
  title: string;
  description: string;
  schoolId: string;
}

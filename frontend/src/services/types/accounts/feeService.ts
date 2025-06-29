/**
 * Fee payment status enum
 */
export enum FeeStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE'
}

/**
 * Fee category enum
 */
export enum FeeCategory {
  TUITION = 'TUITION',
  ADMISSION = 'ADMISSION',
  EXAM = 'EXAM',
  LIBRARY = 'LIBRARY',
  TRANSPORT = 'TRANSPORT',
  HOSTEL = 'HOSTEL',
  OTHER = 'OTHER'
}

/**
 * Base fee interface with required fields for creation
 */
export interface IFeeBase {
  studentId: string;
  schoolId: string;
  amount: number;
  category: FeeCategory;
  dueDate: Date;
}

/**
 * Complete fee interface including optional and system-generated fields
 */
export interface IFee extends IFeeBase {
  id?: string;
  paymentDate?: Date;
  discount?: number;
  scholarship?: number;
  status: FeeStatus;
  amountPaid?: number;
  createdAt?: Date;
  updatedAt?: Date;
  description?: string;
  remarks?: string;
}

/**
 * Fee creation input interface
 */
export interface ICreateFeeInput extends IFeeBase {
  discount?: number;
  scholarship?: number;
  description?: string;
}

/**
 * Fee update input interface
 */
export type IUpdateFeeInput = Partial<Omit<IFee, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Fee report interface
 */
export interface IFeeReport {
  totalAmount: number;
  collectedAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  recentPayments: Array<{
    id: string;
    studentId: string;
    amount: number;
    paymentDate: Date;
    status: FeeStatus;
  }>;
  statistics: {
    paidCount: number;
    partialCount: number;
    pendingCount: number;
    overdueCount: number;
  };
}
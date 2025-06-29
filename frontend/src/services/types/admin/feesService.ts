/**
 * Fee status enum
 */
export enum FeeStatus {
  UNPAID = 'UNPAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE'
}

/**
 * Fee category enum
 */
export enum FeeCategory {
  TUITION = 'TUITION',
  TRANSPORT = 'TRANSPORT',
  HOSTEL = 'HOSTEL',
  LIBRARY = 'LIBRARY',
  EXAM = 'EXAM',
  ADMISSION = 'ADMISSION',
  MISCELLANEOUS = 'MISCELLANEOUS'
}

/**
 * Fee interface matching backend schema
 */
export interface IFee {
  id: string;
  studentId: string;
  schoolId: string;
  amount: number;
  amountPaid: number;
  dueDate: Date;
  category: FeeCategory;
  finePerDay: number;
  status: FeeStatus;
  discount: number;
  scholarship: number;
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  payments: IPayment[];
  student: {
    id: string;
    rollNo: string;
    class: {
      id: string;
      name: string;
      capacity: number;
      schoolId: string;
      section: string;
    };
    user: {
      name: string;
    };
  };
}

/**
 * Payment interface
 */
export interface IPayment {
  id: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  transactionId: string;
  status: PaymentStatus;
  feeId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payment method enum
 */
export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  UPI = 'UPI',
  NET_BANKING = 'NET_BANKING',
  CHEQUE = 'CHEQUE'
}

/**
 * Payment status enum
 */
export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

/**
 * Create fee input interface
 */
export interface ICreateFee {
  studentId: string;
  amount: number;
  dueDate: Date;
  category: FeeCategory;
  finePerDay?: number;
  discount?: number;
  scholarship?: number;
  schoolId: string;
}

/**
 * Update fee input interface
 */
export type IUpdateFee = Partial<Omit<IFee, 'id' | 'createdAt' | 'updatedAt' | 'payments' | 'student'>>

/**
 * Create payment input interface
 */
export interface ICreatePayment {
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  feeId: string;
}

/**
 * Fee report interface
 */
export interface IFeeReport {
  totalFees: number;
  collectedFees: number;
  pendingFees: number;
  overdueAmount: number;
  categoryWiseStats: {
    category: FeeCategory;
    total: number;
    collected: number;
    pending: number;
  }[];
  classWiseStats: {
    classId: string;
    className: string;
    total: number;
    collected: number;
    pending: number;
  }[];
}

export interface IFeesForm {
    studentId: string;
    amount: number;
    paymentDate: Date;
    // dueDate:Date;
    // finePerDays: number;
    category: string;
    schoolId:string;
    status: string;
    scholarship:number;
    discount:number;
   
}

// types/IFeesForm.ts

export interface IFeesresponse {
    id: string;
    studentId: string;
    schoolId: string;
    amount: number;
    amountPaid: number;
    dueDate: string; // or Date if you're converting
    category: string;
    finePerDay: number;
    status: string;
    discount: number;
    scholarship: number;
    paymentDate: string; // or Date
    createdAt: string;
    updatedAt: string;
    Payment: any[]; // Define this properly later if needed
  
    student: {
      id: string;
      rollNo: string;
      class: {
        id: string;
        name: string;
        capacity: number;
        schoolId: string;
        section: string;
      };
      user: {
        name: string;
      };
    };
  }
  
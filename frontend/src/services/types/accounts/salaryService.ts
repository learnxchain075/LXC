/**
 * Salary payment status enum
 */
export enum SalaryStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

/**
 * Salary payment method enum
 */
export enum SalaryPaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHEQUE = 'CHEQUE',
  UPI = 'UPI'
}

/**
 * Salary period type enum
 */
export enum SalaryPeriodType {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUAL = 'ANNUAL',
  ADHOC = 'ADHOC'
}

/**
 * Base salary interface with required fields
 */
export interface ISalaryBase {
  teacherId: string;
  schoolId: string;
  amount: number;
  period: {
    type: SalaryPeriodType;
    startDate: Date;
    endDate: Date;
  };
}

/**
 * Complete salary interface including optional and system-generated fields
 */
export interface ISalary extends ISalaryBase {
  id?: string;
  paymentDate: Date;
  method: SalaryPaymentMethod;
  status: SalaryStatus;
  createdAt?: Date;
  updatedAt?: Date;
  transactionId?: string;
  remarks?: string;
  deductions?: {
    tax?: number;
    insurance?: number;
    providentFund?: number;
    other?: number;
    remarks?: string;
  };
  allowances?: {
    houseRent?: number;
    medical?: number;
    transport?: number;
    other?: number;
    remarks?: string;
  };
}

/**
 * Salary creation input interface
 */
export interface ICreateSalaryInput extends ISalaryBase {
  method: SalaryPaymentMethod;
  deductions?: ISalary['deductions'];
  allowances?: ISalary['allowances'];
  remarks?: string;
}

/**
 * Salary update input interface
 */
export type IUpdateSalaryInput = Partial<Omit<ISalary, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Salary report interface
 */
export interface ISalaryReport {
  totalPaid: number;
  pendingPayments: number;
  currentMonthPayments: number;
  statistics: {
    totalTeachers: number;
    paidTeachers: number;
    pendingTeachers: number;
  };
  methodWiseStats: Record<SalaryPaymentMethod, {
    count: number;
    amount: number;
  }>;
  recentPayments: Array<{
    id: string;
    teacherId: string;
    amount: number;
    paymentDate: Date;
    status: SalaryStatus;
    method: SalaryPaymentMethod;
  }>;
}
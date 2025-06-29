import { ISchoolExpenseCategory } from "./schoolExpenseCategoryService";

/**
 * School expense payment method enum
 */
export enum SchoolExpensePaymentMethod {
  CASH = 'CASH',
  ONLINE = 'ONLINE',
  CHEQUE = 'CHEQUE',
  BANK_TRANSFER = 'BANK_TRANSFER',
  UPI = 'UPI'
}

/**
 * Base school expense interface with required fields
 */
export interface ISchoolExpenseBase {
  categoryId: string;
  date: Date;
  amount: number;
  paymentMethod: SchoolExpensePaymentMethod;
  schoolId: string;
}

/**
 * Complete school expense interface including optional and system-generated fields
 */
export interface ISchoolExpense extends Omit<ISchoolExpenseBase, 'schoolId'> {
  id: string;
  description?: string;
  invoiceNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  category?: ISchoolExpenseCategory;
  attachments?: string[];
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: Date;
  remarks?: string;
}

/**
 * School expense creation input interface
 */
export interface ICreateSchoolExpense extends ISchoolExpenseBase {
  description?: string;
  invoiceNumber?: string;
  attachments?: string[];
  remarks?: string;
}

/**
 * School expense update input interface
 */
export type IUpdateSchoolExpense = Partial<Omit<ISchoolExpense, 'id' | 'createdAt' | 'updatedAt' | 'category'>>;

/**
 * School expense report interface
 */
export interface ISchoolExpenseReport {
  totalExpenses: number;
  currentMonthExpenses: number;
  previousMonthExpenses: number;
  categoryWiseExpenses: Array<{
    categoryId: string;
    categoryName: string;
    amount: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    amount: number;
  }>;
  recentExpenses: Array<{
    id: string;
    categoryName: string;
    amount: number;
    date: Date;
    paymentMethod: SchoolExpensePaymentMethod;
  }>;
}

// router.post('/school/expense', createSchoolExpense);
// router.get('/school/expense/:schoolId', getSchoolExpenses);
// router.put('/school/expense/:id', updateSchoolExpense);
// router.delete('/school/expense/:id', deleteSchoolExpense);

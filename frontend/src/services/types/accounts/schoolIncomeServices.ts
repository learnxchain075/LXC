/**
 * School income payment method enum
 */
export enum SchoolIncomePaymentMethod {
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
  BANK_TRANSFER = 'BANK_TRANSFER',
  UPI = 'UPI',
  ONLINE = 'ONLINE',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD'
}

/**
 * School income source enum
 */
export enum SchoolIncomeSource {
  FEES = 'FEES',
  DONATIONS = 'DONATIONS',
  GRANTS = 'GRANTS',
  EVENTS = 'EVENTS',
  RENTALS = 'RENTALS',
  INVESTMENTS = 'INVESTMENTS',
  OTHER = 'OTHER'
}

/**
 * Base school income interface with required fields
 */
export interface ISchoolIncomeBase {
  schoolId: string;
  source: SchoolIncomeSource;
  date: Date;
  amount: number;
  paymentMethod: SchoolIncomePaymentMethod;
}

/**
 * Complete school income interface including optional and system-generated fields
 */
export interface ISchoolIncome extends Omit<ISchoolIncomeBase, 'schoolId'> {
  id: string;
  description?: string;
  invoiceNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  attachments?: string[];
  status?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedBy?: string;
  verifiedAt?: Date;
  remarks?: string;
  metadata?: Record<string, any>;
}

/**
 * School income creation input interface
 */
export interface ICreateSchoolIncome extends ISchoolIncomeBase {
  description?: string;
  invoiceNumber?: string;
  attachments?: string[];
  remarks?: string;
  metadata?: Record<string, any>;
}

/**
 * School income update input interface
 */
export type IUpdateSchoolIncome = Partial<Omit<ISchoolIncome, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * School income report interface
 */
export interface ISchoolIncomeReport {
  totalIncome: number;
  currentMonthIncome: number;
  previousMonthIncome: number;
  sourceWiseIncome: Array<{
    source: SchoolIncomeSource;
    amount: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    amount: number;
  }>;
  recentTransactions: Array<{
    id: string;
    source: SchoolIncomeSource;
    amount: number;
    date: Date;
    paymentMethod: SchoolIncomePaymentMethod;
  }>;
  paymentMethodStats: Record<SchoolIncomePaymentMethod, {
    count: number;
    amount: number;
  }>;
}

// router.post('/school/income', createSchoolIncome);
// router.get('/school/incomes', getAllSchoolIncome);
// router.get('/school/income/:id', getSchoolIncomeById);
// router.put('/school/income/:id', updateSchoolIncome);
// router.delete('/school/income/:id', deleteSchoolIncome);

export interface IPayroll {
  id: string;
  userId: string;
  schoolId: string;
  periodStart: string;
  periodEnd: string;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  paymentDate?: string;
  status: string;
}

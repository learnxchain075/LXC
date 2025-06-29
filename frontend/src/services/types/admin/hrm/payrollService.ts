export interface IPayrollForm {
    userId: string;
    schoolId: string;
    periodStart: string;
    periodEnd: string;
    grossSalary: number;
    deductions?: number;
    status: string;
}
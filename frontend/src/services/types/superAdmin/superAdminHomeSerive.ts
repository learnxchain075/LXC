// types/superAdminDashboard.ts

export interface MonthlyData {
  month: string;
  count?: number;
  revenue?: number;
}

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  monthlyNewUsers: MonthlyData[];
}

export interface SchoolStatistics {
  totalSchools: number;
  activeSchools: number;
  monthlyNewSchools: MonthlyData[];
}

export interface PlanStatistics {
  totalPlans: number;
  activePlans: number;
  inactivePlans: number;
}

export interface EmployeeStatistics {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
}

export interface FinancialMetrics {
  totalRevenue: number;
  monthlyRevenue: MonthlyData[];
  outstandingPayments: number;
}

export interface SystemHealth {
  errorRate: number;
  avgResponseTime: number;
}

export interface SupportAndFeedback {
  openTickets: number;
  avgResolutionTime: number;
  totalFeedbacks: number;
}

export interface SuperAdminDashboardData {
  userStatistics: UserStatistics;
  schoolStatistics: SchoolStatistics;
  planStatistics: PlanStatistics;
  employeeStatistics: EmployeeStatistics;
  financialMetrics: FinancialMetrics;
  systemHealth: SystemHealth;
  supportAndFeedback: SupportAndFeedback;
}

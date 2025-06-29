// Admin Dashboard API response interface
export interface IAdminDashboardData {
  keyMetrics: {
    totalStudents: {
      total: number;
      active: number;
      inactive: number;
      percentageChange: string;
    };
    totalTeachers: {
      total: number;
      active: number;
      inactive: number;
      percentageChange: string;
    };
    totalStaff: {
      total: number;
      active: number;
      inactive: number;
      percentageChange: string;
    };
    totalSubjects: {
      total: number;
      active: number;
      inactive: number;
      percentageChange: string;
    };
  };
  schedules: {
    currentMonth: string;
    highlightedDate: number;
    upcomingEvents: Array<{
      title: string;
      start: string;
    }>;
  };
  attendance: {
    overallPercentage: number;
    issues: {
      students: {
        emergency: number;
      };
      teachers: {
        absent: number;
      };
      staff: {
        late: number;
      };
    };
    dateFilter: string;
  };
  classRoutines: {
    routines: Array<{
      month: string;
      progress: number;
    }>;
  };
  quickLinks: Array<{
    name: string;
    icon: string;
    color: string;
  }>;
  earnings: {
    total: number;
    graphData: Array<{
      month: string;
      value: number;
    }>;
  };
  expenses: {
    total: number;
    graphData: Array<{
      month: string;
      value: number;
    }>;
  };
  feesCollected: {
    total: number;
    fineCollected: number;
    studentNotPaid: number;
    totalOutstanding: number;
    percentageChange: {
      total: number;
      fine: number;
      notPaid: number;
      outstanding: number;
    };
  };
  notices: Array<{
    title: string;
    date: string;
    daysSince: number;
    icon: string;
    color: string;
  }>;
  topSubjects: {
    class: string;
    subjects: Array<{
      name: string;
      performance: number;
    }>;
  };
  studentActivities: {
    filter: string;
    activities: Array<{
      title: string;
      description: string;
      image: string;
    }>;
  };
  todos: {
    filter: string;
    tasks: Array<{
      title: string;
      dueDate: string;
      status: string;
    }>;
  };
  feesCollectionChart: {
    filter: string;
    data: Array<{
      quarter: string;
      totalFee: number;
      collectedFee: number;
    }>;
  };
  leaveRequests: {
    filter: string;
    requests: Array<{
      id: string;
      user: {
        name: string;
        role: string;
        avatar: string;
      };
      type: string;
      from: string;
      to: string;
      reason: string;
      status: string;
    }>;
  };
  upcomingEvents: Array<{
    time: string;
    title: string;
    date: string;
    iconColor: string;
    status: string;
  }>;
  bestPerformer: {
    name: string;
    role: string;
    image: string;
    carouselPosition: number;
    totalItems: number;
  };
  starStudents: {
    name: string;
    class: string;
    image: string;
    averageScore: number;
    carouselPosition: number;
    totalItems: number;
  };
  performanceMetrics: {
    month: string;
    data: {
      top: number;
      average: number;
      belowAverage: number;
    };
  };
} 
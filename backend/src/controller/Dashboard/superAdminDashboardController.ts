import { Request, Response } from 'express';
import { prisma } from '../../db/prisma';


export const getSuperAdminDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    // --- User Statistics ---
    const totalUsers = await prisma.user.count();

    const activeUsers = await prisma.user.count({
      where: {
        lastOnline: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
    });

    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        },
      },
      select: {
        createdAt: true,
      },
    });

    const monthlyNewUsers: Record<string, number> = users.reduce((acc, user) => {
      const month = user.createdAt.toISOString().slice(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const monthlyNewUsersArray = Object.entries(monthlyNewUsers).map(([month, count]) => ({ month, count }));

    // --- School Statistics ---
    const totalSchools = await prisma.school.count();

    const activeSchools = await prisma.subscription.count({
      where: {
        isActive: true,
      },
    });

    const schools = await prisma.school.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
        },
      },
      select: {
        createdAt: true,
      },
    });

    const monthlyNewSchools: Record<string, number> = schools.reduce((acc, school) => {
      const month = school.createdAt.toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const monthlyNewSchoolsArray = Object.entries(monthlyNewSchools).map(([month, count]) => ({ month, count }));

    // --- Financial Metrics ---
    const totalRevenue = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: 'Paid',
      },
    });

    const paidPayments = await prisma.payment.findMany({
      where: {
        status: 'Paid',
        paymentDate: {
          gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
          not: null,
        },
      },
      select: {
        paymentDate: true,
        amount: true,
      },
    });

    const monthlyRevenue: Record<string, number> = paidPayments.reduce((acc, payment) => {
      const month = payment.paymentDate!.toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + payment.amount;
      return acc;
    }, {} as Record<string, number>);

    const monthlyRevenueArray = Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue }));

    const outstandingPayments = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: {
          in: ['Pending', 'Overdue'],
        },
      },
    });

    // --- System Health ---
    const totalRequests = await prisma.log.count();

    const errorRequests = await prisma.log.count({
      where: {
        status: {
          gte: 400,
        },
      },
    });

    const errorRate = totalRequests > 0 ? (errorRequests / totalRequests) * 100 : 0;

    const avgResponseTime = await prisma.log.aggregate({
      _avg: {
        duration: true,
      },
    });

    // --- Support and Feedback ---
    const openTickets = await prisma.ticket.count({
      where: {
        status: 'Open',
      },
    });

    const closedTickets = await prisma.ticket.findMany({
      where: {
        status: 'Closed',
      },
      select: {
        createdAt: true,
        updatedAt: true,
      },
    });

    const resolutionTimes = closedTickets.map(ticket =>
      (ticket.updatedAt.getTime() - ticket.createdAt.getTime()) / (1000 * 60 * 60)
    );

    const avgResolutionTime =
      resolutionTimes.length > 0
        ? resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length
        : 0;

    const totalFeedbacks = await prisma.feedback.count();

    // --- Final Response ---
    const dashboardData = {
      userStatistics: {
        totalUsers,
        activeUsers,
        monthlyNewUsers: monthlyNewUsersArray,
      },
      schoolStatistics: {
        totalSchools,
        activeSchools,
        monthlyNewSchools: monthlyNewSchoolsArray,
      },
      financialMetrics: {
        totalRevenue: totalRevenue._sum.amount || 0,
        monthlyRevenue: monthlyRevenueArray,
        outstandingPayments: outstandingPayments._sum.amount || 0,
      },
      systemHealth: {
        errorRate,
        avgResponseTime: avgResponseTime._avg.duration || 0,
      },
      supportAndFeedback: {
        openTickets,
        avgResolutionTime,
        totalFeedbacks,
      },
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error('Error in getSuperAdminDashboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

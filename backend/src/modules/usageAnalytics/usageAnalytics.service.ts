import { prisma } from "../../db/prisma";
import { subDays } from "date-fns";

export interface UsageAnalyticsQuery {
  role?: string;
  module?: string;
  device?: string;
  range?: string; // today, 7d, 30d
  schoolId?: string;
}

export async function logUsage(data: {
  userId: string;
  role: string;
  schoolId: string;
  module: string;
  deviceType: string;
}) {
  await prisma.usageLog.create({ data });
}

export async function getUsageAnalytics(query: UsageAnalyticsQuery) {
  const where: any = {};
  if (query.role) where.role = query.role;
  if (query.module) where.module = query.module;
  if (query.device) where.deviceType = query.device;
  if (query.schoolId) where.schoolId = query.schoolId;

  if (query.range) {
    const now = new Date();
    if (query.range === "today") {
      where.timestamp = { gte: subDays(now, 1) };
    } else if (query.range === "7") {
      where.timestamp = { gte: subDays(now, 7) };
    } else if (query.range === "30") {
      where.timestamp = { gte: subDays(now, 30) };
    }
  }

  const logs = await prisma.usageLog.findMany({ where });

  const usageByDay: Record<string, number> = {};
  const usageByModule: Record<string, number> = {};
  const usageByRole: Record<string, number> = {};

  logs.forEach((log) => {
    const day = log.timestamp.toISOString().split("T")[0];
    usageByDay[day] = (usageByDay[day] || 0) + 1;
    usageByModule[log.module] = (usageByModule[log.module] || 0) + 1;
    usageByRole[log.role] = (usageByRole[log.role] || 0) + 1;
  });

  const total = logs.length;
  const result = {
    total,
    usageByDay,
    usageByModule,
    usageByRole,
  };
  return result;
}

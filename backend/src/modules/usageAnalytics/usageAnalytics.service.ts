import { prisma } from "../../db/prisma";
import { subDays } from "date-fns";

export interface UsageAnalyticsQuery {
  role?: string;
  module?: string;
  device?: string;
  range?: string; // today, 7d, 30d
  schoolId?: string;
  latlng?: string;
}

import type { Role } from "@prisma/client";

export function listRoles() {
  return ["admin", "teacher", "student", "parent", "transport", "account", "employee"];
}

export async function getSchoolsWithModules() {
  const schools = await prisma.school.findMany({
    include: {
      user: {
        select: {
          userPermissions: {
            where: { status: 1 },
            select: { moduleName: true },
          },
        },
      },
    },
  });

  return schools.map((s) => ({
    id: s.id,
    schoolName: s.schoolName,
    modules: s.user?.userPermissions.map((p) => p.moduleName) || [],
  }));
}

export async function logUsage(data: {
  userId: string;
  role: string;
  schoolId: string;
  module: string;
  deviceType: string;
  duration?: number;
  lat?: number;
  lng?: number;
}) {
  await prisma.usageLog.create({
    data: {
      userId: data.userId,
      role: data.role as Role,
      schoolId: data.schoolId,
      module: data.module,
      deviceType: data.deviceType,
      duration: data.duration,
      lat: data.lat,
      lng: data.lng,
    },
  });
}

export async function getUsageAnalytics(query: UsageAnalyticsQuery) {
  const where: any = {};
  if (query.role) where.role = query.role;
  if (query.module) where.module = query.module;
  if (query.device) where.deviceType = query.device;
  if (query.schoolId) where.schoolId = query.schoolId;
  if (query.latlng) {
    const parts = query.latlng.split(",").map((p) => parseFloat(p));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      where.lat = parts[0];
      where.lng = parts[1];
    }
  }

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
  const durationByModule: Record<string, number> = {};
  const durationByRole: Record<string, number> = {};
  const usageByLocation: Record<string, number> = {};

  logs.forEach((log) => {
    const day = log.timestamp.toISOString().split("T")[0];
    usageByDay[day] = (usageByDay[day] || 0) + 1;
    usageByModule[log.module] = (usageByModule[log.module] || 0) + 1;
    usageByRole[log.role] = (usageByRole[log.role] || 0) + 1;
    if (log.duration != null) {
      durationByModule[log.module] = (durationByModule[log.module] || 0) + log.duration;
      durationByRole[log.role] = (durationByRole[log.role] || 0) + log.duration;
    }
    if (log.lat != null && log.lng != null) {
      const key = `${log.lat},${log.lng}`;
      usageByLocation[key] = (usageByLocation[key] || 0) + 1;
    }
  });

  const total = logs.length;
  const result = {
    total,
    usageByDay,
    usageByModule,
    usageByRole,
    durationByModule,
    durationByRole,
    usageByLocation,
  };
  return result;
}

import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/prisma";
import { fetchGeoLocation } from "../config/geoLookup";
import { io } from "../index";
import * as UAParser from "ua-parser-js";

const MAX_BODY_LENGTH = 1000;

const trim = (input: any): string => {
  const str = typeof input === "string" ? input : JSON.stringify(input);
  return str.length > MAX_BODY_LENGTH ? str.slice(0, MAX_BODY_LENGTH) + "..." : str;
};

const filterSensitive = (body: any) => {
  const filtered = { ...body };
  if ("password" in filtered) filtered.password = "[FILTERED]";
  if ("token" in filtered) filtered.token = "[FILTERED]";
  return filtered;
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const oldSend = res.send;
  let responseBody: any = "";

  res.send = function (body: any) {
    responseBody = body;
    return oldSend.call(this, body);
  };

  res.on("finish", () => {
    setImmediate(async () => {
      const duration = Date.now() - start;

      const ipRaw = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
      const ip = typeof ipRaw === "string" ? ipRaw.split(",")[0].trim() : "";

      const { city, region } = await fetchGeoLocation(ip);
      const parser = new UAParser.UAParser(req.headers["user-agent"]);
      const deviceInfo = parser.getResult();
      const userAgent = req.headers["user-agent"] || "";

      const sanitizedBody = filterSensitive(req.body);
      const requestSize = JSON.stringify(req.body || {}).length;
      const responseSize =
        typeof responseBody === "object" ? JSON.stringify(responseBody).length : String(responseBody).length;

     await prisma.log.create({
  data: {
    method: req.method,
    path: req.originalUrl,
    status: res.statusCode,
    duration,
    userId: req.headers["x-user-id"] as string,
    ip,
    city,
    region,
    requestHeaders: trim(req.headers),
    requestQuery: trim(req.query),
    requestBody: trim(JSON.stringify(sanitizedBody)), // ✅ FIXED
    responseBody:
      typeof responseBody === "object" ? trim(JSON.stringify(responseBody)) : trim(String(responseBody)),
    requestSize,
    responseSize,
    userAgent,
    deviceInfo: JSON.stringify(deviceInfo),
    errorStack: res.statusCode >= 400 ? res.locals.errorStack || null : null,
    createdAt: new Date(),
  },
});


      // ✅ Cleanup: Delete logs older than 5 minutes
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      await prisma.log.deleteMany({
        where: {
          createdAt: {
            lt: fiveMinutesAgo,
          },
        },
      });

      io.emit("new-log", { method: req.method, path: req.originalUrl, status: res.statusCode });
    });
  });

  next();
};

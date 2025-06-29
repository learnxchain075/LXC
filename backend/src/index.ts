import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import Logger from "./utils/logger";
import morganMiddleware from "./middlewares/morganMiddleware";
import { errorHandler } from "./middlewares/errorMiddleware";
import { authenticateToken, getJwtToken, injectUserByToken, validateRefreshToken } from "./utils/jwt_utils";
import { createServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import apiRouter from "../src/routes/app";
import { sendErrorMessageToSupport } from "./utils/mailer";
import { customValidationResult, getErrorMessage, getErrorStack } from "./utils/common_utils";
import { body } from "express-validator";
import UserModel from "./models/UserModel.model";
import { CONFIG } from "./config";

import { WebSocketServer } from "ws";
import { setupWebSocket } from "./websocket";
import { requestLogger } from "./middlewares/requestLogger";
// import { rateLimiter } from "./middlewares/rateLimiter";

import "./cron-jobs/subscriptionManagement";
import { checkSubscription } from "./middlewares/subscriptionCheck";

import { prisma } from "./db/prisma";
import escapeHtml from "escape-html";
import publicRouter from "./routes/publicRoutes";
import forgotRoutes from "./routes/forgot-password/forgotRoutes";

dotenv.config();

const app = express();

// Middleware setup
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "auth-token"],
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression({ threshold: 0 }));
app.use(morganMiddleware);
// app.use(rateLimiter);

app.use(requestLogger);
app.use("/auth",forgotRoutes);
app.get("/", async (req, res) => {
  res.send("Backend is live ");
});

app.use("/api/v1", publicRouter);
app.use(injectUserByToken);
app.post(
  "/api/v1/auth/refresh-token",
  [body("token", "Refresh Token is required").trim().notEmpty()],
  async (req: Request, res: Response): Promise<any> => {
    const errors = customValidationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const token = req.body.token as string;
      const refreshTokenData = await validateRefreshToken(token);
      const usersModelObj = new UserModel();
      const userObj = await usersModelObj.getByParams({
        id: refreshTokenData.user!.userId,
        isActive: 1,
      });

      if (!userObj) {
        throw new Error("Invalid user account");
      }

      const accessToken = await getJwtToken(
        { userId: userObj.id, email: userObj.email, role: userObj.role },
        CONFIG.JWT_LOGIN_TOKEN_EXPIRY_TIME,
        false
      );

      const refreshToken = await getJwtToken(
        { userId: userObj.id, email: userObj.email, role: userObj.role },
        CONFIG.JWT_REFRESH_TOKEN_EXPIRY_TIME,
        true
      );

      res.status(200).send({ success: "ok", accessToken, refreshToken });
    } catch (error) {
      res.status(401).send({ success: "error", errors: getErrorMessage(error) });
    }
  }
);

// app.use("/api/v1", authenticateToken, apiRouter);
app.use("/api/v1", authenticateToken, checkSubscription, apiRouter);

app.use(errorHandler);

process.on("uncaughtException", function (err) {
  Logger.error(`Error occurred: ${getErrorStack(err)}`);
  sendErrorMessageToSupport(getErrorStack(err));
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.locals.errorStack = err.stack;
  res.status(500).json({ error: err.message });
});

const httpServer = createServer(app);

const wss = new WebSocketServer({ server: httpServer });
setupWebSocket(wss);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket: Socket) => {
  console.log("Socket.IO client connected");
});
export { io };

// Start Server
const PORT = process.env.PORT || 5000;
console.log("Service Started", PORT);
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

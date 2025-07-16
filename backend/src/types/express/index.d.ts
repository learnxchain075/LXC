import { SocketIOServer } from "socket.io";

declare module "express-serve-static-core" {
  interface Request {
    io?: SocketIOServer;
  }
}

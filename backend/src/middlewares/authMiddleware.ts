import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { User } from "@prisma/client";
import { prisma } from "../db/prisma"; // adjust path to your Prisma instance

dotenv.config();

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in environment variables.");
      return res.status(500).json({ message: "Server configuration error." });
    }

    // ✅ Decode the JWT and extract userId
    const decoded = jwt.verify(token, jwtSecret) as { userId?: string };

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Invalid token payload." });
    }

    // ✅ Fetch the full user from the database
    const user: User | null = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // ✅ Attach user to the request object
    req.user = user;

    next();
  } catch (error: any) {
    console.error("Authentication error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired." });
    }

    return res.status(500).json({ message: "Authentication failed." });
  }
};







// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config();

// export const authenticate = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const token = req.header("Authorization")?.replace("Bearer ", "");
//     if (!token) {
//        res.status(401).json({ message: "Access denied. No token provided." });
//        return;
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
//       id: string;
//       role: string;
//       name: string;
      
//     };

//     // req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token." });
//   }
// };

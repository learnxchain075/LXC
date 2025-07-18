import { Request, Response, NextFunction } from "express";

export const isSuperAdmin = authorize(["superadmin"]);
// Simple authorize middleware factory

export function authorize(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const userRole = req.user?.role;
    if (userRole && roles.includes(userRole)) {
      next();
      return Promise.resolve();
    }
    res.status(403).json({ message: "Forbidden" });
    return Promise.resolve();
  };
}

export const isSchoolAdmin = authorize(["admin"]);

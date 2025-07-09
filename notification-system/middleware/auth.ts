import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  role: string;
  schoolId?: string;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (roles: string[]) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user as JwtPayload;
  if (!user || !roles.includes(user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

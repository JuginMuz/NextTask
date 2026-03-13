import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../auth/jwt";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token missing" });
  }

  try {
    const payload = verifyToken(token);

    (req as any).userId = payload.userId;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
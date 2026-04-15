import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";

export const sessionsRouter = Router();

sessionsRouter.get("/", requireAuth, async (req, res) => {
  const userId = (req as any).userId;

  const sessions = await prisma.focusSession.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  res.json(sessions);
});

sessionsRouter.post("/", requireAuth, async (req, res) => {
  const userId = (req as any).userId;
  const { duration } = req.body;

  if (!duration) {
    return res.status(400).json({ error: "Duration is required" });
  }

  const session = await prisma.focusSession.create({
    data: {
      duration,
      userId,
    },
  });

  res.status(201).json(session);
});
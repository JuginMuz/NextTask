import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";

export const sessionsRouter = Router();

sessionsRouter.get("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;

    const sessions = await prisma.focusSession.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(sessions);
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

sessionsRouter.post("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { duration } = req.body;

    if (typeof duration !== "number" || Number.isNaN(duration) || duration <= 0) {
      return res.status(400).json({ error: "A valid duration is required" });
    }

    const session = await prisma.focusSession.create({
      data: {
        duration,
        userId,
      },
    });

    res.status(201).json(session);
  } catch (error) {
    console.error("Failed to create focus session:", error);
    res.status(500).json({ error: "Failed to create focus session" });
  }
});
import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";

export const tasksRouter = Router();

tasksRouter.get("/", requireAuth, async (req, res) => {
  const userId = (req as any).userId;

  const tasks = await prisma.task.findMany({
    where: { userId },
  });

  res.json(tasks);
});

tasksRouter.post("/", requireAuth, async (req, res) => {
  const userId = (req as any).userId;
  const { title } = req.body;

  const task = await prisma.task.create({
    data: {
      title,
      userId,
    },
  });

  res.status(201).json(task);
});
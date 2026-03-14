import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";

export const tasksRouter = Router();

tasksRouter.get("/", requireAuth, async (req, res) => {
  const userId = (req as any).userId;

  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  res.json(tasks);
});

tasksRouter.post("/", requireAuth, async (req, res) => {
  const userId = (req as any).userId;
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Task title is required" });
  }

  const task = await prisma.task.create({
    data: {
      title: title.trim(),
      userId,
    },
  });

  res.status(201).json(task);
});

tasksRouter.patch("/:id", requireAuth, async (req, res) => {
  const userId = (req as any).userId;
  const { id } = req.params;
  const { completed } = req.body as { completed?: boolean };

  const existingTask = await prisma.task.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!existingTask) {
    return res.status(404).json({ error: "Task not found" });
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      completed: Boolean(completed),
    },
  });

  res.json(updatedTask);
});

tasksRouter.delete("/:id", requireAuth, async (req, res) => {
  const userId = (req as any).userId;
  const { id } = req.params;

  const existingTask = await prisma.task.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!existingTask) {
    return res.status(404).json({ error: "Task not found" });
  }

  await prisma.task.delete({
    where: { id },
  });

  res.json({ message: "Task deleted successfully" });
});
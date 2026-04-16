import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/requireAuth";

export const tasksRouter = Router();

tasksRouter.get("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const projectId =
      typeof req.query.projectId === "string" ? req.query.projectId : undefined;

    const tasks = await prisma.task.findMany({
      where: {
        userId,
        ...(projectId ? { projectId } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(tasks);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

tasksRouter.post("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { title, projectId } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "Task title is required" });
    }

    if (projectId) {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          userId,
        },
      });

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        completed: false,
        userId,
        projectId: projectId || null,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Failed to create task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

tasksRouter.put("/:id", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { completed, title } = req.body;

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
        ...(typeof completed === "boolean" ? { completed } : {}),
        ...(typeof title === "string" ? { title: title.trim() } : {}),
      },
    });

    res.json(updatedTask);
  } catch (error) {
    console.error("Failed to update task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

tasksRouter.delete("/:id", requireAuth, async (req, res) => {
  try {
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

    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});
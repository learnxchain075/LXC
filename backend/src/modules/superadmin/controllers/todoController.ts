import { Request, Response, NextFunction } from "express";

import { prisma } from "../../../db/prisma";
import { handlePrismaError } from "../../../utils/prismaErrorHandler";
import {
  todoSchema,
  updateTodoSchema,
  todoIdParamSchema,
} from "../../../validations/Module/SuperadminDashboard/todoValidation";

export const createTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = todoSchema.safeParse(req.body);
    if (!parsed.success) {
      return next({ status: 400, message: "Validation failed", errors: parsed.error.errors });
    }

    const { title, description, status, userId, schoolId } = parsed.data;
    const todo = await prisma.todo.create({
      data: { title, description, status, userId, schoolId },
    });
    res.status(201).json(todo);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get all Todos
export const getTodos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const todos = await prisma.todo.findMany();
    res.status(200).json(todos);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Get a single Todo by ID
export const getTodoById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const params = todoIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ message: "Invalid id", errors: params.error.errors });
    }

    const { id } = params.data;
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.status(200).json(todo);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Update a Todo
export const updateTodo = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  try {
    const params = todoIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ message: "Invalid id", errors: params.error.errors });
    }

    const body = updateTodoSchema.safeParse(req.body);
    if (!body.success) {
      return res.status(400).json({ message: "Validation failed", errors: body.error.errors });
    }

    const { id } = params.data;
    const { title, description, status } = body.data;
    const todo = await prisma.todo.update({
      where: { id },
      data: { title, description, status },
    });
    res.status(200).json(todo);
  } catch (error) {
    next(handlePrismaError(error));
  }
};

// Delete a Todo
export const deleteTodo = async (req: Request, res: Response, next: NextFunction):Promise<any> => {
  try {
    const params = todoIdParamSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ message: "Invalid id", errors: params.error.errors });
    }

    const { id } = params.data;
    await prisma.todo.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    next(handlePrismaError(error));
  }
};

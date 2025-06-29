import { Request, Response } from "express";
import { prisma } from "../../../../../db/prisma";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from "../../../../../validations/Module/AdminDashboard/departmentValidation";
import { schoolIdParamSchema, cuidSchema } from "../../../../../validations/common/commonValidation";
import { z } from "zod";

export const getDepartments = async (req: Request, res: Response): Promise<any> => {
  const params = schoolIdParamSchema.safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }
  const { schoolId } = params.data;
  try {
    const departments = await prisma.department.findMany({
      where: { schoolId },
      include: { users: { select: { id: true, name: true } } },
    });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch departments" });
  }
};

export const getDepartmentById = async (req: Request, res: Response): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }
  const { id } = params.data;
  try {
    const department = await prisma.department.findUnique({ where: { id } });
    if (!department) return res.status(404).json({ error: "Department not found" });
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch department" });
  }
};

export const createDepartment = async (req: Request, res: Response): Promise<any> => {
  const parsed = createDepartmentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
  }
  const { name, description, schoolId } = parsed.data;
  try {
    const department = await prisma.department.create({ data: { name, description, schoolId } });
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ error: "Failed to create department" });
  }
};

export const updateDepartment = async (req: Request, res: Response): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  const body = updateDepartmentSchema.safeParse(req.body);
  if (!params.success || !body.success) {
    return res.status(400).json({
      errors: [...(params.success ? [] : params.error.errors), ...(body.success ? [] : body.error.errors)],
    });
  }
  const { id } = params.data;
  const { name, description } = body.data;
  try {
    const department = await prisma.department.update({ where: { id }, data: { name, description } });
    res.json(department);
  } catch (error) {
    res.status(500).json({ error: "Failed to update department" });
  }
};

export const deleteDepartment = async (req: Request, res: Response): Promise<any> => {
  const params = z.object({ id: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }
  const { id } = params.data;
  try {
    await prisma.department.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete department" });
  }
};

export const assignUserToDepartment = async (req: Request, res: Response): Promise<any> => {
  const params = z.object({ userId: cuidSchema, departmentId: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }
  const { userId, departmentId } = params.data;
  try {
    const user = await prisma.user.update({ where: { id: userId }, data: { departmentId } });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to assign user to department" });
  }
};

export const removeUserFromDepartment = async (req: Request, res: Response): Promise<any> => {
  const params = z.object({ userId: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }
  const { userId } = params.data;
  try {
    const user = await prisma.user.update({ where: { id: userId }, data: { departmentId: null } });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to remove user from department" });
  }
};

export const getDepartmentUsers = async (req: Request, res: Response): Promise<any> => {
  const params = z.object({ departmentId: cuidSchema }).safeParse(req.params);
  if (!params.success) {
    return res.status(400).json({ errors: params.error.errors });
  }
  const { departmentId } = params.data;
  try {
    const users = await prisma.user.findMany({
      where: { departmentId },
      select: { id: true, name: true, email: true },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

import request from 'supertest';
import express from 'express';
import projectRoutes from '../src/modules/project/routes/projectRoutes';
import { authenticateToken } from '../src/utils/jwt_utils';
import { prisma } from '../src/db/prisma';

jest.mock('../src/db/prisma', () => {
  const project = { create: jest.fn(), findMany: jest.fn() };
  const task = { create: jest.fn(), findMany: jest.fn(), update: jest.fn(), findUnique: jest.fn() };
  const label = { findMany: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() };
  const comment = { create: jest.fn() };
  const projectMember = { findUnique: jest.fn() };
  const sprint = { findUnique: jest.fn() };
  return { prisma: { project, task, label, comment, projectMember, sprint } };
});

jest.mock('../src/utils/jwt_utils', () => {
  const original = jest.requireActual('../src/utils/jwt_utils');
  return {
    ...original,
    authenticateToken: (_req: any, _res: any, next: any) => next(),
  };
});

const app = express();
app.use(express.json());
app.use('/', authenticateToken, projectRoutes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Project routes e2e', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates a project', async () => {
    (prisma.project.create as jest.Mock).mockResolvedValue({ id: 'p1', name: 'P' });
    const res = await request(app).post('/project').send({ name: 'P', createdBy: 'u1' });
    expect(res.status).toBe(201);
    expect(prisma.project.create).toHaveBeenCalled();
  });

  it('denies deleting task for non admin', async () => {
    (prisma.task.findUnique as jest.Mock).mockResolvedValue({ projectId: 'p1' });
    (prisma.projectMember.findUnique as jest.Mock).mockResolvedValue({ role: 'DEVELOPER' });
    const res = await request(app).delete('/task/1');
    expect(res.status).toBe(403);
  });

  it('filters tasks by label', async () => {
    (prisma.task.findMany as jest.Mock).mockResolvedValue([]);
    const res = await request(app).get('/tasks').query({ projectId: 'p1', label: 'l1' });
    expect(res.status).toBe(200);
    expect(prisma.task.findMany).toHaveBeenCalledWith({
      where: { projectId: 'p1', labels: { some: { labelId: 'l1' } } },
      include: expect.any(Object),
    });
  });
});

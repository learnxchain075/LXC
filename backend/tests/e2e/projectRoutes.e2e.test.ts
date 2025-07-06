import request from 'supertest';
import express from 'express';
import projectRoutes from '../src/modules/project/routes/projectRoutes';
import { authenticateToken } from '../src/utils/jwt_utils';
import { prisma } from '../src/db/prisma';

jest.mock('../src/db/prisma', () => {
  const project = { create: jest.fn(), findMany: jest.fn() };
  const task = { create: jest.fn(), findMany: jest.fn(), update: jest.fn() };
  const comment = { create: jest.fn() };
  return { prisma: { project, task, comment } };
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
});

import request from 'supertest';
import express from 'express';
import projectRoutes from '../src/modules/project/routes/projectRoutes';
import { authenticateToken } from '../src/utils/jwt_utils';
import { prisma } from '../src/db/prisma';

jest.mock('../src/db/prisma', () => {
  const sprint = { create: jest.fn() };
  const task = { update: jest.fn(), findUnique: jest.fn() };
  return { prisma: { sprint, task } };
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

describe('Sprint flow', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates sprint and assigns task', async () => {
    (prisma.sprint.create as jest.Mock).mockResolvedValue({ id: 's1' });
    const res = await request(app).post('/project/p1/sprints').send({ name: 'S1', startDate: new Date(), endDate: new Date() });
    expect(res.status).toBe(201);
    expect(prisma.sprint.create).toHaveBeenCalled();

    (prisma.task.update as jest.Mock).mockResolvedValue({ id: 't1', sprintId: 's1' });
    const assign = await request(app).patch('/task/t1/sprint').send({ sprintId: 's1' });
    expect(assign.status).toBe(200);
    expect(prisma.task.update).toHaveBeenCalled();
  });

  it('moves task status', async () => {
    (prisma.task.update as jest.Mock).mockResolvedValue({ id: 't1' });
    const res = await request(app).patch('/task/t1/status').send({ stageId: 'stage2' });
    expect(res.status).toBe(200);
  });
});

import request from 'supertest';
import express from 'express';
import routes from '../../../src/modules/superadmin/routes/dashboard/todoRoutes';
import { prisma } from '../../../src/db/prisma';

jest.mock('../../../src/db/prisma', () => {
  const todo = { findMany: jest.fn() };
  return { prisma: { todo } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Todo routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns todos list', async () => {
    (prisma.todo.findMany as jest.Mock).mockResolvedValue([{ id: 'todo1' }]);
    const res = await request(app).get('/todos');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'todo1' }]);
  });

  it('db failure', async () => {
    (prisma.todo.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/todos');
    expect(res.status).toBe(500);
  });
});

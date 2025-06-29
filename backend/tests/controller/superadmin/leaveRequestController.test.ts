import request from 'supertest';
import express from 'express';
import routes from '../../../src/modules/superadmin/routes/core/leaveRequestRoutes';
import { prisma } from '../../../src/db/prisma';

jest.mock('../../../src/db/prisma', () => {
  const leaveRequest = { findMany: jest.fn() };
  return { prisma: { leaveRequest } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Leave request routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets leave requests', async () => {
    (prisma.leaveRequest.findMany as jest.Mock).mockResolvedValue([{ id: 'l1' }]);
    const res = await request(app).get('/user/leaves');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'l1' }]);
  });

  it('handles errors', async () => {
    (prisma.leaveRequest.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/user/leaves');
    expect(res.status).toBe(500);
  });
});

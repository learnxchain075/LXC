import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/transport/routes/dashboard/assignTransportRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const student = { findUnique: jest.fn() };
  return { prisma: { student } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Assign transport routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets transport details', async () => {
    (prisma.student.findUnique as jest.Mock).mockResolvedValue({ id: 'stu1' });
    const res = await request(app).get('/transport/school/assign-transport/u1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 'stu1' });
  });

  it('handles failure', async () => {
    (prisma.student.findUnique as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/transport/school/assign-transport/u1');
    expect(res.status).toBe(500);
  });
});

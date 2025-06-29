import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/transport/routes/dashboard/conductorRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const conductor = { findMany: jest.fn() };
  return { prisma: { conductor } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Conductor routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets conductors', async () => {
    (prisma.conductor.findMany as jest.Mock).mockResolvedValue([{ id: 'c1' }]);
    const res = await request(app).get('/transport/school/conductor');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'c1' }]);
  });

  it('handles error', async () => {
    (prisma.conductor.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/transport/school/conductor');
    expect(res.status).toBe(500);
  });
});

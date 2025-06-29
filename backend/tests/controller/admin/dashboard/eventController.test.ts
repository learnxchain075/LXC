import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/admin/routes/dashboard/eventRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const event = { findMany: jest.fn() };
  return { prisma: { event } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Event routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns events list', async () => {
    (prisma.event.findMany as jest.Mock).mockResolvedValue([{ id: 'e1' }]);
    const res = await request(app).get('/admin/events');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'e1' }]);
  });

  it('handles db error', async () => {
    (prisma.event.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/admin/events');
    expect(res.status).toBe(500);
  });
});

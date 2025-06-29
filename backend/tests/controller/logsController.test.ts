import request from 'supertest';
import express from 'express';
import routes from '../../src/routes/logRoutes';
import { prisma } from '../../src/db/prisma';

jest.mock('../../src/db/prisma', () => {
  const log = { findMany: jest.fn(), count: jest.fn(), deleteMany: jest.fn() };
  return { prisma: { log } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Logs routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets logs', async () => {
    (prisma.log.findMany as jest.Mock).mockResolvedValue([{ id: 'l1' }]);
    (prisma.log.count as jest.Mock).mockResolvedValue(1);
    const res = await request(app).get('/server/logs');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ logs: [{ id: 'l1' }], total: 1 });
  });

  it('handles db error', async () => {
    (prisma.log.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/server/logs');
    expect(res.status).toBe(500);
  });

  it('deletes all logs', async () => {
    (prisma.log.deleteMany as jest.Mock).mockResolvedValue({ count: 3 });
    const res = await request(app).delete('/server/logs');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'All logs deleted successfully.',
      deletedCount: 3,
    });
  });
});

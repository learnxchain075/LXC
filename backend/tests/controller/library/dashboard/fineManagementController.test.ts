import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/library/routes/dashboard/fineManagementRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const fine = { findMany: jest.fn() };
  return { prisma: { fine } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

beforeAll(() => {});
afterAll(() => {
  jest.resetAllMocks();
});

describe('Fine routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns fines', async () => {
    (prisma.fine.findMany as jest.Mock).mockResolvedValue([{ id: 'f1' }]);
    const res = await request(app).get('/fine');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'f1' }]);
  });

  it('handles db error', async () => {
    (prisma.fine.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/fine');
    expect(res.status).toBe(500);
  });
});

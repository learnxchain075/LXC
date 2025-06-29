import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/student/routes/dashboard/studentAllRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const fee = { findMany: jest.fn() };
  return { prisma: { fee } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Student fees route', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns student fees', async () => {
    (prisma.fee.findMany as jest.Mock).mockResolvedValue([{ id: 'f1' }]);
    const res = await request(app).get('/student/1/fees');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, fees: [{ id: 'f1' }] });
  });

  it('handles error', async () => {
    (prisma.fee.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/student/1/fees');
    expect(res.status).toBe(500);
  });
});

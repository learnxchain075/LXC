import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/library/routes/dashboard/disputeRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const dispute = { create: jest.fn() };
  return { prisma: { dispute } };
});

const app = express();
app.use(express.json());
app.use((req, _res, next) => {
  (req as any).user = { id: 'u1' };
  next();
});
app.use('/', routes);

beforeAll(() => {});
afterAll(() => {
  jest.resetAllMocks();
});

describe('Dispute routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates dispute', async () => {
    (prisma.dispute.create as jest.Mock).mockResolvedValue({ id: 'd1' });
    const res = await request(app)
      .post('/1')
      .send({ reason: 'late' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 'd1' });
  });

  it('handles error', async () => {
    (prisma.dispute.create as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app)
      .post('/1')
      .send({ reason: 'late' });
    expect(res.status).toBe(500);
  });
});

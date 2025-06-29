import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/hostel/routes/dashboard/complaintController';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const complaint = { findMany: jest.fn() };
  return { prisma: { complaint } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Complaint routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns complaints list', async () => {
    (prisma.complaint.findMany as jest.Mock).mockResolvedValue([{ id: 'c1' }]);
    const res = await request(app).get('/hostel/complaint');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'c1' }]);
  });

  it('handles db error', async () => {
    (prisma.complaint.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/hostel/complaint');
    expect(res.status).toBe(500);
  });
});

import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/hostel/routes/dashboard/medicalEmergencyRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const medicalEmergency = { findMany: jest.fn() };
  return { prisma: { medicalEmergency } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Medical emergency routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns emergencies list', async () => {
    (prisma.medicalEmergency.findMany as jest.Mock).mockResolvedValue([{ id: 'm1' }]);
    const res = await request(app).get('/hostel/medical-emergencies');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'm1' }]);
  });

  it('handles db error', async () => {
    (prisma.medicalEmergency.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/hostel/medical-emergencies');
    expect(res.status).toBe(500);
  });
});

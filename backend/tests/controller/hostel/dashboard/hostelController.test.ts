import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/hostel/routes/dashboard/hostelRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const hostel = {
    findMany: jest.fn(),
  };
  return { prisma: { hostel } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Hostel routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns hostels', async () => {
    (prisma.hostel.findMany as jest.Mock).mockResolvedValue([{ id: 'h1' }]);
    const res = await request(app).get('/hostel');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it('handles db error', async () => {
    (prisma.hostel.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/hostel');
    expect(res.status).toBe(500);
  });
});

import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/hostel/routes/dashboard/hostelInventoryRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const inventory = { findMany: jest.fn() };
  return { prisma: { inventory } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Hostel inventory routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns inventories list', async () => {
    (prisma.inventory.findMany as jest.Mock).mockResolvedValue([{ id: 'i1' }]);
    const res = await request(app).get('/hostel/room/r1/inventory');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'i1' }]);
  });

  it('handles db error', async () => {
    (prisma.inventory.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/hostel/room/r1/inventory');
    expect(res.status).toBe(500);
  });
});

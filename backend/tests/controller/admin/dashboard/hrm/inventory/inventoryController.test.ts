import request from 'supertest';
import express from 'express';
import routes from '../../../../../../src/modules/admin/routes/dashboard/hrm/inventory/inventoryRoutes';
import { prisma } from '../../../../../../src/db/prisma';

jest.mock('../../../../../../src/db/prisma', () => {
  const inventoryItem = { findMany: jest.fn() };
  return { prisma: { inventoryItem } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Admin inventory routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns items list', async () => {
    (prisma.inventoryItem.findMany as jest.Mock).mockResolvedValue([{ id: 'i1' }]);
    const res = await request(app).get('/school1/items');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'i1' }]);
  });

  it('handles db error', async () => {
    (prisma.inventoryItem.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/school1/items');
    expect(res.status).toBe(500);
  });
});

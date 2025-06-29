import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/admin/routes/dashboard/studentPromotionRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const studentPromotion = { create: jest.fn() };
  return { prisma: { studentPromotion } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Student promotion routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('promotes student', async () => {
    (prisma.studentPromotion.create as jest.Mock).mockResolvedValue({ id: 'sp1' });
    const res = await request(app).post('/admin/promotions/promote').send({});
    expect(res.status).toBe(200);
  });

  it('handles db error', async () => {
    (prisma.studentPromotion.create as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).post('/admin/promotions/promote').send({});
    expect(res.status).toBe(500);
  });
});

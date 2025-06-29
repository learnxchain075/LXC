import request from 'supertest';
import express from 'express';
import routes from '../../../src/modules/superadmin/routes/dashboard/ticketRoutes';
import { prisma } from '../../../src/db/prisma';

jest.mock('../../../src/db/prisma', () => {
  const ticket = { findMany: jest.fn() };
  return { prisma: { ticket } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Ticket routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lists tickets successfully', async () => {
    (prisma.ticket.findMany as jest.Mock).mockResolvedValue([{ id: 't1' }]);
    const res = await request(app).get('/user/get-tickets');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 't1' }]);
  });

  it('handles prisma errors', async () => {
    (prisma.ticket.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/user/get-tickets');
    expect(res.status).toBe(500);
  });
});

import request from 'supertest';
import express from 'express';
import routes from '../../../../../src/modules/admin/routes/core/schoolauthroutes/hostelRoutes';
import { prisma } from '../../../../../src/db/prisma';

jest.mock('../../../../../src/db/prisma', () => {
  const user = { findMany: jest.fn() };
  return { prisma: { user } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

beforeAll(() => {});
afterAll(() => { jest.resetAllMocks(); });

describe('Hostel routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lists hostels', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValue([{ id: 'h1' }]);
    const res = await request(app).get('/hostel');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'h1' }]);
  });

  it('handles db failure', async () => {
    (prisma.user.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/hostel');
    expect(res.status).toBe(500);
  });
});

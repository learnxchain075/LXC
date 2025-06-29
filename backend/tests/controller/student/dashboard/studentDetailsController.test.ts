import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/student/routes/dashboard/studentDetailsRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const user = { findUnique: jest.fn() };
  return { prisma: { user } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Student details route', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets student details', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'u1' });
    const res = await request(app).get('/student/user/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 'u1' });
  });

  it('handles not found', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get('/student/user/1');
    expect(res.status).toBe(404);
  });
});

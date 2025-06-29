import request from 'supertest';
import express from 'express';
import routes from '../../../../../src/modules/admin/routes/core/schoolauthroutes/studentRoutes';
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

describe('Student routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns students', async () => {
    (prisma.user.findMany as jest.Mock).mockResolvedValue([{ id: 's1' }]);
    const res = await request(app).get('/student');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 's1' }]);
  });

  it('db failure', async () => {
    (prisma.user.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/student');
    expect(res.status).toBe(500);
  });
});

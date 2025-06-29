import request from 'supertest';
import express from 'express';
import routes from '../../../src/modules/superadmin/routes/core/schoolRoute';
import { prisma } from '../../../src/db/prisma';

jest.mock('../../../src/db/prisma', () => {
  const school = { findMany: jest.fn() };
  return { prisma: { school } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('School routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets schools', async () => {
    (prisma.school.findMany as jest.Mock).mockResolvedValue([{ id: 's1' }]);
    const res = await request(app).get('/get-all');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 's1' }]);
  });

  it('handles error', async () => {
    (prisma.school.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/get-all');
    expect(res.status).toBe(500);
  });
});

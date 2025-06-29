import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/admin/routes/dashboard/competitionRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const competition = {
    findMany: jest.fn(),
  };
  return { prisma: { competition } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Competition routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns competitions list', async () => {
    (prisma.competition.findMany as jest.Mock).mockResolvedValue([{ id: 'c1' }]);
    const res = await request(app).get('/competitions');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'c1' }]);
  });

  it('handles db error', async () => {
    (prisma.competition.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/competitions');
    expect(res.status).toBe(500);
  });
});

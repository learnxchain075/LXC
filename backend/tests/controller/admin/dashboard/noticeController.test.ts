import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/admin/routes/dashboard/noticeRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const notice = {
    findMany: jest.fn(),
  };
  return { prisma: { notice } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Notice routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns notices', async () => {
    (prisma.notice.findMany as jest.Mock).mockResolvedValue([{ id: 'n1' }]);
    const res = await request(app).get('/all/school/notice');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'n1' }]);
  });

  it('handles db error', async () => {
    (prisma.notice.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/all/school/notice');
    expect(res.status).toBe(500);
  });
});

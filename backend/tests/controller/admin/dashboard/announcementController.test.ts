import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/admin/routes/dashboard/announcementRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const announcement = { findMany: jest.fn() };
  return { prisma: { announcement } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Announcement routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns announcements list', async () => {
    (prisma.announcement.findMany as jest.Mock).mockResolvedValue([{ id: 'a1' }]);
    const res = await request(app).get('/admin/announcement');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'a1' }]);
  });

  it('handles db error', async () => {
    (prisma.announcement.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/admin/announcement');
    expect(res.status).toBe(500);
  });
});

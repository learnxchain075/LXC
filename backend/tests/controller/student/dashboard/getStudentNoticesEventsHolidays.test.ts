import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/student/routes/dashboard/studentAllRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const student = { findUnique: jest.fn() };
  const notice = { findMany: jest.fn() };
  const holiday = { findMany: jest.fn() };
  const event = { findMany: jest.fn() };
  return { prisma: { student, notice, holiday, event } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Student dashboard resources route', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns notices events holidays', async () => {
    (prisma.student.findUnique as jest.Mock).mockResolvedValue({ schoolId: 's1', classId: 'c1' });
    (prisma.notice.findMany as jest.Mock).mockResolvedValue([{ id: 'n1' }]);
    (prisma.holiday.findMany as jest.Mock).mockResolvedValue([{ id: 'h1' }]);
    (prisma.event.findMany as jest.Mock).mockResolvedValue([{ id: 'e1' }]);
    const res = await request(app).get('/student/1/dashboard-resources');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, notices: [{ id: 'n1' }], holidays: [{ id: 'h1' }], events: [{ id: 'e1' }] });
  });

  it('handles db error', async () => {
    (prisma.student.findUnique as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/student/1/dashboard-resources');
    expect(res.status).toBe(500);
  });
});

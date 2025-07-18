import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/student/routes/dashboard/studentAllRoutes';
import { prisma } from '../../../../src/db/prisma';
import { uploadFile } from '../../../../src/config/upload';

jest.mock('../../../../src/db/prisma', () => {
  const assignmentSubmission = { findFirst: jest.fn(), create: jest.fn() };
  return { prisma: { assignmentSubmission } };
});

jest.mock('../../../../src/config/upload', () => ({
  uploadFile: jest.fn(() => Promise.resolve({ url: 'file' }))
}));

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Submit assignment route', () => {
  beforeEach(() => jest.clearAllMocks());

  it('submits assignment', async () => {
    (prisma.assignmentSubmission.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.assignmentSubmission.create as jest.Mock).mockResolvedValue({ id: 's1' });
    const res = await request(app)
      .post('/student/1/submit-assignment')
      .attach('file', Buffer.from('data'), 'file.txt');
    expect(res.status).toBe(201);
  });

  it('handles error', async () => {
    (prisma.assignmentSubmission.findFirst as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app)
      .post('/student/1/submit-assignment')
      .attach('file', Buffer.from('data'), 'file.txt');
    expect(res.status).toBe(500);
  });
});

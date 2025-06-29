import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/student/routes/dashboard/studentAllRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const student = { findUnique: jest.fn() };
  const quiz = { findMany: jest.fn() };
  const newspaper = { findMany: jest.fn() };
  return { prisma: { student, quiz, newspaper } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Student quizzes and newspapers route', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns quizzes and newspapers', async () => {
    (prisma.student.findUnique as jest.Mock).mockResolvedValue({ classId: 'c1', userId: 'u1' });
    (prisma.quiz.findMany as jest.Mock).mockResolvedValue([{ id: 'q1', quizResult: [] }]);
    (prisma.newspaper.findMany as jest.Mock).mockResolvedValue([{ id: 'n1', NewspaperSubmission: [] }]);
    const res = await request(app).get('/student/1/quiz-newspaper');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('handles db error', async () => {
    (prisma.student.findUnique as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/student/1/quiz-newspaper');
    expect(res.status).toBe(500);
  });
});

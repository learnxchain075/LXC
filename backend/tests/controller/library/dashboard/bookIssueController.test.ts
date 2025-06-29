import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/library/routes/dashboard/bookIssueRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const library = { findUnique: jest.fn() };
  const bookCopy = { findUnique: jest.fn(), update: jest.fn() };
  const bookIssue = { create: jest.fn() };
  return { prisma: { library, bookCopy, bookIssue } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

beforeAll(() => {});
afterAll(() => {
  jest.resetAllMocks();
});

describe('BookIssue routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('issues a book', async () => {
    (prisma.library.findUnique as jest.Mock).mockResolvedValue({ id: 'l1' });
    (prisma.bookCopy.findUnique as jest.Mock).mockResolvedValue({ id: 'c1', status: 'AVAILABLE' });
    (prisma.bookIssue.create as jest.Mock).mockResolvedValue({ id: 'i1' });
    const res = await request(app)
      .post('/1/books/issue')
      .send({ bookCopyId: 'c1', userId: 'u1', dueDate: new Date().toISOString() });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 'i1' });
  });

  it('handles error', async () => {
    (prisma.library.findUnique as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app)
      .post('/1/books/issue')
      .send({ bookCopyId: 'c1', userId: 'u1', dueDate: new Date().toISOString() });
    expect(res.status).toBe(500);
  });
});

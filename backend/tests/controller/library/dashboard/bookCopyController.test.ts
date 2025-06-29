import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/library/routes/dashboard/bookcopyRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const bookCopy = { findMany: jest.fn() };
  return { prisma: { bookCopy } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

beforeAll(() => {});
afterAll(() => {
  jest.resetAllMocks();
});

describe('BookCopy routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets book copies', async () => {
    (prisma.bookCopy.findMany as jest.Mock).mockResolvedValue([{ id: 'c1' }]);
    const res = await request(app).get('/1/books/1/copies');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'c1' }]);
  });

  it('handles db error', async () => {
    (prisma.bookCopy.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/1/books/1/copies');
    expect(res.status).toBe(500);
  });
});

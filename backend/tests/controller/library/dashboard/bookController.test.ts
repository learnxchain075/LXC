import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/library/routes/dashboard/bookRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const book = { findMany: jest.fn() };
  return { prisma: { book } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

beforeAll(() => {});
afterAll(() => {
  jest.resetAllMocks();
});

describe('Book routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns books for a library', async () => {
    (prisma.book.findMany as jest.Mock).mockResolvedValue([{ id: 'b1' }]);
    const res = await request(app).get('/1/books');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'b1' }]);
  });

  it('handles prisma error', async () => {
    (prisma.book.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/1/books');
    expect(res.status).toBe(500);
  });
});

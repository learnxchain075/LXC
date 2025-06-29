import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/library/routes/dashboard/createAuthorRoutes';
import { prisma } from '../../../../src/db/prisma';

jest.mock('../../../../src/db/prisma', () => {
  const author = { findMany: jest.fn() };
  return { prisma: { author } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

beforeAll(() => {});
afterAll(() => {
  jest.resetAllMocks();
});

describe('Author routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets authors', async () => {
    (prisma.author.findMany as jest.Mock).mockResolvedValue([{ id: 'a1' }]);
    const res = await request(app).get('/authors');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'a1' }]);
  });

  it('handles db error', async () => {
    (prisma.author.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/authors');
    expect(res.status).toBe(500);
  });
});

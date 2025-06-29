import request from 'supertest';
import express from 'express';
import router from '../../../src/routes/application/chat/chatRoutes';
import { prisma } from '../../../src/db/prisma';

jest.mock('../../../src/db/prisma', () => {
  const user = { findUnique: jest.fn() };
  const friend = { create: jest.fn(), findMany: jest.fn() };
  const friendRequest = { create: jest.fn() };
  return { prisma: { user, friend, friendRequest } };
});

const app = express();
app.use(express.json());
app.use((req, _res, next) => {
  (req as any).user = { id: 'u1' };
  next();
});
app.use('/', router);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Chat friend routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates friend when in same school', async () => {
    (prisma.user.findUnique as jest.Mock)
      .mockResolvedValueOnce({ id: 'u1', schoolId: 's1' })
      .mockResolvedValueOnce({ id: 'u2', schoolId: 's1' });
    (prisma.friend.create as jest.Mock).mockResolvedValue({ id: 'f1' });

    const res = await request(app).post('/friend-request').send({ receiverId: 'u2' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: 'f1' });
  });

  it('returns 400 for invalid body', async () => {
    const res = await request(app).post('/friend-request').send({});
    expect(res.status).toBe(400);
  });

  it('lists friends', async () => {
    (prisma.friend.findMany as jest.Mock).mockResolvedValue([{ id: 'f1' }]);

    const res = await request(app).get('/friends');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 'f1' }]);
  });
});

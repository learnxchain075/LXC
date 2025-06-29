import request from 'supertest';
import express from 'express';
import routes from '../../../src/routes/signin/forgotRoute';
import { prisma } from '../../../src/db/prisma';

jest.mock('../../../src/db/prisma', () => {
  const user = { findUnique: jest.fn(), update: jest.fn() };
  const passwordResetToken = { create: jest.fn(), findUnique: jest.fn(), update: jest.fn() };
  return { prisma: { user, passwordResetToken } };
});

jest.mock('../../../src/config/email', () => ({ sendResetEmail: jest.fn() }));

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Forgot password routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('initiates password reset', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'u1', email: 'a@b.c' });
    (prisma.passwordResetToken.create as jest.Mock).mockResolvedValue({});
    const res = await request(app).post('/forgot-password').send({ email: 'a@b.c' });
    expect(res.status).toBe(200);
  });

  it('handles missing user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await request(app).post('/forgot-password').send({ email: 'a@b.c' });
    expect(res.status).toBe(404);
  });
});

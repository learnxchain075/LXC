import request from 'supertest';
import express from 'express';
import routes from '../../../src/routes/signin/refreshTokenRoutes';

jest.mock('../../../src/utils/jwt_utils', () => ({
  validateRefreshToken: jest.fn().mockResolvedValue({ user: { userId: 'u1' } }),
  getJwtToken: jest.fn().mockReturnValue('token')
}));

jest.mock('../../../src/models/UserModel.model', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({ getByParams: jest.fn().mockResolvedValue({ id: 'u1', email: 'e', role: 'admin' }) }))
  };
});

const app = express();
app.use(express.json());
app.use('/', routes);

beforeAll(() => {});
afterAll(() => {
  jest.resetAllMocks();
});

describe('Refresh token route', () => {
  it('returns new tokens', async () => {
    const res = await request(app).post('/refresh-token').send({ token: 'old' });
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBe('token');
  });

  it('handles auth error', async () => {
    const UserModel = (await import('../../../src/models/UserModel.model')).default as any;
    UserModel.mockImplementation(() => ({ getByParams: jest.fn().mockResolvedValue(null) }));
    const res = await request(app).post('/refresh-token').send({ token: 'old' });
    expect(res.status).toBe(401);
  });
});

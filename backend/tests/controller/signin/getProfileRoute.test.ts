import request from 'supertest';
import express from 'express';
import routes from '../../../src/routes/signin/getProfileRoute';
import { Role } from '@prisma/client';

jest.mock('../../../src/controller/signin/signinController', () => ({
  getUserProfile: jest.fn(),
  getUserPermissions: jest.fn(),
}));

const { getUserProfile, getUserPermissions } = require('../../../src/controller/signin/signinController');

const app = express();
app.use(express.json());

let mockUser: any = { id: 'u1', role: Role.admin };
app.use((req, _res, next) => { req.user = mockUser; next(); });
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Get profile route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = { id: 'u1', role: Role.admin };
  });

  it('returns user profile with permissions', async () => {
    (getUserProfile as jest.Mock).mockResolvedValue({ name: 'n', email: 'e', role: 'admin' });
    (getUserPermissions as jest.Mock).mockResolvedValue({ permissions: { demo: true } });
    const res = await request(app).get('/get-profile');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: 'ok', user: { name: 'n', email: 'e', role: 'admin' }, permissions: { demo: true } });
  });

  it('returns profile without permissions for superadmin', async () => {
    mockUser = { id: 'u1', role: Role.superadmin };
    (getUserProfile as jest.Mock).mockResolvedValue({ name: 'n', email: 'e', role: 'superadmin' });
    const res = await request(app).get('/get-profile');
    expect(getUserPermissions).not.toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: 'ok', user: { name: 'n', email: 'e', role: 'superadmin' } });
  });

  it('handles error', async () => {
    (getUserProfile as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/get-profile');
    expect(res.status).toBe(500);
  });
});

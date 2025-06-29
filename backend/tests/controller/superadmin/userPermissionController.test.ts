import request from 'supertest';
import express from 'express';
import routes from '../../../src/modules/superadmin/routes/core/permissionsRoute';

jest.mock('../../../src/models/UserModel.model', () => {
  return jest.fn().mockImplementation(() => ({
    getByParams: jest.fn().mockResolvedValue({ id: 'u1' }),
  }));
});

jest.mock('../../../src/models/UserPermissionsModel.model', () => {
  return jest.fn().mockImplementation(() => ({
    getAll: jest.fn().mockResolvedValue([{ perm: 'read' }]),
  }));
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('User permission routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns permissions', async () => {
    const res = await request(app).get('/get/u1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ perm: 'read' }]);
  });

  it('handles failure', async () => {
    const MockModel: jest.Mock = require('../../../src/models/UserPermissionsModel.model');
    MockModel.mockImplementationOnce(() => ({
      getAll: jest.fn().mockRejectedValue(new Error('fail')),
    }));
    const res = await request(app).get('/get/u1');
    expect(res.status).toBe(500);
  });
});

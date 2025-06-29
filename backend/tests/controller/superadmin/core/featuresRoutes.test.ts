import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/superadmin/routes/core/featuresRoutes';

const mockSfrGetAll = jest.fn();
const mockSfrGetByParams = jest.fn();
const mockSfrUpdate = jest.fn();
const mockPermCreate = jest.fn();
const mockPermGetAll = jest.fn();
const mockPermGetByParams = jest.fn();
const mockPermUpdate = jest.fn();

jest.mock('../../../../src/models/SchoolFeatureRequestsModel.model', () => {
  return jest.fn().mockImplementation(() => ({
    getAll: mockSfrGetAll,
    getByParams: mockSfrGetByParams,
    update: mockSfrUpdate,
  }));
});

jest.mock('../../../../src/models/UserPermissionsModel.model', () => {
  return jest.fn().mockImplementation(() => ({
    create: mockPermCreate,
    getAll: mockPermGetAll,
    getByParams: mockPermGetByParams,
    update: mockPermUpdate,
  }));
});

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Superadmin features routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lists feature requests', async () => {
    mockSfrGetAll.mockResolvedValue([{ id: 'r1', moduleName: 'Library', status: 0 }]);
    const res = await request(app).get('/get-all-requests');
    expect(res.status).toBe(200);
    expect(res.body.featuresList).toHaveLength(1);
  });

  it('completes a request', async () => {
    mockSfrGetByParams.mockResolvedValue({ id: 'r1', userId: 'u1', moduleName: 'Library' });
    mockPermCreate.mockResolvedValue({});
    mockSfrUpdate.mockResolvedValue({});
    const res = await request(app).put('/request/complete/r1');
    expect(res.status).toBe(200);
    expect(mockPermCreate).toHaveBeenCalled();
  });
});

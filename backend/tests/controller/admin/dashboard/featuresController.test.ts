import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/admin/routes/dashboard/featuresRoutes';

const mockGetByParamsUser = jest.fn();
const mockGetByParamsPerm = jest.fn();
const mockGetByParamsRequest = jest.fn();
const mockCreateRequest = jest.fn();

jest.mock('../../../../src/models/UserModel.model', () => {
  return jest.fn().mockImplementation(() => ({ getByParams: mockGetByParamsUser }));
});

jest.mock('../../../../src/models/UserPermissionsModel.model', () => {
  return jest.fn().mockImplementation(() => ({ getByParams: mockGetByParamsPerm }));
});

jest.mock('../../../../src/models/SchoolFeatureRequestsModel.model', () => {
  return jest.fn().mockImplementation(() => ({
    getByParams: mockGetByParamsRequest,
    create: mockCreateRequest,
  }));
});

const app = express();
app.use(express.json());
app.use((req, _res, next) => { (req as any).user = { id: 'u1', schoolId: 's1' }; next(); });
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Admin features routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('gets all features', async () => {
    mockGetByParamsUser.mockResolvedValue({ id: 'u1' });
    mockGetByParamsPerm.mockResolvedValue(null);
    mockGetByParamsRequest.mockResolvedValue(null);
    const res = await request(app).get('/features/get-all');
    expect(res.status).toBe(200);
  });

  it('requests a feature', async () => {
    mockCreateRequest.mockResolvedValue({});
    const res = await request(app).post('/features/request').send({ moduleName: 'Library' });
    expect(res.status).toBe(200);
    expect(mockCreateRequest).toHaveBeenCalled();
  });
});

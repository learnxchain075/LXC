import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/superadmin/routes/dashboard/handlePaymentRoutes';

const createPaymentOrder = jest.fn((req, res) => res.status(201).json({ id: 'order1' }));
const handleWebhook = jest.fn((req, res) => res.status(200).json({ ok: true }));

jest.mock('../../../../src/modules/accounts/controllers/dashboard/paymentController', () => ({
  createPaymentOrder: (req: any, res: any, next: any) => createPaymentOrder(req, res, next),
  handleWebhook: (req: any, res: any, next: any) => handleWebhook(req, res, next),
}));

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Handle payment routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls createPaymentOrder', async () => {
    const res = await request(app).post('/payment/create').send({ feeId: 'f1', amount: 10 });
    expect(res.status).toBe(201);
    expect(createPaymentOrder).toHaveBeenCalled();
  });

  it('calls handleWebhook', async () => {
    const res = await request(app).post('/payment/webhook').send({});
    expect(res.status).toBe(200);
    expect(handleWebhook).toHaveBeenCalled();
  });
});

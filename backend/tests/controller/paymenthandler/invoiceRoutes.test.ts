import request from 'supertest';
import express from 'express';
import routes from '../../../src/routes/paymenthandler/invoiceRoutes';
import { prisma } from '../../../src/db/prisma';
import puppeteer from 'puppeteer';
import * as invoiceUtils from '../../../src/utils/invoiceUtils';
import { uploadFile } from '../../../src/config/upload';
import { sendInvoicePdfEmail } from '../../../src/utils/mailer';

jest.mock('../../../src/db/prisma', () => {
  const subscription = { findUnique: jest.fn() };
  const payment = { findUnique: jest.fn() };
  const clazz = { findUnique: jest.fn() };
  return { prisma: { subscription, payment, class: clazz } };
});

jest.mock('../../../src/utils/invoiceUtils', () => ({
  generateInvoiceNumber: jest.fn().mockResolvedValue('INV-1'),
  logInvoiceDownload: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../../src/config/upload', () => ({
  uploadFile: jest.fn().mockResolvedValue({ url: 'http://file' }),
}));

jest.mock('../../../src/utils/mailer', () => ({
  sendInvoicePdfEmail: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      setContent: jest.fn(),
      pdf: jest.fn().mockResolvedValue(Buffer.from('pdf')),
    }),
    close: jest.fn(),
  }),
}));

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => {
  jest.resetAllMocks();
});

describe('Invoice routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('downloads plan invoice', async () => {
    (prisma.subscription.findUnique as jest.Mock).mockResolvedValue({
      id: 'sub1',
      plan: { name: 'Pro' },
      school: { schoolName: 'ABC School', user: {} },
      payment: { amount: 118, createdAt: new Date(), updatedAt: new Date() },
    });

    const res = await request(app).get('/school/plan/invoice/sub1');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('application/pdf');
    expect(invoiceUtils.generateInvoiceNumber).toHaveBeenCalled();
    expect(uploadFile).toHaveBeenCalled();
    expect(sendInvoicePdfEmail).toHaveBeenCalled();
    expect(invoiceUtils.logInvoiceDownload).toHaveBeenCalled();
  });

  it('returns 404 for missing subscription', async () => {
    (prisma.subscription.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get('/school/plan/invoice/x');
    expect(res.status).toBe(404);
  });

  it('downloads fee invoice', async () => {
    (prisma.payment.findUnique as jest.Mock).mockResolvedValue({
      id: 'pay1',
      amount: 100,
      paymentMethod: 'Cash',
      updatedAt: new Date(),
      createdAt: new Date(),
      fee: {
        amount: 100,
        amountPaid: 100,
        status: 'PAID',
        school: { schoolName: 'ABC School' },
        student: { classId: 'c1', user: { name: 'John' } },
      },
    });
    (prisma.class.findUnique as jest.Mock).mockResolvedValue({ name: '10' });

    const res = await request(app).get('/school/fee/invoice/pay1');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('application/pdf');
    expect(invoiceUtils.generateInvoiceNumber).toHaveBeenCalled();
    expect(uploadFile).toHaveBeenCalled();
    expect(sendInvoicePdfEmail).toHaveBeenCalled();
    expect(invoiceUtils.logInvoiceDownload).toHaveBeenCalled();
  });

  it('returns 404 for missing fee payment', async () => {
    (prisma.payment.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get('/school/fee/invoice/x');
    expect(res.status).toBe(404);
  });
});

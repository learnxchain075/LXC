import request from 'supertest';
import express from 'express';
import routes from '../../../../src/modules/admin/routes/dashboard/studentPromotionRoutes';
import { prisma } from '../../../../src/db/prisma';
import { generateTransferCertificate } from '../../../../src/utils/certificateGenerator';
import { sendTransferCertificateEmail } from '../../../../src/utils/mailer';

jest.mock('../../../../src/db/prisma', () => {
  const student = { update: jest.fn(), findUnique: jest.fn() };
  return { prisma: { student } };
});

jest.mock('../../../../src/utils/certificateGenerator', () => ({
  generateTransferCertificate: jest.fn().mockResolvedValue('url'),
}));

jest.mock('../../../../src/utils/mailer', () => ({
  sendTransferCertificateEmail: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/', routes);

afterAll(() => jest.resetAllMocks());

describe('Withdraw student route', () => {
  beforeEach(() => jest.clearAllMocks());

  it('updates status and sends certificate', async () => {
    (prisma.student.findUnique as jest.Mock).mockResolvedValue({ id: 's1', user: { email: 'a', name: 'b' }, class: {}, admissionNo: '1' });
    (prisma.student.update as jest.Mock).mockResolvedValue({});
    const res = await request(app).post('/admin/promotions/withdraw').send({ studentId: 's1' });
    expect(res.status).toBe(200);
    expect(generateTransferCertificate).toHaveBeenCalled();
    expect(sendTransferCertificateEmail).toHaveBeenCalled();
  });

  it('handles error', async () => {
    (prisma.student.findUnique as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).post('/admin/promotions/withdraw').send({ studentId: 's1' });
    expect(res.status).toBe(500);
  });
});

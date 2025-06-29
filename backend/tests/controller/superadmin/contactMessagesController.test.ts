import request from 'supertest';
import express from 'express';
import routes from '../../../src/modules/superadmin/routes/core/contactMessageRoutes';
import { prisma } from '../../../src/db/prisma';

jest.mock('../../../src/db/prisma', () => {
  const contactMessage = {
    findMany: jest.fn(),
  };
  return { prisma: { contactMessage } };
});

const app = express();
app.use(express.json());
app.use('/', routes);

beforeAll(() => {});
afterAll(() => {
  jest.resetAllMocks();
});

describe('Contact Message routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('retrieves all contact messages', async () => {
    (prisma.contactMessage.findMany as jest.Mock).mockResolvedValue([{ id: '1' }]);
    const res = await request(app).get('/contact-messages');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: '1' }]);
  });

  it('handles db failure', async () => {
    (prisma.contactMessage.findMany as jest.Mock).mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/contact-messages');
    expect(res.status).toBe(500);
  });
});

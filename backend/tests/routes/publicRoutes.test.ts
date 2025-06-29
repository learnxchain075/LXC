import request from 'supertest';
import express from 'express';

jest.mock('../src/routes/signin/forgotRoute', () => {
  const express = require('express');
  return express.Router();
});

jest.mock('../src/modules/superadmin/routes/core/superAdminRoute', () => {
  const express = require('express');
  return express.Router();
});

jest.mock('../src/modules/superadmin/routes/dashboard/planRoutes', () => {
  const express = require('express');
  return express.Router();
});

jest.mock('../src/routes/paymenthandler/planHandlerRoutes', () => {
  const express = require('express');
  return express.Router();
});

jest.mock('../src/routes/logRoutes', () => {
  const express = require('express');
  return express.Router();
});

jest.mock('../src/routes/signin/signinRoute', () => {
  const express = require('express');
  const r = express.Router();
  r.get('/check', (_req, res) => res.status(200).json({ ok: true }));
  return r;
});

import publicRoutes from '../src/routes/publicRoutes';

const app = express();
app.use(express.json());
app.use('/', publicRoutes);

describe('Public routes aggregation', () => {
  it('provides access to mocked signin route', async () => {
    const res = await request(app).get('/auth/check');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});

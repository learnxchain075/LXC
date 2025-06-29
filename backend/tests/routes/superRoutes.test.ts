import request from 'supertest';
import express from 'express';

jest.mock('../src/modules/superadmin/routes/core/userRoutes', () => {
  const express = require('express');
  return express.Router();
});

jest.mock('../src/modules/superadmin/routes/core/superAdminRoute', () => {
  const express = require('express');
  return express.Router();
});

jest.mock('../src/modules/superadmin/routes/core/permissionsRoute', () => {
  const express = require('express');
  return express.Router();
});

jest.mock('../src/modules/superadmin/routes/core/featuresRoutes', () => {
  const express = require('express');
  return express.Router();
});

jest.mock('../src/utils/jwt_utils', () => ({
  validateModuleAccess: () => (_req: any, _res: any, next: any) => next(),
}));

jest.mock('../src/modules/superadmin/routes/core/schoolRoute', () => {
  const express = require('express');
  const r = express.Router();
  r.get('/test', (_req, res) => res.status(200).json({ ok: true }));
  return r;
});

import superRoutes from '../src/modules/superadmin/routes/core/superRoutes';

const app = express();
app.use(express.json());
app.use('/', superRoutes);

describe('Super routes aggregation', () => {
  it('exposes school route', async () => {
    const res = await request(app).get('/schools/test');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});

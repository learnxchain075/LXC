import { ApiError, ValidationError, AuthenticationError, AuthorizationError, NotFoundError, BusinessLogicError, ExternalServiceError } from '../../src/utils/apiError';

describe('ApiError classes', () => {
  test('ApiError sets message and statusCode', () => {
    const err = new ApiError(500, 'boom', { foo: 'bar' });
    expect(err.message).toBe('boom');
    expect(err.statusCode).toBe(500);
    expect(err.details).toEqual({ foo: 'bar' });
  });

  test('ValidationError has 400 status', () => {
    const err = new ValidationError('invalid');
    expect(err.statusCode).toBe(400);
  });

  test('AuthenticationError has 401 status', () => {
    const err = new AuthenticationError('no auth');
    expect(err.statusCode).toBe(401);
  });

  test('AuthorizationError has 403 status', () => {
    const err = new AuthorizationError('no access');
    expect(err.statusCode).toBe(403);
  });

  test('NotFoundError has 404 status', () => {
    const err = new NotFoundError('missing');
    expect(err.statusCode).toBe(404);
  });

  test('BusinessLogicError has 422 status', () => {
    const err = new BusinessLogicError('logic');
    expect(err.statusCode).toBe(422);
  });

  test('ExternalServiceError has 503 status', () => {
    const err = new ExternalServiceError('service');
    expect(err.statusCode).toBe(503);
  });
});

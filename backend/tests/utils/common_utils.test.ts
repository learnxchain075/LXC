import { getErrorMessage, getErrorStack, sha512, getNickName, generateOTP } from '../../src/utils/common_utils';

describe('common_utils', () => {
  test('getErrorMessage returns message string', () => {
    const message = getErrorMessage(new Error('oops'));
    expect(message).toBe('oops');
  });

  test('getErrorStack returns stack string', () => {
    const stack = getErrorStack(new Error('boom'));
    expect(typeof stack).toBe('string');
    expect(stack.length).toBeGreaterThan(0);
  });

  test('sha512 hashes string', () => {
    const hash = sha512('test');
    expect(hash).toHaveLength(128);
  });

  test('getNickName builds nickname', () => {
    expect(getNickName('John', 'Doe')).toBe('john_doe');
  });

  test('generateOTP returns 4 digit string', async () => {
    const otp = await generateOTP();
    expect(otp).toMatch(/^\d{4}$/);
  });
});

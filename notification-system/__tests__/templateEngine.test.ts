import { replacePlaceholders } from '../utils/templateEngine';

test('replace placeholders', () => {
  const template = 'Hello {{name}}';
  const result = replacePlaceholders(template, { name: 'John' });
  expect(result).toBe('Hello John');
});

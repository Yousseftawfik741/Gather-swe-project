import { isValidEmail } from './validation';

describe('Email validation', () => {
  test('accepts a valid email address', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });

  test('accepts an email with surrounding whitespace', () => {
    expect(isValidEmail(' test@example.com ')).toBe(true);
  });

  test('rejects an empty email address', () => {
    expect(isValidEmail('')).toBe(false);
  });

  test('rejects whitespace only', () => {
    expect(isValidEmail('   ')).toBe(false);
  });

  test('rejects an email without an at sign', () => {
    expect(isValidEmail('testexample.com')).toBe(false);
  });

  test('rejects an email without a username', () => {
    expect(isValidEmail('@example.com')).toBe(false);
  });

  test('rejects an email without a domain', () => {
    expect(isValidEmail('test@')).toBe(false);
  });

  test('rejects an email without a domain extension', () => {
    expect(isValidEmail('test@example')).toBe(false);
  });

  test('rejects an email with multiple at signs', () => {
    expect(isValidEmail('test@@example.com')).toBe(false);
  });

  test('rejects an email with consecutive domain dots', () => {
    expect(isValidEmail('test@example..com')).toBe(false);
  });
});
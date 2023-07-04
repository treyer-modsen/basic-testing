import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

const testValue = 123;
const testErrorMessage = 'Some error message';
const defaultErrorMessage = 'Oops!';
const rejectErrorMessage = 'This is my awesome custom error!';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    return resolveValue(testValue).then((data) => {
      expect(data).toBe(testValue);
    });
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    expect(() => throwError(testErrorMessage)).toThrow(testErrorMessage);
  });

  test('should throw error with default message if message is not provided', () => {
    expect(() => throwError()).toThrow(defaultErrorMessage);
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(() => throwCustomError()).toThrow(MyAwesomeError);
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    return rejectCustomError().catch((error) => {
      expect(error.message).toBe(rejectErrorMessage);
    });
  });
});

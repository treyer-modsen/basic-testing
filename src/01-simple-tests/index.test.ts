import { simpleCalculator, Action } from './index';

const getRandomArbitrary = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const getRandomOperands = (min: number, max: number): [number, number] => [
  getRandomArbitrary(min, max),
  getRandomArbitrary(min, max),
];

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const [a, b] = getRandomOperands(0, 100);
    const result = simpleCalculator({
      a,
      b,
      action: Action.Add,
    });
    expect(result).toBe(a + b);
  });

  test('should subtract two numbers', () => {
    const [a, b] = getRandomOperands(0, 100);
    const result = simpleCalculator({
      a,
      b,
      action: Action.Subtract,
    });
    expect(result).toBe(a - b);
  });

  test('should multiply two numbers', () => {
    const [a, b] = getRandomOperands(0, 100);
    const result = simpleCalculator({
      a,
      b,
      action: Action.Multiply,
    });
    expect(result).toBe(a * b);
  });

  test('should divide two numbers', () => {
    const [a, b] = getRandomOperands(0, 100);
    const result = simpleCalculator({
      a,
      b,
      action: Action.Divide,
    });
    expect(result).toBe(a / b);
  });

  test('should exponentiate two numbers', () => {
    const [a, b] = getRandomOperands(0, 100);
    const result = simpleCalculator({
      a,
      b,
      action: Action.Exponentiate,
    });
    expect(result).toBe(a ** b);
  });

  test('should return null for invalid action', () => {
    const [a, b] = getRandomOperands(0, 100);
    const result = simpleCalculator({
      a,
      b,
      action: 'wrongActionType',
    });
    expect(result).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    const result = simpleCalculator({
      a: null,
      b: undefined,
      action: Action.Exponentiate,
    });
    expect(result).toBeNull();
  });
});

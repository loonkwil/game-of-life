import clamp from './clamp';

describe('clamp', () => {
  test('it should clamp the number', () => {
    expect(clamp(0, { min: -1, max: 1 })).toBe(0);
    expect(clamp(-1.1, { min: -1, max: 1 })).toBe(-1);
    expect(clamp(1.1, { min: -1, max: 1 })).toBe(1);
  });

  test('the min argument should have a default value', () => {
    expect(clamp(10, { min: 0 })).toBe(10);
    expect(clamp(-10, { min: 0 })).toBe(0);
  });

  test('the max argument should have a default value', () => {
    expect(clamp(10, { max: 0 })).toBe(0);
    expect(clamp(-10, { max: 0 })).toBe(-10);
  });
});

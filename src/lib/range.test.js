import range from './range';

describe('range', () => {
  test('it should create the range', () => {
    expect(range(1, 2)).toEqual([1]);
  });

  test('it should work with negative numbers', () => {
    expect(range(-1, 2)).toEqual([-1, 0, 1]);
  });

  test('it should create an empty range if the start and the end is equal', () => {
    expect(range(1, 1)).toHaveLength(0);
  });
});

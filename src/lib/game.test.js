import { vi } from 'vitest';
import { toString, fromString, createIterator, get, toggle, next } from './game';

describe('isSupported', () => {
  const originalBigInt = BigInt;

  beforeEach(() => {
    global.BigInt = undefined;
    vi.resetModules();
  });

  afterEach(() => {
    global.BigInt = originalBigInt;
  });

  test('it should be false if BigInt is not supported', async () => {
    const { isSupported } = await import('./game');
    expect(isSupported).toBe(false);
  });
});

describe('toString', () => {
  test('it should print the board', () => {
    const str = '. x . \n. . x \nx x x';
    expect(toString(fromString(str))).toBe(str);
  });
});

describe('createIterator', () => {
  test('it should contain all the cells', () => {
    const game = fromString(`
       . . . 
       . . . 
       . . . 
    `);
    expect(Array.from(createIterator(game))).toHaveLength(9);
  });

  test('it should contain the x, y and the value property', () => {
    const game = fromString(`
       0 . . . x 
       1 . x . . 
       2 . . x . 
       3 . . . . 
         0 1 2 3
    `);

    const arr = Array.from(createIterator(game));
    expect(arr[3]).toEqual({ x: 3, y: 0, value: true });
    expect(arr[4]).toEqual({ x: 0, y: 1, value: false });
  });
});

describe('get', () => {
  test('it should return with the value of the cell', () => {
    const game = fromString(`
       0 . . . . 
       1 . . . . 
       2 .[x]. . 
       3 . . . . 
         0 1 2 3
    `);

    expect(get(game, [1, 1])).toBe(false);
    expect(get(game, [1, 2])).toBe(true);
  });

  test.each(['3x3/g', '3x/0', '3'])(
    'it should not throw an error if the game representation is invalid',
    (game) => {
      expect(() => get(game, [0, 0])).not.toThrow();
    }
  );

  test('it should return false if the coordinates are invalid', () => {
    const game = fromString(`
        . . .
        . x .
        . . .
      `);
    expect(get(game, [4, 5])).toBe(false);
  });
});

describe('toggle', () => {
  test('it should switch the state of the cell', () => {
    const game = fromString(`
       0 . . . . 
       1 . . . . 
       2 . . .[x] 
       3 .[.]. . 
         0 1 2 3
    `);

    expect(get(toggle(game, [1, 3]), [1, 3])).toBe(true);
    expect(get(toggle(game, [3, 2]), [3, 2])).toBe(false);
  });

  test.each(['3x3/g', '3x/0', '3'])(
    'it should not throw an error if the game representation is invalid',
    (game) => {
      expect(() => toggle(game, [0, 0])).not.toThrow();
    }
  );

  test('it should not do anything if the coordinates are invalid', () => {
    const game = fromString(`
      . . .
      . x .
      . . .
    `);
    expect(toggle(game, [4, 5])).toBe(game);
  });

  test('it should work with large boards', () => {
    const game = '256x256/0';
    const coordinates = [255, 255];
    expect(get(toggle(game, coordinates), coordinates)).toBe(true);
  });
});

describe('next', () => {
  test('Any live cell with fewer than two live neighbours dies, as if by underpopulation.', () => {
    const game = fromString(`
       0 . . . . 
       1 . .[x]. 
       2 x . . . 
       3 .[x]. . 
         0 1 2 3
    `);

    const nextIteration = next(game);
    expect(get(nextIteration, [2, 1])).toBe(false);
    expect(get(nextIteration, [1, 3])).toBe(false);
  });

  test('Any live cell with two or three live neighbours lives on to the next generation.', () => {
    const game = fromString(`
       0 . . . . 
       1 . . x . 
       2 x[x]. . 
       3 .[x]. . 
         0 1 2 3
    `);

    const nextIteration = next(game);
    expect(get(nextIteration, [1, 2])).toBe(true);
    expect(get(nextIteration, [1, 3])).toBe(true);
  });

  test('Any live cell with more than three live neighbours dies, as if by overpopulation.', () => {
    const game = fromString(`
       0 x x . . 
       1 .[x]x . 
       2 x[x]. . 
       3 . x . . 
         0 1 2 3
    `);

    const nextIteration = next(game);
    expect(get(nextIteration, [1, 2])).toBe(false);
    expect(get(nextIteration, [1, 1])).toBe(false);
  });

  test('Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.', () => {
    const game = fromString(`
       0 . .[.]x 
       1 . x[.]x 
       2 . . x . 
       3 . . . . 
         0 1 2 3
    `);

    const nextIteration = next(game);
    expect(get(nextIteration, [2, 1])).toBe(false);
    expect(get(nextIteration, [2, 0])).toBe(true);
  });
});

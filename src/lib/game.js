/**
 * The coordinates of the board looks like this:
 *    0 1 2  x
 *  ┌─────────►
 * 0│ . x .
 * 1│ . . x
 * 2│ x x x
 *  │
 * y│
 *  ▼
 * The y-axis is flipped because it is easier to work with
 * (elements in HTML are also positioned this way).
 *
 * @typedef {Array<number>} Coordinates
 */

/**
 * One BigInt is used to store the state of the game.
 * If the board looks like this:
 *    0 1 2
 *  ┌──────
 * 0│ . x .
 * 1│ . . x
 * 2│ x x x
 * internally it will use the following BigInt to store the state of the game:
 * 0b111_100_010n
 *   ▲   ▲     ▲
 *   │   │     └─ (0, 0) the top-left corner of the board
 *   │   └─ (2, 1) the middle-right living cell
 *   └─ (2, 2) bottom-right corner of the board
 *
 * @typedef {BigInt} Board
 */

/**
 * @typedef {{ size: Array<number>, board: Board }} Game
 */

/**
 * A storable representation of a game.
 * "3x3/1e2"
 *  ▲ ▲ ▲
 *  │ │ └─state of the game (base 16 integer)
 *  │ └─number of rows
 *  └─number of columns
 *
 * @typedef {string} GameRepresentation
 */

export const isSupported = typeof BigInt === 'function';

/**
 * Generates a storable representation of the game.
 * @example
 * // returns "3x3/1e2"
 * serialize({ size: [3, 3], board: 0b111_100_010n })
 * @param {Game} game
 * @returns {GameRepresentation}
 */
function serialize({ size: [cols, rows], board }) {
  return `${cols}x${rows}/${board.toString(16)}`;
}

/**
 * @example
 * // returns { size: [3, 3], board: 0b111_100_010n }
 * unserialize("3x3/1e2")
 *
 * @param {GameRepresentation} str
 * @returns {Game}
 */
function unserialize(str) {
  const [, cols = '1', rows = '1', board = '0'] = str.match(/(\d+)x(\d+)\/([0-9a-f]+)/i) ?? [];
  return {
    size: [parseInt(cols, 10), parseInt(rows, 10)],
    board: BigInt(`0x${board}`)
  };
}

/**
 * @example
 * // returns
 * // `. x .
 * // . . x
 * // x x x`
 * console.log(toString("3x3/1e2"))
 *
 * @param {GameRepresentation} game
 * @returns {string}
 */
export function toString(game) {
  const {
    size: [cols, rows],
    board
  } = unserialize(game);
  const length = cols * rows;
  return Array.from({ length }, (_, i) => {
    const value = board & (1n << BigInt(i));
    return value ? 'x' : '.';
  })
    .join(' ')
    .replace(new RegExp(`(?:[.x][ ]){${cols}}`, 'g'), '$&\n');
}

/**
 * @example
 * // returns "3x3/1e2"
 * fromString(`
 *   . x .
 *   . . x
 *   x x x
 * `)
 *
 * @param {string} str - ASCII representation of the board
 * @returns {GameRepresentation}
 */
export function fromString(str) {
  const collapsed = str.replaceAll(/[^.x\n]+/gi, '').trim();

  const oneline = collapsed.replaceAll('\n', '');
  const rows = collapsed.length - oneline.length + 1;
  const cols = oneline.length / rows;

  const board = oneline.split('').reduce((soFar, chr, i) => {
    const value = chr === '.' ? 0n : 1n;
    return soFar | (value << BigInt(i));
  }, 0n);

  return serialize({ size: [cols, rows], board });
}

/**
 * @example
 * // returns [{ x: 0, y: 0, value: true }]
 * Array.from(createIterator("1x1/1"))
 *
 * @param {GameRepresentation} game
 * @yields {{ x: number, y: number, value: boolean }}
 */
export function* createIterator(game) {
  const {
    size: [cols, rows],
    board
  } = unserialize(game);
  const length = cols * rows;
  for (let i = 0; i < length; i += 1) {
    const value = !!(board & (1n << BigInt(i)));
    const x = i % rows;
    const y = Math.trunc(i / cols);
    yield { value, x, y };
  }
}

/**
 * Get the value of the cell.
 * @example
 * // returns false
 * get("3x3/1e2", [0, 1])
 *
 * @param {GameRepresentation} game
 * @param {Coordinates} cell
 * @returns {boolean} - true: live, false: dead
 */
export function get(game, [x, y]) {
  const { size, board } = unserialize(game);
  const index = y * size[0] + x;
  return !!(board & (1n << BigInt(index)));
}

/**
 * Toggle the value of the cell
 * @example
 * // returns "3x3/1e0"
 * toggle("3x3/1e2", [1, 0])
 *
 * @param {GameRepresentation} game
 * @param {Coordinates} cell
 * @returns {GameRepresentation}
 */
export function toggle(game, [x, y]) {
  const { size, board } = unserialize(game);
  const index = y * size[0] + x;
  const validCells = 2n ** BigInt(size[0] * size[1]) - 1n;
  const nextBoard = board ^ ((1n << BigInt(index)) & validCells);
  return serialize({ size, board: nextBoard });
}

/**
 * Calculate the next state of the game.
 * Rules:
 *  * Any live cell with two or three live neighbors survives.
 *  * Any dead cell with three live neighbors becomes a live cell.
 *  * All other live cells die in the next generation. Similarly, all other dead cells stay dead.
 * @example
 * // returns "3x3/1a8"
 * next("3x3/1e2")
 *
 * @param {GameRepresentation} game
 * @returns {GameRepresentation}
 */
export function next(game) {
  const {
    size: [cols, rows],
    board
  } = unserialize(game);

  // If the board has 3 columns and 4 rows:
  // 0b110_110_110_110n
  const exceptLeftCol = BigInt(`0b${('1'.repeat(cols - 1) + '0').repeat(rows)}`);
  // 0b011_011_011_011n
  const exceptRightCol = BigInt(`0b${('0' + '1'.repeat(cols - 1)).repeat(rows)}`);
  // 0b000_111_111_111n
  const exceptLastRow = BigInt(`0b${'0'.repeat(cols) + '1'.repeat(cols * (rows - 1))}`);

  // Helper functionc to move the board around
  const n = (board) => board >> BigInt(cols);
  const e = (board) => (board & exceptRightCol) << 1n;
  const s = (board) => (board & exceptLastRow) << BigInt(cols);
  const w = (board) => (board & exceptLeftCol) >> 1n;

  // prettier-ignore
  const neighbors = [
    n(w(board)), n(board), n(e(board)),
      w(board),              e(board),
    s(w(board)), s(board), s(e(board)),
  ];

  // Count neighbor cells
  let atLeastOne = 0n;
  let atLeastTwo = 0n;
  let atLeastThree = 0n;
  let moreThanThree = 0n;
  for (const neighbor of neighbors) {
    moreThanThree |= atLeastThree & neighbor;
    atLeastThree |= atLeastTwo & neighbor;
    atLeastTwo |= atLeastOne & neighbor;
    atLeastOne |= neighbor;
  }

  const nextBoard = (board | atLeastThree) & atLeastTwo & ~moreThanThree;
  return serialize({ size: [cols, rows], board: nextBoard });
}

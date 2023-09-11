/**
 * Restricts a number to be within a range
 *
 * @param {number} num
 * @param {{ min?: number, max?: number }} boundaries
 * @returns {number}
 */
export default function clamp(num, { min = -Infinity, max = Infinity }) {
  return Math.max(Math.min(num, max), min);
}

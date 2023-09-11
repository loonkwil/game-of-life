/**
 * Returns a list of numbers from "start" (inclusive) to "end" (exclusive)
 *
 * @param {number} start
 * @param {number} end
 * @returns {Array<number>}
 */
export default function range(start, end) {
  const length = Math.abs(end - start);
  return Array.from({ length }, (_, i) => start + i);
}

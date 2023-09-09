import { error } from '@sveltejs/kit';

const sizeLimit = 64;

/**
 * @param {string} size
 * @returns {Array<number>}
 */
function parseSize(size) {
  const matches = size.match(/(?<cols>\d+)x(?<rows>\d+)/i);
  const { cols, rows } = matches?.groups ?? {};
  return [parseInt(cols, 10), parseInt(rows, 10)];
}

/**
 * @param {string|undefined} state
 * @returns {string}
 */
function parseState(state) {
  return state ? state.toLowerCase() : '0';
}

/**
 * @param {string|undefined} render
 * @returns {string}
 */
function parseRenderType(render) {
  return render ? render.toLowerCase() : 'csr';
}

/** @type {import('./$types').PageLoad} */
export function load({ params: { initialSize, initialState, renderType } }) {
  const [cols, rows] = parseSize(initialSize);
  if (Number.isNaN(cols) || cols > sizeLimit || Number.isNaN(rows) || rows > sizeLimit) {
    throw error(400, 'Bad Request');
  }

  const state = parseState(initialState);
  const preferSSR = parseRenderType(renderType) === 'ssr';
  return {
    size: [cols, rows],
    game: `${cols}x${rows}/${state}`,
    preferSSR
  };
}

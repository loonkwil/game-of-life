import clamp from '$lib/clamp';

/** @type {Object.<string, [number, number]>} */
const movements = {
  ArrowUp: [0, -1],
  ArrowRight: [1, 0],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  Home: [-Infinity, 0],
  'Ctrl+Home': [-Infinity, -Infinity],
  End: [Infinity, 0],
  'Ctrl+End': [Infinity, Infinity]
};

/**
 * @type {import('svelte/action').Action<HTMLElement>}
 */
export default function rovingTabindex(node) {
  const rows = node.querySelectorAll('[aria-rowindex]').length;
  const cols = node.querySelectorAll('[aria-colindex]').length / rows;

  /** @type {[number, number]} */
  let active;

  /**
   * Get the active (focusable) cell
   * @returns {HTMLElement}
   */
  function get() {
    const [x, y] = active;
    return node.querySelector(`[aria-rowindex="${y + 1}"] [aria-colindex="${x + 1}"] [tabindex]`);
  }

  /**
   * Set the active cell
   * @param {number} x
   * @param {number} y
   * @returns {HTMLElement}
   */
  function set(x, y) {
    node.querySelectorAll('[tabindex="0"]').forEach((el) => el.setAttribute('tabindex', '-1'));

    active = [clamp(x, { min: 0, max: cols - 1 }), clamp(y, { min: 0, max: rows - 1 })];

    const el = get();
    el.setAttribute('tabindex', '0');
    return el;
  }

  /** @param {KeyboardEvent} e */
  function handleKeyDown(e) {
    if (e.altKey) {
      return;
    }

    const shortcut = `${e.ctrlKey ? 'Ctrl+' : ''}${e.key}`;
    const delta = movements[shortcut];
    if (!delta) {
      return;
    }

    e.preventDefault();
    set(active[0] + delta[0], active[1] + delta[1]).focus();
  }

  set(Math.floor(rows / 2), Math.floor(cols / 2));

  node.addEventListener('keydown', handleKeyDown);
  return {
    destroy() {
      node.removeEventListener('keydown', handleKeyDown);
    }
  };
}

/** @typedef {Object.<string, any>} Attrs */

/**
 * @type {import('svelte/action').Action<HTMLElement, Attrs>}
 */
export default function dynamicAttrs(node, initialAttrs) {
  let prevAttrs = {};

  /** @type {function(Attrs): void} */
  const update = (attrs) => {
    Object.keys(prevAttrs).forEach((key) => node.removeAttribute(key));

    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    prevAttrs = attrs;
  };
  update(initialAttrs);

  return { update };
}

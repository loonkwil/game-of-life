/**
 * @type {import('svelte/action').Action<HTMLElement>}
 */
export default function spaceClick(node) {
  /** @type {function(KeyboardEvent): void} */
  const handleKeyDown = (e) => {
    if (e.altKey || e.key !== ' ') {
      return;
    }

    e.preventDefault();
    node.click();
  };

  node.addEventListener('keydown', handleKeyDown);
  return {
    destroy() {
      node.removeEventListener('keydown', handleKeyDown);
    }
  };
}

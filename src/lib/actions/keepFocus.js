/** @returns {number} */
const now = () => performance.now();

const threshold = 100;

/**
 * @type {import('svelte/action').Action<HTMLElement>}
 */
export default function keepFocus(node) {
  const controller = new AbortController();
  const { signal } = controller;

  let focused = 0;
  let clicked = 0;

  node.addEventListener('focus', () => (focused = now()), { signal });
  node.addEventListener('click', () => (clicked = now()), { signal });
  node.addEventListener(
    'blur',
    () => {
      const focusTriggeredByMouse = clicked - focused < threshold;
      const blurTriggeredByClick = now() - clicked < threshold;
      if (!focusTriggeredByMouse && blurTriggeredByClick) {
        node.focus();
      }
    },
    { signal }
  );

  return {
    destroy() {
      controller.abort();
    }
  };
}

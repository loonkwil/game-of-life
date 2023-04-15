<script>
  import { page } from '$app/stores';
  import { next, toggle, createIterator } from '$lib/game';
  import Toggle from '$lib/components/Toggle.svelte';

  $: ({
    data: { size, game, preferSSR }
  } = $page);

  $: sveltekitReloadAttr = preferSSR ? '' : null;

  /**
   * @param {import('$lib/game').Game} game
   * @param {boolean=} ssr
   * @returns {string}
   */
  $: generateURL = (game, ssr = preferSSR) => `/${game}${ssr ? '/ssr' : ''}`;
</script>

<section
  id="board"
  style="--columns: {size[0]}; --rows: {size[1]}"
  data-sveltekit-reload={sveltekitReloadAttr}
>
  {#each [...createIterator(game)] as { x, y, value }, index (index)}
    <a
      href={generateURL(toggle(game, [x, y]))}
      aria-label={`Toggle the value of the (${x}, ${y}) cell`}
      class="clickable">{value ? 'x' : ''}</a
    >
  {/each}
</section>

<section id="next" data-sveltekit-reload={sveltekitReloadAttr}>
  <a
    href={generateURL(next(game))}
    aria-label="Generate the next state of the game"
    class="clickable">Next</a
  >
</section>

<section id="footer" data-sveltekit-reload={sveltekitReloadAttr}>
  <a href={generateURL(game, !preferSSR)}>
    <Toggle checked={!preferSSR} />
    Prefer client side rendering (disable to see how SSR works)
  </a>
</section>

<style>
  #board {
    display: grid;
    grid-template-columns: repeat(var(--columns), 1fr);
    gap: 0.2rem;
    font-size: 0;
    aspect-ratio: var(--columns) / var(--rows);
  }

  #board > * {
    border-radius: 20%;
    background: var(--live-cell-color);
  }

  #board > *:empty {
    background: var(--dead-cell-color);
  }

  #next a {
    padding: 0.5rem;
    border-radius: 0.5rem;
    background: var(--button-bg-color);
    font-size: 3rem;
    text-align: center;
  }

  #footer a {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5rem;
    align-items: center;
    cursor: pointer;
    user-select: none;
  }
</style>

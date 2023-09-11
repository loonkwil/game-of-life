<script>
  import { page } from '$app/stores';
  import { next, toggle, get } from '$lib/game';
  import { spaceClick, dynamicAttrs, rovingTabIndex, keepFocus } from '$lib/actions';
  import range from '$lib/range';
  import Toggle from '$lib/components/Toggle.svelte';

  $: ({
    data: { size, game, preferSSR }
  } = $page);

  $: sveltekitReloadAttr = preferSSR ? '' : null;

  /**
   * @type {function(import('$lib/game').GameRepresentation, boolean=): string}
   */
  $: generateURL = (game, ssr = preferSSR) => `/${game}${ssr ? '/ssr' : ''}`;
</script>

<section id="board" role="grid" data-sveltekit-reload={sveltekitReloadAttr} use:rovingTabIndex>
  {#each range(0, size[1]) as y}
    <div role="row" aria-rowindex={y + 1}>
      {#each range(0, size[0]) as x}
        {@const value = get(game, [x, y])}
        <div role="gridcell" aria-colindex={x + 1}>
          <a
            href={generateURL(toggle(game, [x, y]))}
            class="clickable"
            aria-label={`${value ? 'Live' : 'Dead'} cell`}
            tabindex="-1"
            use:dynamicAttrs={preferSSR ? {} : { role: 'button', 'aria-pressed': value }}
            use:spaceClick
            use:keepFocus>{value ? 'x' : ''}</a
          >
        </div>
      {/each}
    </div>
  {/each}
</section>

<section id="next" data-sveltekit-reload={sveltekitReloadAttr}>
  <a
    href={generateURL(next(game))}
    class="clickable"
    aria-label="Generate the next state of the game"
    tabindex="0"
    use:dynamicAttrs={preferSSR ? {} : { role: 'button' }}
    use:spaceClick
    use:keepFocus>Next</a
  >
</section>

<section id="footer" data-sveltekit-reload={sveltekitReloadAttr}>
  <a
    href={generateURL(game, !preferSSR)}
    tabindex="0"
    use:dynamicAttrs={preferSSR ? {} : { role: 'switch', 'aria-checked': true }}
    use:spaceClick
    use:keepFocus
  >
    <Toggle checked={!preferSSR} />
    Prefer client side rendering (disable to see how SSR works)
  </a>
</section>

<style>
  #board {
    display: flex;
    flex-direction: column;
    font-size: 0;
    gap: 0.2rem;
  }

  #board [role='row'] {
    display: flex;
    gap: 0.2rem;
  }

  #board [role='gridcell'] {
    flex: 1;
  }

  #board [role='gridcell'] > a {
    display: inline-block;
    width: 100%;
    aspect-ratio: 1;
    border-radius: 20%;
    background: var(--live-cell-color);
    transition: background-color 0.2s;
  }

  #board [role='gridcell'] > a:empty {
    background: var(--dead-cell-color);
  }

  @media (prefers-reduced-motion: reduce) {
    #board * {
      transition-duration: 0ms;
    }
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

  #footer a:focus-visible {
    outline: none;
    color: var(--active-color);
  }
</style>

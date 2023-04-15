<script>
  export let checked = true;
</script>

<span class="toggle" class:checked />

<style>
  .toggle {
    --slider-diameter: 1.5rem;
    --toggle-width: calc(var(--slider-diameter) * 1.7);

    display: inline-block;
    padding: 0;
    width: var(--toggle-width);
    height: var(--slider-diameter);
    border: 2px solid var(--border-color);
    border-radius: 100vw;
    cursor: pointer;
    background-color: var(--background);
    transition-property: background-color, translate;
    transition-duration: 200ms;
  }

  .toggle:before {
    content: '';
    display: block;
    margin: -2px;
    width: var(--slider-diameter);
    height: var(--slider-diameter);
    border: 2px solid var(--border-color);
    border-radius: 50%;
    background-color: var(--button-bg-color);
    translate: 0;
    transition: inherit;
  }

  .checked {
    background-color: var(--green);
  }

  .checked::before {
    translate: calc(var(--toggle-width) - var(--slider-diameter));
  }

  @media (prefers-reduced-motion: reduce) {
    .toggle {
      transition-duration: 0ms;
    }
  }
</style>

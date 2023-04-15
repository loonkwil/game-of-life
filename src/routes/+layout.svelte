<script>
  import './reset.css';
  import './styles.css';
</script>

<main>
  <slot />
</main>

<style>
  main {
    display: grid;
    grid-template-rows: 1fr;
    justify-content: center;
    padding: 0.5rem;
    gap: 1.5rem;
  }
</style>

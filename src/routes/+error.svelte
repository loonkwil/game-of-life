<script>
  import { page } from '$app/stores';

  const message = `${$page.status} ${$page.error?.message ?? 'Something went wrong'}`;
</script>

<h2>(._. )</h2>
<p>{message}</p>

<style>
  h2 {
    font-weight: normal;
    font-size: 6rem;
    margin-bottom: 0;
    text-align: center;
    white-space: nowrap;
  }

  p {
    margin: 0;
    text-align: center;
  }
</style>

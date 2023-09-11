<script>
  import { page } from '$app/stores';

  const message = `${$page.status} ${$page.error?.message ?? 'Something went wrong'}`;
</script>

<div aria-hidden="true">(._. )</div>
<p>{message}</p>

<style>
  div {
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

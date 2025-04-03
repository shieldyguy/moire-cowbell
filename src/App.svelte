<script>
  import PatternManager from "./components/PatternManager.svelte";
</script>

<svelte:head>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
  />
</svelte:head>

<main>
  <PatternManager />
</main>

<style>
  :global(html),
  :global(body) {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: fixed;
  }

  main {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
  }
</style>

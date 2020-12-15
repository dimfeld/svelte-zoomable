<script>
  import Content from "./Content.svelte";

  export let items;
</script>

<style>
  .items {
    column-count: auto;
    column-width: 24ch;
    padding: 0.5rem 2ch;
    height: 100%;
  }
</style>

<div class="items">
  {#each items as i}
    <Content data={i} />
  {/each}
</div>

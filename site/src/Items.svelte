<script>
  import Content from "./Content.svelte";

  export let items;
</script>

<style>
  .items {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: stretch;
    padding: 0.5rem 2ch;
    height: 100%;
    gap: 10px;
  }
</style>

<div class="items">
  {#each items as i}
    <div class="item">
      <Content data={i} />
    </div>
  {/each}
</div>

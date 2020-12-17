<script>
  import Content from './Content.svelte';

  export let items;
</script>

<style>
  .items {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: stretch;
    flex-grow: 1;
    max-height: 100%;
  }
</style>

<div class="items">
  {#each items as i}
    <div class="item">
      <Content data={i} />
    </div>
  {/each}
</div>

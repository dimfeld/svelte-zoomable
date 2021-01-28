<script>
  import Zoomable from '../../src/Zoomable.svelte';
  export let items;
</script>

<section class="items">
  {#each items as item}
    <div class="item">
      <Zoomable id={item.id} title={item.name}>
        <div slot="overview">
          {item.name}
        </div>

        <div slot="detail">
          {#if item.children}
            <svelte:self items={item.children} />
          {:else}
            <h1>{item.name}</h1>
            <article>{item.text}</article>
          {/if}
        </div>
      </Zoomable>
    </div>
  {/each}
</section>

<style>
  .items {
    display: grid;
    grid-template-columns: 3;
    gap: 1rem;
  }
</style>

<script>
  import Zoomable from '../../src/Zoomable.svelte';
  export let items;
</script>

<section class="items">
  {#each items as item}
    <div class="item">
      <Zoomable id={item.id} title={item.name}>
        <div class="overview" slot="overview">
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
    position: relative;
    display: grid;
    width: 14rem;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .overview {
    height: 6rem;
    width: 6rem;
    border: 1px solid gray;
    cursor: pointer;
  }

  .overview:hover {
    background-color: lightgray;
  }
</style>

<script>
  import Zoomable from "../src/Zoomable.svelte";
  import Items from "./Items.svelte";

  export let data;

  function dashes(c, max = 20) {
    return new Array(c.length).fill("-").join("").slice(0, max);
  }
</script>

<style>
  .overview {
    cursor: default;
    border: transparent solid 2px;
  }

  .overview:hover {
    border: red solid 2px;
  }
</style>

<Zoomable id={data.id} title={data.title}>
  <div class="overview" slot="overview">
    {data.title}
    {#if data.children}
      {#each data.children.map((c) => c.title) as c}
        <p>{c}</p>
      {/each}
    {:else}
      {#each [].concat(data.content) as c}
        <p class="overview-line">{c}</p>
      {/each}
    {/if}
  </div>

  <div slot="detail" let:back>
    <button type="button" on:click={back}>Back</button>
    {#if data.children}
      <Items items={data.children} />
    {:else}
      <h1>{data.title}</h1>
      <p>{data.content}</p>
    {/if}
  </div>
</Zoomable>

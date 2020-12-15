<script>
  import Zoomable from "../src/Zoomable.svelte";
  import Items from "./Items.svelte";

  export let data;

  function dashes(c, max = 20) {
    return new Array(c.length).fill("-").join("").slice(0, max);
  }
</script>

<style>
  div {
    break-inside: avoid;
    padding: 0.5rem;
  }

  .detail {
    width: 100%;
    height: 100%;
  }

  .overview {
    border: #aaa solid 1px;
    cursor: default;
  }

  .overview:hover {
    border: black solid 1px;
  }
</style>

<Zoomable id={data.id} title={data.title}>
  <div class="overview" slot="overview">
    {data.title}
    {#if data.children}
      {#each data.children.map((c) => c.title) as c}
        <p>{dashes(c)}</p>
      {/each}
    {:else}
      {#each [].concat(data.content) as c}
        <p class="overview-line">{c}</p>
      {/each}
    {/if}
  </div>

  <div class="detail" slot="detail" let:back let:title>
    <button type="button" on:click={back}>Back to
      {title.slice(0, -1).join(' > ') || 'top'}</button>
    {#if data.children}
      <Items items={data.children} />
    {:else}
      <h1>{data.title}</h1>
      <p>{data.content}</p>
    {/if}
  </div>
</Zoomable>

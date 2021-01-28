<script>
  export let zoomManager;
  export let rootTitle = 'Top';

  $: titles = [rootTitle, ...($zoomManager?.title || [])];

  function setPath(index) {
    if (index < titles.length - 1) {
      let newPath = $zoomManager.path.slice(0, index);
      console.log(newPath);
      zoomManager.set(newPath);
    }
  }
</script>

<nav>
  {#each titles as title, index}
    <span on:click={() => setPath(index)}
      ><slot name="title" {title} {index}
        ><span class:nav-item={index < titles.length - 1}>{title}</span></slot
      ></span
    >
    {#if index != titles.length - 1}
      <slot name="join"><span> &gt; </span></slot>
    {/if}
  {/each}
</nav>

<style>
  .nav-item {
    cursor: pointer;
  }

  .nav-item:hover {
    text-decoration: underline;
  }
</style>

<script>
  import { fade } from 'svelte/transition';

  import ZoomableContainer from '../../src/ZoomableContainer.svelte';
  import { presets } from '../../src/transition';
  import Items from './Items.svelte';

  const data = [
    {
      id: 'fruit',
      title: 'Fruits',
      children: [
        {
          id: 'apple',
          title: 'Apple',
          content: ['Apples are good!'],
        },
        {
          id: 'banana',
          title: 'Banana',
          content: ['Bananas are yellow'],
        },
      ],
    },
    {
      id: 'meat',
      title: 'Meat',
      children: [
        {
          id: 'beef',
          title: 'Beef',
          content: ['Moo'],
        },
        {
          id: 'poultry',
          title: 'Poultry',
          children: [
            {
              id: 'chicken',
              title: 'Chicken',
              content: 'Bok bok bok',
            },
            {
              id: 'turkey',
              title: 'Turkey',
              content: 'Baste often!',
            },
          ],
        },
        {
          id: 'pork',
          title: 'Pork',
          content: 'Oink',
        },
      ],
    },
  ];

  let zoomPresetId = 'mergeSiblingsSeries';
  const zoomPresetIds = {
    crossfade: 'Crossfade',
    fade: 'Simple Fade',
    zoomExperimental: 'Experimental WIP Zoom',
    mergeSiblingsParallel: 'Parallel Sibling Merge',
    mergeSiblingsSeries: 'Serial Sibling Merge',
  };

  $: zoomPreset = presets[zoomPresetId];

  let zoomManager;
</script>

<div id="app">
  <header>
    <h3 id="title">
      {#if $zoomManager?.path.length === 0}
        Click to zoom
      {:else if $zoomManager?.title}{$zoomManager.title.join(' > ')}{/if}
    </h3>

    <label>
      <span>Choose a Zoom Preset</span>
      <select bind:value={zoomPresetId}>
        {#each Object.entries(zoomPresetIds) as [id, label]}
          <option value={id}>{label}</option>
        {/each}
      </select>
    </label>
  </header>

  <main>
    <ZoomableContainer bind:zoomManager transitionPreset={zoomPreset}>
      <Items items={data} />
    </ZoomableContainer>
  </main>
</div>

<style>
  :global(body) {
    margin: 0px;
    padding: 0px;
  }

  :global(*) {
    box-sizing: border-box;
  }

  #app {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-rows: 3rem 1fr;
  }

  header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding: 1rem 0.5rem;
  }

  main {
    position: relative;
    place-self: stretch;
    margin: 0px 1rem 1rem;
  }

  #title {
    margin: 5px 10px;
  }
</style>

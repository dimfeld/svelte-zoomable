<script>
  import { presets } from '../../src/transition';
  import { Route } from 'tinro';
  import NestedFoods from './NestedFoods.svelte';
  import ZoomGrid from './ZoomGrid.svelte';

  let zoomPresetId = 'mergeSiblingsParallel';
  const zoomPresetIds = {
    crossfade: 'Crossfade',
    fade: 'Simple Fade',
    zoomExperimental: 'Experimental WIP Zoom',
    mergeSiblingsParallel: 'Parallel Sibling Merge',
    // mergeSiblingsSeries: 'Serial Sibling Merge',
  };

  $: zoomPreset = presets[zoomPresetId];

  let zoomManager = writable(null);
</script>

<div id="app">
  <header>
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
    <Route>
      <Route path="/foods"><NestedFoods {zoomPreset} /></Route>
      <Route fallback><ZoomGrid {zoomPreset} /></Route>
    </Route>
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

<script>
  import { writable } from 'svelte/store';
  import { presets } from '../../src/transition';
  import { active, Route } from 'tinro';
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

    <nav>
      <span>Examples:</span>
      <a href="/foods" use:active>Foods</a>
      <a href="/grid" use:active>Grid</a>
    </nav>
  </header>

  <main>
    <Route path="/foods"><NestedFoods {zoomPreset} /></Route>
    <Route path="/grid"><ZoomGrid {zoomPreset} /></Route>
    <Route path="/" redirect="/grid" />
  </main>
</div>

<style>
  :global(body) {
    margin: 0px;
    padding: 0px;
  }

  :global(*) {
    box-sizing: border-box;
    position: relative;
  }

  #app {
    width: 100%;
    height: 100vh;
    display: grid;
    grid-template-rows: 3rem 1fr;
    font-family: sans-serif;
  }

  header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding: 1rem 0.5rem;
  }

  nav > a {
    padding: 0.5rem 0.5rem;
    font-weight: 500;
    text-transform: uppercase;
    color: #888;
  }

  nav > a:hover {
    background-color: #ddd;
  }

  nav > :global(a.active) {
    background-color: #eeeeee;
  }

  main {
    place-self: stretch;
    margin: 0px 1rem 1rem;
  }

  #title {
    margin: 5px 10px;
  }
</style>

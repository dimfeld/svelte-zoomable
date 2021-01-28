<script>
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import {
    createZoomManager,
    zoomManagerContext,
    zoomParentContext,
    zoomTransitionContext,
  } from './zoomManager';
  import { presets } from './transition';

  export let zoomManager = createZoomManager();
  export let transitionPreset = presets.fade;
  setContext(zoomManagerContext, zoomManager);
  setContext(zoomParentContext, { id: [], fullTitle: [], title: '' });

  let transitionPresetStore = writable(transitionPreset);
  $: $transitionPresetStore = transitionPreset;
  setContext(zoomTransitionContext, transitionPresetStore);
</script>

<div>
  <slot />
</div>

<style>
  div {
    position: relative;
    /* Create a new containing block for position:fixed */
    transform: translate(0px, 0px);
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>

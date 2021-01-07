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

<style>
  div {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>

<div>
  <slot />
</div>

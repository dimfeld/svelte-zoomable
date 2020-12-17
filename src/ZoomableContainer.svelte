<script>
  import { setContext } from 'svelte';
  import {
    createZoomManager,
    zoomManagerContext,
    zoomParentContext,
  } from './zoomManager';

  export let zoomManager = createZoomManager();
  setContext(zoomManagerContext, zoomManager);
  setContext(zoomParentContext, { id: [], fullTitle: [], title: '' });
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

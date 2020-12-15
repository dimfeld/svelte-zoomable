<script>
  import { setContext } from "svelte";
  import {
    createZoomManager,
    zoomManagerContext,
    zoomParentContext,
  } from "./zoomManager";

  export let zoomManager = createZoomManager();
  setContext(zoomManagerContext, zoomManager);
  setContext(zoomParentContext, { id: [], fullTitle: [], title: "" });
</script>

<slot />

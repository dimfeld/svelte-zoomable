<script>
  import { setContext } from "svelte";
  import { createZoomManager } from "../zoomManager";

  setContext("zoom-parent", { id: "", fullTitle: [], title: "" });

  export let zoomManager = getContext("zoom-manager");
  if (!zoomManager) {
    zoomManager = createZoomManager();
    setContext("zoom-manager", zoomManager);
  }
</script>

<style>
</style>

<div>
  <slot />
</div>

<script>
  import { crossfade } from "svelte/transition";
  import { getContext, setContext, createEventDispatcher } from "svelte";

  export let id;
  export let title;
  export let zoomed = false;
  /** Set to false to handle the zoom manually */
  export let zoomInOnClick = true;

  const dispatch = createEventDispatcher();

  const zoomManager = getContext("zoom-manager");
  const parent = getContext("zoom-parent");
  const fullId = parent.id ? `${parent.id}.${id}` : id;

  setContext("zoom-parent", {
    id: fullId,
    title,
    fullTitle: [...parent.fullTitle, title],
  });

  const [send, receive] = crossfade({
    duration,
  });

  onMount(() => {
    let unregister = zoomManager.register(fullId, (newZoom) => {
      zoomed = newZoom;
      if (newZoom) {
        dispatch("zoom-in");
      } else {
        dispatch("zoom-out");
      }
    });

    return unregister;
  });

  function handleSummaryClick() {
    if (zoomInOnClick) {
      zoomManager.set(fullId);
    }
  }
</script>

<style>
  .zoomed {
    position: absolute;
    top: 0%;
    bottom: 100%;
    left: 0%;
    right: 100%;
  }
</style>

{#if zoomed}
  <div
    class="zoomed"
    in:receive|local={{ key: fullId }}
    out:send|local={{ key: fullId }}>
    <slot name="zoomed">{title}</slot>
  </div>
{:else}
  <div
    on:click={handleSummaryClick}
    in:receive|local={{ key: fullId }}
    out:send|local={{ key: fullId }}>
    <slot name="overview" />
  </div>
{/if}

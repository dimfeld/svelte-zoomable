<script>
  import { crossfade } from "svelte/transition";
  import {
    onMount,
    getContext,
    setContext,
    createEventDispatcher,
  } from "svelte";
  import { zoomManagerContext, zoomParentContext } from "./zoomManager";

  export let id;
  export let title;

  export let zoomed = false;
  export let active = false;
  /** Set to false to handle the zoom manually */
  export let zoomInOnClick = true;

  const dispatch = createEventDispatcher();

  const zoomManager = getContext(zoomManagerContext);
  const parent = getContext(zoomParentContext);
  const fullId = [...parent.id, id];
  const fullTitle = [...parent.fullTitle, title];

  setContext(zoomParentContext, {
    id: fullId,
    title,
    fullTitle,
  });

  const [send, receive] = crossfade({
    duration: 400,
  });

  onMount(() => {
    let unregister = zoomManager.register({
      id: fullId,
      title: fullTitle,
      callback: ({ zoomed: newZoom, active: newActive }) => {
        active = newActive;

        if (zoomed !== newZoom) {
          zoomed = newZoom;
          if (newZoom) {
            dispatch("zoom-in");
          } else {
            dispatch("zoom-out");
          }
        }
        console.log(`${fullId.join(".")}: active ${active}, zoomed ${zoomed}`);
      },
    });

    return unregister;
  });

  function handleSummaryClick() {
    if (zoomInOnClick) {
      zoomManager.set(fullId);
    }
  }

  $: hide = !active && $zoomManager.path.join(".") !== parent.id.join(".");
</script>

<style>
  .zoomed {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    --z-index: calc(var(--z-index, 0) + 1);
    z-index: var(--z-index);
  }

  .hidden {
    visibility: hidden;
  }
</style>

{#if zoomed}
  <div
    class="zoomed"
    class:hidden={hide}
    in:receive|local={{ key: fullId }}
    out:send|local={{ key: fullId }}>
    <slot
      name="detail"
      {active}
      path={fullId}
      back={() => zoomManager.set(fullId.slice(0, -1))} />
  </div>
{:else}
  <div
    class:hidden={hide}
    on:click={handleSummaryClick}
    in:receive|local={{ key: fullId }}
    out:send|local={{ key: fullId }}>
    <slot name="overview" zoom={() => zoomManager.set(fullId)} />
  </div>
{/if}

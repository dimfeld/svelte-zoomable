<script>
  import { crossfade } from 'svelte/transition';
  import {
    onMount,
    getContext,
    setContext,
    createEventDispatcher,
  } from 'svelte';
  import { cubicIn, cubicOut } from 'svelte/easing';
  import { zoomTransition, overview, detail } from './transition';
  import { zoomManagerContext, zoomParentContext } from './zoomManager';

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
  const fullIdString = fullId.join('.');

  setContext(zoomParentContext, {
    id: fullId,
    title,
    fullTitle,
  });

  const [send, receive] = zoomTransition({
    duration: 200,
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
            dispatch('zoom-in');
          } else {
            dispatch('zoom-out');
          }
        }
        // console.log(`${fullId.join(".")}: active ${active}, zoomed ${zoomed}`);
      },
    });

    return unregister;
  });

  function handleSummaryClick() {
    if (zoomInOnClick) {
      zoomManager.set(fullId);
    }
  }

  $: hide = $zoomManager.path.join('.') !== parent.id.join('.');
</script>

<style>
  .zoomed {
    position: absolute;
    top: var(--zoomed-top, 0px);
    bottom: var(--zoomed-bottom, 0px);
    left: var(--zoomed-left, 0px);
    right: var(--zoomed-right, 0px);
  }

  .overview {
    position: relative;
  }

  .inactive {
    display: none;
  }
</style>

{#if zoomed}
  <div
    class="zoomed"
    id={fullId.join('-') + '-zoomed'}
    in:receive|local={{ key: fullIdString, style: detail, easing: cubicIn }}
    out:send|local={{ key: fullIdString, style: detail, easing: cubicOut }}>
    <slot
      name="detail"
      {active}
      path={fullId}
      title={fullTitle}
      back={() => zoomManager.set(fullId.slice(0, -1))} />
  </div>
{:else if !hide}
  <div
    class="overview"
    id={fullId.join('-') + '-overview'}
    on:click={handleSummaryClick}
    in:receive|local={{ key: fullIdString, style: overview, easing: cubicOut }}
    out:send|local={{ key: fullIdString, style: overview, easing: cubicIn }}>
    <slot name="overview" zoom={() => zoomManager.set(fullId)} />
  </div>
{/if}

<script>
  import { crossfade } from 'svelte/transition';
  import {
    onMount,
    getContext,
    setContext,
    createEventDispatcher,
  } from 'svelte';
  import { cubicIn, cubicOut } from 'svelte/easing';
  import { send, receive } from './transition';
  import { zoomManagerContext, zoomParentContext, zoomTransitionContext } from './zoomManager';
  import { style } from 'svelte-style-action';

  export let id;
  export let title;

  export let zoomed = false;
  export let active = false;
  /** Set to false to handle the zoom manually */
  export let zoomInOnClick = true;

  /** Class names to apply to the overview div element*/
  export let overviewClass = '';
  /** Styles to apply to the overview div element, as a string or an object */
  export let overviewStyle = undefined;
  /** Class names to apply to the detail div element*/
  export let detailClass = '';
  /** Styles to apply to the detail div element, as a string or an object */
  export let detailStyle = undefined;

  const dispatch = createEventDispatcher();

  const zoomManager = getContext(zoomManagerContext);
  const transitionPreset = getContext(zoomTransitionContext);
  const parent = getContext(zoomParentContext);
  export const fullId = [...parent.id, id];
  export const fullTitle = [...parent.fullTitle, title];
  const parentIdString = parent.id.join('.');
  const fullIdString = fullId.join('.');

  setContext(zoomParentContext, {
    id: fullId,
    title,
    fullTitle,
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
    class="zoomed {detailClass}"
    id={fullId.join('-') + '-zoomed'}
    use:style={detailStyle}
    in:receive|local={{ key: fullIdString, parent: parentIdString, isDetail: true, easing: cubicIn, preset: $transitionPreset }}
    out:send|local={{ key: fullIdString, parent: parentIdString, isDetail: true, easing: cubicOut, preset: $transitionPreset }}>
    <slot
      name="detail"
      {active}
      path={fullId}
      title={fullTitle}
      back={() => zoomManager.set(fullId.slice(0, -1))} />
  </div>
{:else if !hide}
  <div
    class="overview {overviewClass}"
    use:style={overviewStyle}
    id={fullId.join('-') + '-overview'}
    on:click={handleSummaryClick}
    in:receive|local={{ key: fullIdString, parent: parentIdString, easing: cubicOut, preset: $transitionPreset }}
    out:send|local={{ key: fullIdString, parent: parentIdString, easing: cubicIn, preset: $transitionPreset }}>
    <slot path={fullId} name="overview" zoom={() => zoomManager.set(fullId)} />
  </div>
{/if}

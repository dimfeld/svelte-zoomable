<script>
  import ZoomableContainer from '../../src/ZoomableContainer.svelte';
  import ZoomGridItems from './ZoomGridItems.svelte';
  import * as faker from 'faker';

  export let zoomPreset;
  let zoomManager;

  const minItems = 5;
  const maxItems = 12;
  function getNum() {
    return Math.round(Math.random() * (maxItems - minItems)) + minItems;
  }

  let items = Array.from({ length: getNum() }, (i0) => {
    return {
      id: i0,
      name: faker.company.companyName(),
      children: Array.from({ length: getNum() }, (i1) => {
        return {
          id: i1,
          name: faker.name.findName(),
          children: Array.from({ length: getNum() }, (i2) => {
            return {
              id: i2,
              name: faker.music.genre(),
              text: faker.lorem.paragraph(),
            };
          }),
        };
      }),
    };
  });
</script>

<h3 id="title">
  {#if $zoomManager?.path.length === 0}
    Click to zoom
  {:else if $zoomManager?.title}{$zoomManager.title.join(' > ')}{/if}
</h3>

<ZoomableContainer bind:zoomManager transitionPreset={zoomPreset}>
  <ZoomGridItems {items} />
</ZoomableContainer>

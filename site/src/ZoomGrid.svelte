<script>
  import ZoomableContainer from '../../src/ZoomableContainer.svelte';
  import Breadcrumbs from '../../src/Breadcrumbs.svelte';
  import ZoomGridItems from './ZoomGridItems.svelte';
  import faker from 'faker';

  export let zoomPreset;
  let zoomManager;

  const minItems = 5;
  const maxItems = 12;
  function getNum() {
    return Math.round(Math.random() * (maxItems - minItems)) + minItems;
  }

  let items = Array.from({ length: getNum() }, (_, i0) => {
    return {
      id: i0,
      name: faker.company.companyName(),
      children: Array.from({ length: getNum() }, (_, i1) => {
        return {
          id: i1,
          name: faker.address.country(),
          children: Array.from({ length: getNum() }, (_, i2) => {
            return {
              id: i2,
              name: faker.name.findName(),
              text: faker.lorem.paragraph(),
            };
          }),
        };
      }),
    };
  });
</script>

<h3 id="title">
  <Breadcrumbs {zoomManager} />
</h3>

<section>
  <ZoomableContainer bind:zoomManager transitionPreset={zoomPreset}>
    <ZoomGridItems {items} />
  </ZoomableContainer>
</section>

<style>
  section {
    border: solid 1px lightgray;
    width: 23rem;
    height: 32rem;
    padding: 1rem;
  }
</style>

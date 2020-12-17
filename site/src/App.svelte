<script>
  import { fade } from 'svelte/transition';

  import ZoomableContainer from '../../src/ZoomableContainer.svelte';
  import Items from './Items.svelte';

  const data = [
    {
      id: 'fruit',
      title: 'Fruits',
      children: [
        {
          id: 'apple',
          title: 'Apple',
          content: ['Apples are good!'],
        },
        {
          id: 'banana',
          title: 'Banana',
          content: ['Bananas are yellow'],
        },
      ],
    },
    {
      id: 'meat',
      title: 'Meat',
      children: [
        {
          id: 'beef',
          title: 'Beef',
          content: ['Moo'],
        },
        {
          id: 'poultry',
          title: 'Poultry',
          children: [
            {
              id: 'chicken',
              title: 'Chicken',
              content: 'Bok bok bok',
            },
            {
              id: 'turkey',
              title: 'Turkey',
              content: 'Baste often!',
            },
          ],
        },
        {
          id: 'pork',
          title: 'Pork',
          content: 'Oink',
        },
      ],
    },
  ];

  let zoomManager;
</script>

<style>
  :global(body) {
    margin: 0px;
    padding: 0px;
  }

  :global(*) {
    box-sizing: border-box;
  }

  #app {
    width: 100vw;
    height: 100vh;
    display: grid;
    grid-template-rows: 2rem 1fr;
  }

  #view {
    position: relative;
    place-self: stretch;
    margin: 0px 1rem 1rem;
  }

  #title {
    margin: 5px 10px;
  }
</style>

<div id="app">
  <h3 id="title">
    {#if $zoomManager?.path.length === 0}
      Click to zoom
    {:else if $zoomManager?.title}{$zoomManager.title.join(' > ')}{/if}
  </h3>

  <div id="view">
    <ZoomableContainer bind:zoomManager>
      <Items items={data} />
    </ZoomableContainer>
  </div>
</div>

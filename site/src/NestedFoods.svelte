<script>
  import ZoomableContainer from '../../src/ZoomableContainer.svelte';
  import Breadcrumbs from '../../src/Breadcrumbs.svelte';
  import Items from './Items.svelte';

  export let zoomPreset;

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

<h3 id="title">
  <Breadcrumbs {zoomManager} />
</h3>

<ZoomableContainer bind:zoomManager transitionPreset={zoomPreset}>
  <Items items={data} />
</ZoomableContainer>

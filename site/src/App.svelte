<script>
  import ZoomableContainer from "../src/ZoomableContainer.svelte";
  import Items from "./Items.svelte";

  const data = [
    {
      id: "fruit",
      title: "Fruits",
      children: [
        {
          id: "apple",
          title: "Apple",
          content: ["Apples are good!"],
        },
        {
          id: "banana",
          title: "Banana",
          content: ["Bananas are yellow"],
        },
      ],
    },
    {
      id: "meat",
      title: "Meat",
      children: [
        {
          id: "beef",
          title: "Beef",
          content: ["Moo"],
        },
        {
          id: "poultry",
          title: "Poultry",
          children: [
            {
              id: "chicken",
              title: "Chicken",
              content: "Bok bok bok",
            },
            {
              id: "turkey",
              title: "Turkey",
              content: "Baste often!",
            },
          ],
        },
        {
          id: "pork",
          title: "Pork",
          content: "Oink",
        },
      ],
    },
  ];

  let zoomManager;
</script>

<style>
  #app {
    position: relative;
    width: 100vh;
    height: 100vh;
  }
</style>

<div id="app">
  <ZoomableContainer bind:zoomManager>
    <Items items={data} />
  </ZoomableContainer>
</div>

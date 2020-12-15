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
  :global(body) {
    margin: 0px;
  }

  :global(*) {
    box-sizing: border-box;
  }

  #app {
    width: 100vw;
    height: 100vh;
    display: grid;
    place-items: center;
  }

  #view {
    width: 95%;
    height: 95%;
    position: relative;
  }
</style>

<div id="app">
  <div id="view">
    <ZoomableContainer bind:zoomManager>
      <Items items={data} />
    </ZoomableContainer>
  </div>
</div>

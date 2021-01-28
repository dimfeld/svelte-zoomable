# Svelte Zoomable UI

This is a component for providing UI that can zoom into different levels of detail.

More docs coming soon, but you can see some Svelte REPL examples to get a good idea of how it works:

- [Zoomable Grid](https://svelte.dev/repl/32bf500c4b8b4b718daee1fae74b6a51?version=3.32.0)
- [Flex Layouts](https://svelte.dev/repl/58dfe87756ee4db897c281b52fdef7b7?version=3.31.0)

```svelte
<script>
  let zoomManager;
</script>

<h3><Breadcrumbs {zoomManager} /></h3>
<ZoomableContainer bind:zoomManager>
  {#each data as item}
    <Zoomable id={item.id} title={item.title}>
      <div slot="overview">
        Content when the item is zoomed out
      </div>
      
      <div slot="detail">
        Content when the item is zoomed in. This can contain additional Zoomables for more levels of nesting.
      </div>
    </Zoomable>
  {/each}
</ZoomableContainer>
```

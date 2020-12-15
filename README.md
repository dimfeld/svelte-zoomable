# Svelte Zoomable UI

This is a component for providing UI that can zoom into different levels of detail.

More docs coming soon, but you can see an example in [this Svelte REPL](https://svelte.dev/repl/58dfe87756ee4db897c281b52fdef7b7?version=3.31.0);

```svelte
<ZoomableContainer>
  {#each data as item}
    <Zoomable id={item.id} title={item.title}>

      ... components that can nest more zoomables
    </Zoomable>
  {/each}
</ZoomableContainer>
```

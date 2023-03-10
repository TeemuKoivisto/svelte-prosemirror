<script lang="ts">
  export let id: string | undefined = undefined,
    title: string,
    src: string,
    alt: string,
    caption: string | undefined = undefined

  const schema = {
    content: 'figcaption* paragraph*',
    selectable: false,
    group: 'block'
  }
</script>

<figure {id}>
  {#if caption}
    <figcaption>{caption}</figcaption>
  {/if}
  <img {src} {alt} {title} />
</figure>

<style lang="scss">
  figure {
    border: 1px #cccccc solid;
    padding: 4px;
    margin: auto;
  }

  figcaption {
    background-color: black;
    color: white;
    font-style: italic;
    padding: 2px;
    text-align: center;
  }
</style>

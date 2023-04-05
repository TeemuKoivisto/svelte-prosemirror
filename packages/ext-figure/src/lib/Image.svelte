<script lang="ts" context="module">
  import type { NodeSpec } from 'prosemirror-model'

  export interface ImageAttrs {
    title: string
    src: string
    alt: string
  }

  export const imageAttrs: ImageAttrs = {
    title: '',
    src: '',
    alt: ''
  }

  export const imageSchema: NodeSpec = {
    attrs: Object.entries(imageAttrs).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: { default: value } }),
      {}
    ),
    selectable: true,
    // inline: true,
    // group: 'inline',
    draggable: true
  }
</script>

<script lang="ts">
  export let attrs: ImageAttrs

  const { src, alt, title } = attrs
</script>

<img {src} {alt} {title} />

<style lang="scss">
  :global(img.ProseMirror-selectednode) {
    outline: 2px solid #8cf;
  }
</style>

<script lang="ts" context="module">
  import type { Node as PMNode, NodeSpec } from 'prosemirror-model'

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
  import type { NodeProps } from '@my-org/core'

  interface $$Props extends NodeProps<ImageAttrs> {}

  export let node: PMNode | undefined, attrs: ImageAttrs, contentDOM: (node: HTMLElement) => void
  /** */
</script>

<img src={attrs.src} alt={attrs.alt} title={attrs.title} />

<style lang="scss">
  :global(img.ProseMirror-selectednode) {
    outline: 2px solid #8cf;
  }
</style>

<script lang="ts" context="module">
  import type { Node as PMNode, NodeSpec } from 'prosemirror-model'

  export interface FigcaptionAttrs {}

  export const figcaptionAttrs: FigcaptionAttrs = {}

  export const figcaptionSchema: NodeSpec = {
    attrs: Object.entries(figcaptionAttrs).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: { default: value } }),
      {}
    ),
    content: 'inline*',
    group: 'block',
    isolating: true,
    selectable: false
  }
</script>

<script lang="ts">
  import type { NodeProps } from '@my-org/core'

  interface $$Props extends NodeProps<FigcaptionAttrs> {}

  export let node: PMNode | undefined,
    attrs: FigcaptionAttrs,
    contentDOM: (node: HTMLElement) => void
  /** */
</script>

<!-- svelte-ignore a11y-structure -->
<figcaption data-hole />

<style lang="scss">
  figcaption {
    color: #5d5d5d;
    font-size: 0.9rem;
    font-style: italic;
    padding: 2px;
    text-align: center;
  }
</style>

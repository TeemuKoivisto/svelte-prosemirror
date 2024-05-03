<script lang="ts" context="module">
  import { NodeProps } from '@my-org/core'
  import type { Node as PMNode, NodeSpec } from 'prosemirror-model'

  export interface BlockquoteAttrs {}

  export const blockquoteAttrs: BlockquoteAttrs = {}

  export const blockquoteSchema: NodeSpec = {
    attrs: {},
    content: 'block+',
    group: 'block',
    defining: true
  }
</script>

<script lang="ts">
  interface $$Props extends NodeProps<BlockquoteAttrs> {}

  export let node: PMNode | undefined,
    attrs: BlockquoteAttrs,
    contentDOM: (node: HTMLElement) => void
  /** */
</script>

<blockquote data-hole />

<style lang="scss" global>
  blockquote {
    margin: 1rem 0;
  }
</style>

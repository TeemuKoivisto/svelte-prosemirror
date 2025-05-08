<script lang="ts" module>
  import type { NodeProps } from '@my-org/core'
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
  interface Props {
    // node: PMNode | undefined
    // attrs: BlockquoteAttrs
    // contentDOM: (node: HTMLElement) => void
    ref?: HTMLQuoteElement
  }

  // let { node, attrs, contentDOM, ref }: Props = $props()
  let { ref }: Props = $props()
</script>

<blockquote data-hole bind:this={ref}></blockquote>

<style lang="scss" global>
  blockquote {
    margin: 1rem 0;
  }
</style>

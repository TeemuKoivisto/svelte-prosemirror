<script lang="ts" context="module">
  import { NodeProps } from '@my-org/core'
  import type { Node as PMNode, NodeSpec } from 'prosemirror-model'

  export interface ParagraphAttrs {
    indent: number
  }

  export const paragraphAttrs: ParagraphAttrs = {
    indent: 0
  }

  export const paragraphSchema: NodeSpec = {
    attrs: {
      indent: { default: 0 }
    },
    content: 'inline*',
    group: 'block'
  }
</script>

<script lang="ts">
  interface $$Props extends NodeProps<ParagraphAttrs> {}

  export let node: PMNode | undefined,
    attrs: ParagraphAttrs,
    contentDOM: (node: HTMLElement) => void
  /** */
</script>

<p data-indent={attrs.indent} data-hole />

<style lang="scss" global>
  p {
    margin: 1rem 0;
  }
</style>

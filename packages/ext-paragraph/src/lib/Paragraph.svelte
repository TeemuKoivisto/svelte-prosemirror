<script lang="ts" context="module">
  import type { NodeSpec } from 'prosemirror-model'

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
  import type { Node as PMNode } from 'prosemirror-model'

  export let node: PMNode | undefined = undefined,
    attrs: ParagraphAttrs
</script>

<p data-indent={attrs.indent} data-hole />

<style lang="scss" global>
  p {
    margin: 1rem 0;
  }
</style>

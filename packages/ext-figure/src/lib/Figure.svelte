<script lang="ts" module>
  import type { Node as PMNode, NodeSpec } from 'prosemirror-model'

  export interface FigureAttrs {
    id: string | undefined
  }

  export const figureAttrs: FigureAttrs = {
    id: undefined
  }

  export const figureSchema: NodeSpec = {
    attrs: Object.entries(figureAttrs).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: { default: value } }),
      {}
    ),
    content: 'image figcaption',
    selectable: false,
    group: 'block'
  }
</script>

<script lang="ts">
  import type { NodeProps } from '@my-org/core'

  interface Props {
    node: PMNode | undefined /** */
    attrs: FigureAttrs /** */
    contentDOM: (node: HTMLElement) => void /** */
    ref?: HTMLElement
  }

  let { node, attrs, contentDOM, ref }: Props = $props()
</script>

<figure id={attrs.id} data-hole bind:this={ref}></figure>

<style lang="scss">
  figure {
    align-items: center;
    display: flex;
    flex-direction: column;
  }
</style>

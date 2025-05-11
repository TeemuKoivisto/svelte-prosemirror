<script lang="ts" module>
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

  export interface Props {
    node: PMNode | undefined /** */
    attrs: FigcaptionAttrs /** */
    contentDOM: (node: HTMLElement) => void /** */
    ref: HTMLElement | undefined
  }

  let { node, attrs, contentDOM, ref }: Props = $props()

  export { ref }
</script>

<!-- svelte-ignore a11y_figcaption_parent -->
<figcaption data-hole bind:this={ref}></figcaption>

<style lang="scss">
  figcaption {
    color: #5d5d5d;
    font-size: 0.9rem;
    font-style: italic;
    padding: 2px;
    text-align: center;
  }
</style>

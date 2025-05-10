<script lang="ts" module>
  import type { NodeSpec } from 'prosemirror-model'

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
  export interface Props {
    attrs: FigureAttrs
    ref?: HTMLElement
  }

  let { attrs, ref }: Props = $props()

  export { ref }
</script>

<figure id={attrs.id} data-hole bind:this={ref}></figure>

<style lang="scss">
  figure {
    align-items: center;
    display: flex;
    flex-direction: column;
  }
</style>

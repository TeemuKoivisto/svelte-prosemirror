<script lang="ts" context="module">
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
  import type { NodeProps } from '@my-org/core'

  interface $$Props extends NodeProps<FigureAttrs> {}

  export let attrs: FigureAttrs
</script>

<figure id={attrs.id} data-hole />

<style lang="scss">
  figure {
    align-items: center;
    display: flex;
    flex-direction: column;
  }
</style>

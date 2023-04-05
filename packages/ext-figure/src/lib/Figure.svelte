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
  export let attrs: FigureAttrs

  const { id } = attrs
</script>

<figure {id} data-hole />

<style lang="scss">
  figure {
    align-items: center;
    display: flex;
    flex-direction: column;
  }
</style>

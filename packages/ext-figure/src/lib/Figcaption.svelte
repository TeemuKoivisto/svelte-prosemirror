<script lang="ts" context="module">
  import type { NodeSpec } from 'prosemirror-model'

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

<script lang="ts" context="module">
  import type { NodeSpec } from 'prosemirror-model'
  export const schema: NodeSpec = {
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM() {
      return ['p', 0]
    }
  }
</script>

<script lang="ts">
  import type { Node as PMNode } from 'prosemirror-model'

  interface Attrs {
    indent: number
  }

  export let node: PMNode, attrs: Attrs
</script>

<!-- <svelte:options tag="my-paragraph" /> -->
<p data-indent={attrs.indent} data-hole>
  {#if attrs.indent === 0}
    <span> poop </span>
  {/if}
</p>

<style lang="scss" global>
  p {
    margin: 1rem 0;
  }
</style>

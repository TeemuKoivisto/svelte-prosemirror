<script lang="ts" context="module">
  import type { NodeSpec } from 'prosemirror-model'

  export interface Attrs {
    indent: number
  }

  export const attrs: Attrs = {
    indent: 0
  }

  export const schema: NodeSpec = {
    attrs: {
      indent: { default: 0 }
    },
    content: 'inline*',
    group: 'block'
    // parseDOM: [
    //   {
    //     tag: 'p',
    //     getAttrs(dom: HTMLElement | string) {
    //       if (dom instanceof HTMLElement) {
    //         return {
    //           indent: dom.getAttribute('data-indent')
    //         }
    //       }
    //       return null
    //     }
    //   }
    // ],
    // toDOM() {
    //   return ['p', 0]
    // }
  }
</script>

<script lang="ts">
  import type { Node as PMNode } from 'prosemirror-model'

  export let node: PMNode | undefined = undefined,
    attrs: Attrs
</script>

<!-- <svelte:options tag="my-paragraph" /> -->
<p data-indent={attrs.indent} data-hole>
  <!-- {#if attrs.indent === 0}
    <span> poop </span>
  {/if} -->
</p>

<style lang="scss" global>
  p {
    margin: 1rem 0;
  }
</style>

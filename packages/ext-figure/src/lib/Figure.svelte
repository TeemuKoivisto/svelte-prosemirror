<script lang="ts" context="module">
  import type { NodeSpec } from 'prosemirror-model'

  export interface Attrs {
    id: string | undefined
    title: string
    src: string
    alt: string
  }

  export const attrs: Attrs = {
    id: undefined,
    title: '',
    src: '',
    alt: ''
  }

  // const attrs = {
  //   id: { default: '' },
  //   title: { default: '' },
  //   src: { default: '' },
  //   alt: { default: '' },
  //   caption: { default: undefined }
  // }

  export const schema: NodeSpec = {
    attrs: Object.entries(attrs).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: { default: value } }),
      {}
    ),
    content: 'inline*',
    selectable: false,
    group: 'block'
    // parseDOM: [
    //   {
    //     tag: 'figure',
    //     getAttrs: (dom: HTMLElement | string) => {
    //       if (dom instanceof HTMLElement) {
    //         return {
    //           id: dom.getAttribute('id'),
    //           src: dom.getAttribute('src')
    //         }
    //       }
    //       return null
    //     }
    //   }
    // ],
    // toDOM(node: PMNode) {
    //   const { id, title, src, alt } = node.attrs
    //   return ['figure', { id }, ['img', { src, alt }], ['figcaption', {}, 0]]
    // }
  }
</script>

<script lang="ts">
  import type { Node as PMNode } from 'prosemirror-model'

  export let node: PMNode | undefined = undefined,
    attrs: Attrs
  const { id, src, alt, title } = attrs
</script>

<figure {id}>
  <figcaption data-hole />
  <img {src} {alt} {title} />
</figure>

<style lang="scss">
  figure {
    border: 1px #cccccc solid;
    padding: 4px;
    margin: auto;
  }

  figcaption {
    background-color: black;
    color: white;
    font-style: italic;
    padding: 2px;
    text-align: center;
  }
</style>

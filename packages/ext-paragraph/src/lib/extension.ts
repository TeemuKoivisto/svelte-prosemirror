import type { CreateExtension, EditorContext } from '@my-org/core'
import Paragraph, { attrs, schema } from './Paragraph.svelte'

export const paragraphExtension = () => (ctx: EditorContext) => {
  return {
    name: 'paragraph' as const,
    nodes: {
      paragraph: {
        attrs,
        schema,
        component: Paragraph
      }
    }
  }
}

// function typeCheck(): CreateExtension {
//   return extension
// }

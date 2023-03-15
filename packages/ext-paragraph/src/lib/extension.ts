import type { CreateExtension, EditorContext } from '@my-org/core'
import Paragraph, { schema } from './Paragraph.svelte'

export const paragraphExtension = () => (ctx: EditorContext) => {
  return {
    name: 'paragraph' as const,
    nodes: {
      paragraph: {
        schema
        // component: Paragraph
      }
    }
  }
}

// function typeCheck(): CreateExtension {
//   return extension
// }

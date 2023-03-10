import type { CreateExtension, EditorContext } from '@my-org/core'
import Paragraph from './Paragraph.svelte'

export const paragraphExtension = () => (ctx: EditorContext) => {
  return {
    name: 'paragraph' as const,
    component: Paragraph
  }
}

// function typeCheck(): CreateExtension {
//   return extension
// }

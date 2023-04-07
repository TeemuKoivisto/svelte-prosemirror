import type { CreateExtension, Extension, EditorContext } from '@my-org/core'
import Paragraph, { paragraphAttrs, paragraphSchema } from './Paragraph.svelte'

export const paragraphExtension = () => (ctx: EditorContext) => {
  return {
    name: 'paragraph' as const,
    nodes: {
      paragraph: {
        attrs: paragraphAttrs,
        schema: paragraphSchema,
        component: Paragraph
      }
    }
  } satisfies Extension
}

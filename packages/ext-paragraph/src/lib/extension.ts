import { default as Paragraph, paragraphAttrs, paragraphSchema } from './Paragraph.svelte'

import type { Extension } from '@my-org/core'

export const paragraphExtension = () => {
  return {
    name: 'paragraph' as const,
    nodes: {
      paragraph: {
        attrs: paragraphAttrs,
        schema: paragraphSchema,
        component: Paragraph as any
      }
    }
  } satisfies Extension
}

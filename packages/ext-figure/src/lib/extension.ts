import type { CreateExtension, Extension, EditorContext } from '@my-org/core'
import Figcaption, { figcaptionAttrs, figcaptionSchema } from './Figcaption.svelte'
import Figure, { figureAttrs, figureSchema } from './Figure.svelte'
import Image, { imageAttrs, imageSchema } from './Image.svelte'

export const figureExtension = () => (ctx: EditorContext) => {
  return {
    name: 'figure' as const,
    nodes: {
      figcaption: {
        attrs: figcaptionAttrs,
        schema: figcaptionSchema,
        component: Figcaption
      },
      figure: {
        attrs: figureAttrs,
        schema: figureSchema,
        component: Figure
      },
      image: {
        attrs: imageAttrs,
        schema: imageSchema,
        component: Image
      }
    }
  } satisfies Extension
}

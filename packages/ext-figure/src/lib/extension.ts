import type { CreateExtension, EditorContext } from '@my-org/core'
import Figure, { attrs, schema } from './Figure.svelte'

export const figureExtension = () => (ctx: EditorContext) => {
  return {
    name: 'figure' as const,
    nodes: {
      figure: {
        attrs,
        schema,
        component: Figure
      }
    }
  }
}

import type { CreateExtension, EditorContext } from '@my-org/core'
import Figure, { schema } from './Figure.svelte'

export const figureExtension = () => (ctx: EditorContext) => {
  return {
    name: 'figure' as const,
    nodes: {
      figure: {
        schema,
        component: Figure
      }
    }
  }
}

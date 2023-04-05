import type { CreateExtension, EditorContext } from '@my-org/core'
import Equation, { equationAttrs, equationSchema } from './Equation.svelte'

export const equationExtension = () => (ctx: EditorContext) => {
  return {
    name: 'equation' as const,
    nodes: {
      equation: {
        attrs: equationAttrs,
        schema: equationSchema,
        nodeView: Equation
        // component: Equation
      }
    }
  }
}

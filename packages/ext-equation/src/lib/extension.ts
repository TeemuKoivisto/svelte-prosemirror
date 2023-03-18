import type { CreateExtension, EditorContext } from '@my-org/core'
import Equation, { attrs, schema } from './Equation.svelte'

export const equationExtension = () => (ctx: EditorContext) => {
  return {
    name: 'equation' as const,
    nodes: {
      equation: {
        attrs,
        schema,
        nodeView: Equation
        // component: Equation
      }
    }
  }
}

import Equation, { equationAttrs, equationSchema } from './Equation.svelte'

import type { Extension } from '@my-org/core'

export const equationExtension = () => {
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
  } satisfies Extension
}

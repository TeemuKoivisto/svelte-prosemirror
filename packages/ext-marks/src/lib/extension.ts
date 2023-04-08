import { bold } from './bold'
import { code } from './code'
import { italic } from './italic'
import { link } from './link'
import { strikethrough } from './strikethrough'

import type { Extension, EditorContext } from '@my-org/core'

export const marksExtension = () => (ctx: EditorContext) => {
  return {
    name: 'basic-marks' as const,
    marks: {
      bold,
      code,
      italic,
      link,
      strikethrough
    }
  } satisfies Extension
}

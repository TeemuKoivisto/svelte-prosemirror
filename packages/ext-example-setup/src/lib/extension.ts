import { buildKeymap, buildInputRules, exampleSetup } from 'prosemirror-example-setup'
import { keymap } from 'prosemirror-keymap'
import { history } from 'prosemirror-history'
import { baseKeymap } from 'prosemirror-commands'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { Schema } from 'prosemirror-model'
import 'prosemirror-state'

import type { Extension } from '@my-org/core'
import type { Plugin } from 'prosemirror-state'

export const exampleSetupExtension = (opts: Partial<Parameters<typeof exampleSetup>[0]>) => {
  return {
    name: 'example-setup' as const,
    plugins(_, schema: Schema): Plugin[] {
      return exampleSetup({ ...opts, schema })
    }
  } satisfies Extension
}

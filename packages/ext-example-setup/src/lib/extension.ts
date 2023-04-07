import { buildKeymap, buildInputRules } from 'prosemirror-example-setup'
import { keymap } from 'prosemirror-keymap'
import { history } from 'prosemirror-history'
import { baseKeymap } from 'prosemirror-commands'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { Schema } from 'prosemirror-model'
import 'prosemirror-state'

import type { CreateExtension, Extension, EditorContext } from '@my-org/core'

export const exampleSetupExtension = () => (ctx: EditorContext) => {
  return {
    name: 'example-setup' as const,
    plugins(schema: Schema) {
      return [
        buildInputRules(schema),
        keymap(buildKeymap(schema)),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor(),
        history()
      ]
    }
  } satisfies Extension
}

import { buildKeymap, buildInputRules } from 'prosemirror-example-setup'
import { keymap } from 'prosemirror-keymap'
import { history } from 'prosemirror-history'
import { baseKeymap } from 'prosemirror-commands'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { Schema } from 'prosemirror-model'
import 'prosemirror-state'

import type { Extension, EditorContext } from '@my-org/core'

interface Options {
  history?: boolean
}

export const exampleSetupExtension = (opts: Options) => (ctx: EditorContext) => {
  return {
    name: 'example-setup' as const,
    plugins(schema: Schema) {
      const list = [
        buildInputRules(schema),
        keymap(buildKeymap(schema)),
        keymap(baseKeymap),
        dropCursor(),
        gapCursor()
      ]
      if (opts.history) {
        list.push(history())
      }
      return list
    }
  } satisfies Extension
}

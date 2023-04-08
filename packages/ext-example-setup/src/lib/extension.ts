import { buildKeymap, buildInputRules } from 'prosemirror-example-setup'
import { keymap } from 'prosemirror-keymap'
import { history } from 'prosemirror-history'
import { baseKeymap } from 'prosemirror-commands'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import { Schema } from 'prosemirror-model'
import 'prosemirror-state'

import type { Extension, EditorContext } from '@my-org/core'
import type { Plugin } from 'prosemirror-state'

interface Options {
  noHistory?: boolean
}

export const exampleSetupExtension =
  (opts: Options = {}) =>
  (ctx: EditorContext) => {
    return {
      name: 'example-setup' as const,
      plugins(schema: Schema): Plugin[] {
        const list = [
          buildInputRules(schema),
          keymap(buildKeymap(schema)),
          keymap(baseKeymap),
          dropCursor(),
          gapCursor()
        ]
        if (!opts.noHistory) {
          list.push(history())
        }
        return list
      }
    } satisfies Extension
  }

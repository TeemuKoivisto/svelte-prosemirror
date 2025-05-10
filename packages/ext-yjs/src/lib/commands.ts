import { setAction, YjsAction } from './actions'
import type { Commands } from '@my-org/core'
import type { EditorState } from 'prosemirror-state'
import type { Transaction } from 'prosemirror-state'

export function createSnapshot(): Commands {
  function func(state: EditorState, dispatch: ((tr: Transaction) => void) | undefined) {
    if (dispatch) {
      const tr = setAction(state.tr, YjsAction.createSnapshot, true)
      tr.setMeta('origin', 'yjs-extension')
      dispatch(tr)
    }
    return true
  }
  return func as unknown as Commands
}

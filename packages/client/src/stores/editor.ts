import { derived, get, writable } from 'svelte/store'

import { getActiveMarks } from './getActiveMarks'

import type { Editor } from '@my-org/core'
import type { EditorState } from 'prosemirror-state'

export let editor: Editor | undefined
export const state = writable<EditorState | undefined>()
export const activeMarks = derived(state, s => (s ? getActiveMarks(s) : []))

export const editorActions = {
  setEditor(e: Editor) {
    editor = e
    e.view.state.subscribe(s => {
      state.set(s)
    })
  }
}

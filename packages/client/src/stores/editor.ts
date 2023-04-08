import { derived, get, writable } from 'svelte/store'

import { getActiveMarks } from './getActiveMarks'

import type { Editor } from '@my-org/core'
import type { EditorState } from 'prosemirror-state'

const STATE_STORAGE_KEY = 'editor-state'

export let editor: Editor | undefined
export const state = writable<EditorState | undefined>()
export const activeMarks = derived(state, s => (s ? getActiveMarks(s) : []))

export const editorActions = {
  setEditor(e: Editor) {
    editor = e
    try {
      const existing = localStorage.getItem(STATE_STORAGE_KEY)
      const yjsExt = e.extProvider.getExtension('yjs')
      if (existing && !yjsExt) {
        e.view.setState(JSON.parse(existing))
      }
    } catch (err) {}
    e.view.state.subscribe(s => {
      state.set(s)
      const newState = s?.toJSON()
      localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(newState))
    })
  }
}

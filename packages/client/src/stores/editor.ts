import { derived, get, writable } from 'svelte/store'

import type { Editor } from '@my-org/core'

export const editor = writable<Editor | undefined>()

export const editorActions = {
  setEditor(e: Editor) {
    editor.set(e)
  }
}

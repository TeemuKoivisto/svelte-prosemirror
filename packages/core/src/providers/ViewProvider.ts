import type { EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'
import { get, writable } from 'svelte/store'

import type { Command, JSONEditorState } from '../typings'

export class ViewProvider {
  editorView = writable<EditorView | undefined>()
  state = writable<EditorState | undefined>()
  editable = writable<boolean>(true)

  get view() {
    const v = get(this.editorView)
    if (v === undefined) {
      throw Error(
        '@my-org/core: Accessed undefined "viewProvider.view", did your Editor component mount properly?'
      )
    }
    return v
  }

  setView(view: EditorView) {
    this.editorView.set(view)
    this.state.set(view.state)
  }

  getState() {
    const s = get(this.state)
    if (s === undefined) {
      throw Error(
        '@my-org/core: Accessed undefined state with getState(), did your Editor component mount properly?'
      )
    }
    return s
  }

  setState(value: EditorState | Record<string, unknown>) {
    if (!(value instanceof EditorState)) {
      const view = this.view
      value = EditorState.fromJSON(
        {
          schema: view.state.schema,
          plugins: view.state.plugins
        },
        value
      )
    }
    this.view.updateState(value)
    this.state.set(value)
  }

  stateToJSON() {
    return { ...this.getState().toJSON(), plugins: [] } as unknown as JSONEditorState
  }

  docToJSON() {
    return this.getState().doc.toJSON()
  }

  execCommand(cmd: Command) {
    const view = this.view
    const state = this.getState()
    cmd(state, view.dispatch, view)
    this.focus()
    return this
  }

  focus() {
    const view = this.view,
      state = this.getState()
    if (view.hasFocus()) {
      return false
    }
    view.focus()
    view.dispatch(state.tr.scrollIntoView())
    return true
  }
}

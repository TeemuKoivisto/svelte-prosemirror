import type { EditorView } from 'prosemirror-view'
import { Command, EditorState, PluginKey } from 'prosemirror-state'
import { get, writable } from 'svelte/store'

import type { JSONEditorState } from '../typings/editor'

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

  updateState(newState: EditorState) {
    this.view.updateState(newState)
    this.state.set(newState)
  }

  execCommand(cmd: Command) {
    const view = this.view
    const state = this.getState()
    cmd(state, view.dispatch)
    this.focus()
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

  stateToJSON() {
    return { ...this.getState().toJSON(), plugins: [] } as unknown as JSONEditorState
  }

  hydrateStateFromJSON(rawValue: Record<string, unknown>) {
    const view = this.view
    const state = EditorState.fromJSON(
      {
        schema: view.state.schema,
        plugins: view.state.plugins
      },
      rawValue
    )
    this.updateState(state)
  }
}

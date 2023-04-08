import { EditorView } from 'prosemirror-view'
import { EditorState, Transaction } from 'prosemirror-state'
import { get } from 'svelte/store'

import type { Editor, EditorProps } from './typings'

export function createEditorState(editor: Editor) {
  return EditorState.create({
    schema: get(editor.extProvider.schema),
    plugins: get(editor.extProvider.plugins)
  })
}

export function createEditorView(
  element: HTMLElement,
  state: EditorState,
  editor: Editor,
  props: EditorProps
) {
  return new EditorView(
    { mount: element },
    {
      state,
      nodeViews: get(editor.extProvider.nodeViews),
      dispatchTransaction(tr: Transaction) {
        const oldEditorState = this.state
        const { state: newState } = oldEditorState.applyTransaction(tr)
        editor.viewProvider.setState(newState)
        props.onEdit && props.onEdit(newState)
      }
    }
  )
}

export function init(
  element: HTMLElement,
  editor: Editor,
  props: EditorProps,
  oldView?: EditorView
) {
  const state = createEditorState(editor)
  const view = oldView || createEditorView(element, state, editor, props)
  if (oldView) {
    view.setProps({
      state,
      dispatchTransaction(tr: Transaction) {
        if (!this.state) return
        const oldEditorState = this.state
        const newState = oldEditorState.apply(tr)
        editor.viewProvider.setState(newState)
        props.onEdit && props.onEdit(newState)
      }
    })
  }
  editor.viewProvider.setView(view)
  props.onEditorReady && props.onEditorReady(editor)
  return view
}

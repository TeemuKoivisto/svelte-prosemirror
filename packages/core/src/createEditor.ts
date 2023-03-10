import { Schema } from 'prosemirror-model'
import { EditorView } from 'prosemirror-view'
import { EditorState, Transaction } from 'prosemirror-state'
import { get } from 'svelte/store'

import type { EditorProps, EditorContext } from './typings'

export function createEditorState(schema: Schema, ctx: EditorContext) {
  return EditorState.create({
    schema,
    plugins: get(ctx.extProvider.plugins)
  })
}

export function createEditorView(
  element: HTMLElement,
  state: EditorState,
  ctx: EditorContext,
  props: EditorProps
) {
  return new EditorView(
    { mount: element },
    {
      state,
      dispatchTransaction(tr: Transaction) {
        const oldEditorState = this.state
        const { state: newState } = oldEditorState.applyTransaction(tr)
        ctx.viewProvider.updateState(newState)
        props.onEdit && props.onEdit(newState)
      }
    }
  )
}

export function init(
  element: HTMLElement,
  ctx: EditorContext,
  props: EditorProps,
  oldView?: EditorView
) {
  const state = createEditorState(props.schema, ctx)
  const view = oldView || createEditorView(element, state, ctx, props)
  if (oldView) {
    view.setProps({
      state,
      dispatchTransaction(tr: Transaction) {
        if (!this.state) return
        const oldEditorState = this.state
        const newState = oldEditorState.apply(tr)
        ctx.viewProvider.updateState(newState)
        props.onEdit && props.onEdit(newState)
      }
    })
  }
  // if (window) {
  //   window.editorView = view
  //   window.commands = get(ctx.extProvider.commands)
  // }
  ctx.viewProvider.setView(view)
  props.onEditorReady && props.onEditorReady(ctx)
  return view
}

import { EditorState, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

export type Command = (
  state: EditorState,
  dispatch?: (tr: Transaction) => void,
  view?: EditorView
) => boolean | undefined | void

export type Commands = { [name: string]: (...args: any[]) => Command }

export interface JSONEditorState {
  doc: { [key: string]: any }
  selection: { [key: string]: any }
  plugins: { [key: string]: any }
}

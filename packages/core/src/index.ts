import type { EditorView } from 'prosemirror-view'
import type { Commands } from './typings'

declare global {
  interface Window {
    editorView: EditorView
    commands: Commands
  }
}

export { Editor } from './Editor'
export * from './createEditor'
export * from './typings'

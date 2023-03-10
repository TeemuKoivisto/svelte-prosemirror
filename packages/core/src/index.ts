import type { EditorView } from 'prosemirror-view'
import type { Commands } from './typings/editor'

declare global {
  interface Window {
    editorView: EditorView
    commands: Commands
  }
}

export * from './createEditor'
export * from './providers'
export * from './typings'

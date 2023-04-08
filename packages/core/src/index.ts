import type { EditorView } from 'prosemirror-view'
import type { Commands } from './typings'

declare global {
  interface Window {
    editorView: EditorView
    commands: Commands
  }
}

export * from './createExtensions'
export * from './Editor'
export * from './SvelteNodeView'
export * from './typings'

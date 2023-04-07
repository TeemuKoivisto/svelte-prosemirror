import { EditorState } from 'prosemirror-state'

import type { EditorContext } from './context'

import type { CreateExtension } from './extension'

export interface EditorProps {
  extensions?: CreateExtension[]
  // The name of the default top-level node for the schema. Defaults to `"doc"`.
  topNode?: string
  onEditorReady?: (ctx: EditorContext) => void
  onEdit?: (state: EditorState) => void
}

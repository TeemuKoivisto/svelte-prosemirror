import { EditorState } from 'prosemirror-state'
import { Schema } from 'prosemirror-model'

import type { EditorContext } from './context'

import type { CreateExtension } from './extension'

export interface EditorProps {
  extensions: CreateExtension[]
  schema?: Schema
  /**
    The name of the default top-level node for the schema. Defaults to `"doc"`.
  */
  topNode?: string
  defaultDocTopNode?: boolean
  onEditorReady?: (ctx: EditorContext) => void
  onEdit?: (state: EditorState) => void
}

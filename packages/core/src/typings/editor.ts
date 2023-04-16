import { EditorState } from 'prosemirror-state'

import type { Editor } from '../Editor'
import type { Extension } from './extension'

export type { Editor } from '../Editor'

export interface EditorProps {
  extensions?: Extension[]
  /**
   * The name of the default top-level node for the schema. Defaults to `"doc"`.
   */
  topNode?: string
  onEditorReady?: (editor: Editor) => void
  onEdit?: (state: EditorState) => void
}

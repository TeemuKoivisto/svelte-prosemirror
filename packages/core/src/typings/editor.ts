import { Command, EditorState } from 'prosemirror-state'
import { Schema } from 'prosemirror-model'

import type { EditorContext } from './context'

import type { CreateExtension } from './extension'

export interface EditorProps {
  extensions: CreateExtension[]
  schema: Schema
  onEditorReady?: (ctx: EditorContext) => void
  onEdit?: (state: EditorState) => void
}

export type Commands = { [name: string]: (...args: any[]) => Command }
export interface JSONEditorState {
  doc: { [key: string]: any }
  selection: { [key: string]: any }
  plugins: { [key: string]: any }
}
export type JSONPMNode = { [key: string]: any }

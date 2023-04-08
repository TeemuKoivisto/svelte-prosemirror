import { MarkSpec, NodeSpec, Schema } from 'prosemirror-model'
import { EditorView, NodeViewConstructor } from 'prosemirror-view'
import { EditorState, Plugin, Transaction } from 'prosemirror-state'
import type { SvelteComponentTyped } from 'svelte'

import type { Editor } from '../Editor'
import type { EditorProps } from './editor'
import type { Command } from './pm'

export interface ExtensionData {
  commands: { [name: string]: (...args: any[]) => Command }
  marks: { [name: string]: MarkSpec }
  nodes: { [name: string]: NodeSpec }
  nodeViews: { [node: string]: NodeViewConstructor }
  sortedKeymaps: { [key: string]: { cmd: Command; priority: number }[] }
  svelteNodes: { [name: string]: SveltePMNode }
}

export interface Initialized extends ExtensionData {
  plugins: Plugin[]
  schema: Schema
}

export interface SveltePMNode {
  attrs?: { [attr: string]: any }
  selectors?: string[]
  schema?: NodeSpec
  attrExtractor?: (dom: HTMLElement | string, attr: string) => { [attr: string]: any } | undefined
  nodeView?: any // SvelteComponentTyped with different props
  component?: any // SvelteComponentTyped
}

export interface Extension {
  name: string
  opts?: any
  commands?: { [name: string]: (...args: any[]) => Command }
  keymaps?: { [key: string]: Command | { cmd: Command; priority: number }[] }
  store?: Record<string, any>
  marks?: {
    [name: string]: MarkSpec
  }
  nodes?: {
    [name: string]: SveltePMNode
  }
  init?: (editor: Editor) => void
  plugins?: (editor: Editor, schema: Schema) => Plugin[]
  destroy?: () => void
}

// This interface is augmented by all the other extensions in order to generate type-safe access to their
// data from ExtensionProvider
export interface Extensions {}

export interface EditorCommands {}

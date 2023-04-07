import { NodeSpec, Schema } from 'prosemirror-model'
import type { Plugin } from 'prosemirror-state'
import type { SvelteComponentTyped } from 'svelte'

import type { EditorContext } from './context'
import type { EditorProps } from './editor'
import type { Command } from './pm'

export type CreateExtension = (ctx: EditorContext, props: EditorProps) => Extension
export type CreateExtensionFn = (
  ...args: any[]
) => (ctx: EditorContext, props: EditorProps) => Extension

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
  commands?: { [key: string]: Command }
  keymaps?: { [key: string]: Command | { cmd: Command; priority: number }[] }
  store?: Record<string, any>
  nodes?: {
    [name: string]: SveltePMNode
  }
  init?: (ctx: EditorContext) => void
  plugins?: (schema: Schema) => Plugin[]
  onDestroy?: () => void
}

// This interface is augmented by all the other extensions in order to generate type-safe access to their
// data from ExtensionProvider
export interface Extensions {}

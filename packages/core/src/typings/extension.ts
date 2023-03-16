import { NodeSpec } from 'prosemirror-model'
import type { Plugin } from 'prosemirror-state'
import type { SvelteComponentTyped } from 'svelte'

import type { EditorContext } from './context'
import type { EditorProps } from './editor'
import type { Command } from './pm'

export type CreateExtension = (ctx: EditorContext, props: EditorProps) => Extension
export type CreateExtensionFn = (
  ...args: any[]
) => (ctx: EditorContext, props: EditorProps) => Extension

export interface Extension {
  name: string
  opts?: any
  commands?: { [key: string]: Command }
  keymaps?: { [key: string]: Command | { cmd: Command; priority: number }[] }
  plugins?: Plugin[]
  store?: Record<string, any>
  nodes?: {
    [name: string]: {
      schema?: NodeSpec
      // component?: SvelteComponentTyped
      component?: any
    }
  }
  onDestroy?: () => void
}

// This interface is augmented by all the other extensions in order to generate type-safe access to their
// data from ExtensionProvider
export interface Extensions {}

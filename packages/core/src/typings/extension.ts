import type { Command, Plugin } from 'prosemirror-state'
import type { SvelteComponentTyped } from 'svelte'

import type { EditorContext } from './context'
import type { EditorProps } from './editor'

export type CreateExtension = (ctx: EditorContext, props: EditorProps) => Extension
export type CreateExtensionFn = (
  ...args: any[]
) => (ctx: EditorContext, props: EditorProps) => Extension

// This interface is augmented by all the other extensions in order to generate type-safe access to their
// data from ExtensionProvider
export interface Extensions {}
export interface Extension {
  name: string
  opts?: any
  commands?: { [key: string]: Command }
  keymaps?: { [key: string]: Command | { cmd: Command; priority: number }[] }
  plugins?: Plugin[]
  store?: Record<string, any>
  component?: any
  // component: SvelteComponentTyped
  onDestroy?: () => void
}

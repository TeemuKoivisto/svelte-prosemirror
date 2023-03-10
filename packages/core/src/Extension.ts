// import { EditorContext, EditorProps, Extension as Ext} from "./typings";
// import type { Command, Plugin } from 'prosemirror-state'
// import type { SvelteComponentTyped } from 'svelte'

// class ExtensionClass {

//   static create(ext: Ext) {}

//   // static create<O = any, S = any>(config: Partial<ExtensionConfig<O, S>> = {}) {
//   //   return new Extension<O, S>(config)
//   // }

//   static extend() {}
// }

// export type CreateExtensionFn = (
//   ...args: any[]
// ) => (ctx: EditorContext, props: EditorProps) => CreatedExtension

// interface Extension2<A extends Record<string, any> = {}> {
//   name: string
//   component: SvelteComponentTyped<A>
//   opts?: any
//   commands?: { [key: string]: Command }
//   keymaps?: { [key: string]: Command | { cmd: Command; priority: number }[] }
//   plugins?: Plugin[]
//   store?: Record<string, any>
//   onDestroy?: () => void
// }

// type CreatedExtension = Extension2 & {
//   extend(): void
// }

// export function create(fn: (ctx: EditorContext, props: EditorProps) => Ext): CreateExtensionFn {
//   const ext = fn
//   ext.
//   return 1
// }

// export const Extension = {
//   create: (ctx: EditorContext, props: EditorProps) => (ext: Ext) => {

//   },
//   extend() {

//   }
// }

export {}

import { chainCommands } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'
import { get, writable } from 'svelte/store'
import { compile, parse } from 'svelte/compiler'
import type { Command, Plugin } from 'prosemirror-state'

import type { EditorContext } from '../typings/context'
import type { Commands, EditorProps } from '../typings/editor'
import type { CreateExtension, Extension, Extensions } from '../typings/extension'
import { SvelteComponentTyped } from 'svelte'
import { BaseNodeView } from '../BaseNodeView'

export class ExtensionProvider {
  #props: EditorProps

  extensions = writable<Extension[]>([])
  plugins = writable<Plugin[]>([])
  commands = writable<Commands>({})

  constructor(props: EditorProps) {
    this.#props = props
  }

  init(ctx: EditorContext, createExtensions: CreateExtension[]) {
    const created = createExtensions.map(ext => ext(ctx, this.#props))
    this.extensions.set(created)
    this.commands.set(
      created.reduce((acc, ext) => Object.assign(acc, ext.commands), {} as Commands)
    )
    const sortedKeymaps = created.reduce((acc, cur) => {
      Object.keys(cur.keymaps || {}).forEach(key => {
        const val = cur.keymaps![key]
        const cmd = Array.isArray(val) ? val : [{ cmd: val, priority: 0 }]
        if (key in acc) {
          acc[key] = [...acc[key], ...cmd].sort((a, b) => b.priority - a.priority)
        } else {
          acc[key] = cmd.sort((a, b) => b.priority - a.priority)
        }
      })
      return acc
    }, {} as { [key: string]: { cmd: Command; priority: number }[] })
    const keymaps = Object.keys(sortedKeymaps).reduce((acc, key) => {
      acc[key] = sortedKeymaps[key][0].cmd
      return acc
    }, {} as { [key: string]: Command })
    const plugins = [
      keymap(keymaps),
      ...created.reduce((acc, ext) => [...acc, ...(ext.plugins || [])], [] as Plugin[])
    ]
    const components = created.reduce((acc, ext) => [...acc, ext.component], [] as any[])
    // @TODO here
    // const nodeViews = components.map(c => BaseNodeView.fromComponent(ctx, c))
    // components.map(c => {
    //   console.log('>>> ', c)
    //   const {
    //     js,
    //     css,
    //     ast,
    //     warnings,
    //     vars,
    //     stats
    //   } = compile(c);
    //   console.log(js)
    // })
    this.plugins.set(plugins)
  }

  getExtension<K extends keyof Extensions>(name: K) {
    const ext = get(this.extensions).find(e => e.name === name)
    if (!ext) {
      throw Error(
        `@my-org/core: No extension "${name}" found, are you sure you provided it to the Editor?`
      )
    }
    return ext as Extensions[K]
  }

  destroy() {
    get(this.extensions).forEach(e => e.onDestroy && e.onDestroy())
  }
}

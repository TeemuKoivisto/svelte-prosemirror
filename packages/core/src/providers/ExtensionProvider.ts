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
import { NodeSpec, Schema, SchemaSpec } from 'prosemirror-model'

export class ExtensionProvider {
  #props: EditorProps

  extensions = writable<Extension[]>([])
  plugins = writable<Plugin[]>([])
  commands = writable<Commands>({})
  schema = writable<Schema>()

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
    const nodes = created.reduce((acc, ext) => {
      if (ext.nodes) {
        Object.keys(ext.nodes).forEach(name => {
          if (name in acc) {
            throw Error(`@my-org/core: duplicate nodes provided from extension: ${name}`)
          }
          // @ts-ignore
          acc[name] = ext.nodes[name]
        })
      }
      return acc
    }, {} as { [name: string]: any })
    console.log('nodes', nodes)

    const defaultSchema = {
      nodes: {
        doc: {
          content: 'block+'
        },
        text: {
          group: 'inline'
        }
      }
    }

    const schemaNodes = Object.entries(nodes).reduce((acc, [name, value]) => {
      acc[name] = {
        ...value.schema,
        ...(value.component && {
          toDOM(node) {
            const div = document.createElement('div')
            const comp = new value.component({
              target: div,
              props: {
                node,
                attrs: node.attrs
              }
            })
            const el = comp.$$.root.firstChild as HTMLElement
            return el
          }
        })
      }
      return acc
    }, {} as { [name: string]: NodeSpec })

    const schema = {
      nodes: {
        ...defaultSchema.nodes,
        ...schemaNodes
      }
    }
    console.log('nodes 2', schemaNodes)
    console.log('schema', schema)

    this.plugins.set(plugins)
    this.schema.set(new Schema(schema))
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

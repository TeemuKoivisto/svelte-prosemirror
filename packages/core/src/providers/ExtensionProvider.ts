import { chainCommands } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'
import { NodeSpec, Schema, SchemaSpec } from 'prosemirror-model'
import type { Command, Plugin } from 'prosemirror-state'
import { NodeViewConstructor } from 'prosemirror-view'
import { get, writable } from 'svelte/store'

import type {
  Commands,
  EditorContext,
  EditorProps,
  CreateExtension,
  Extension,
  Extensions,
  SveltePMNode
} from '../typings'
import { SvelteNodeView } from '../SvelteNodeView'
import { createNodeSpec } from './createNodeSpec'

export class ExtensionProvider {
  extensions = writable<Extension[]>([])
  plugins = writable<Plugin[]>([])
  commands = writable<Commands>({})
  schema = writable<Schema>()
  nodeViews = writable<{ [node: string]: NodeViewConstructor }>({})

  init(ctx: EditorContext, props: EditorProps) {
    const created = (props.extensions || []).map(ext => ext(ctx, props))
    this.extensions.set(created)
    this.commands.set(
      created.reduce((acc, ext) => Object.assign(acc, ext.commands), {} as Commands)
    )

    const sortedKeymaps = created.reduce((acc, cur) => {
      Object.keys(cur.keymaps || {}).forEach(key => {
        const val = cur.keymaps![key]
        const cmd = Array.isArray(val) ? val : [{ cmd: val, priority: 0 }]
        if (key in acc) {
          // @ts-ignore
          acc[key] = [...acc[key], ...cmd].sort((a, b) => b.priority - a.priority)
        } else {
          // @ts-ignore
          acc[key] = cmd.sort((a, b) => b.priority - a.priority)
        }
      })
      return acc
    }, {} as { [key: string]: { cmd: Command; priority: number }[] })

    const nodes = created.reduce((acc, ext) => {
      if (ext.nodes) {
        Object.keys(ext.nodes).forEach(name => {
          if (name in acc) {
            throw Error(`@my-org/core: duplicate nodes provided from extensions: ${name}`)
          }
          // @ts-ignore
          acc[name] = ext.nodes[name]
        })
      }
      return acc
    }, {} as { [name: string]: SveltePMNode })
    // console.log('nodes', nodes)

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

    const nodeViews = {} as { [node: string]: NodeViewConstructor }
    const schemaNodes = Object.entries(nodes).reduce((acc, [name, value]) => {
      acc[name] = createNodeSpec(value)
      if (value.nodeView) {
        nodeViews[name] = SvelteNodeView.fromComponent(ctx, value.nodeView)
      }
      return acc
    }, {} as { [name: string]: NodeSpec })

    const schema = new Schema({
      nodes: {
        ...defaultSchema.nodes,
        ...schemaNodes
      }
    })

    // console.log('nodes 2', schemaNodes)
    // console.log('schema', schema)

    // const keymaps = Object.keys(sortedKeymaps).reduce((acc, key) => {
    //   acc[key] = sortedKeymaps[key][0].cmd
    //   return acc
    // }, {} as { [key: string]: Command })

    const plugins = [
      // @TODO creates duplicate plugin keys
      // keymap(keymaps),
      ...created.reduce(
        (acc, ext) => [...acc, ...((ext.plugins && ext.plugins(schema)) || [])],
        [] as Plugin[]
      )
    ]

    this.plugins.set(plugins)
    this.schema.set(schema)
    this.nodeViews.set(nodeViews)
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
    get(this.extensions).forEach(e => e.destroy && e.destroy())
  }
}

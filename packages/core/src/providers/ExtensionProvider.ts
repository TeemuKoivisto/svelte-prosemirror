import { chainCommands } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'
import { MarkSpec, NodeSpec, Schema, SchemaSpec } from 'prosemirror-model'
import type { Plugin } from 'prosemirror-state'
import { NodeViewConstructor } from 'prosemirror-view'
import { get, writable } from 'svelte/store'

import type {
  Command,
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

    const extData: {
      marks: { [name: string]: MarkSpec }
      nodes: { [name: string]: NodeSpec }
      nodeViews: { [node: string]: NodeViewConstructor }
      sortedKeymaps: { [key: string]: { cmd: Command; priority: number }[] }
      svelteNodes: { [name: string]: SveltePMNode }
    } = {
      marks: {},
      nodes: {},
      nodeViews: {},
      sortedKeymaps: {},
      svelteNodes: {}
    }

    for (const key in created) {
      const ext = created[key]
      for (const name in ext.keymaps) {
        const val = ext.keymaps[name]
        const cmd = Array.isArray(val) ? val : [{ cmd: val, priority: 0 }]
        cmd.sort((a, b) => b.priority - a.priority)
        if (name in extData.sortedKeymaps) {
          extData.sortedKeymaps[name] = [...extData.sortedKeymaps[key], ...cmd].sort(
            (a, b) => b.priority - a.priority
          )
        } else {
          extData.sortedKeymaps[name] = cmd
        }
      }
      for (const name in ext.nodes) {
        if (name in extData.svelteNodes) {
          throw Error(`@my-org/core: duplicate node "${name}" provided from extension ${key}`)
        }
        const value = ext.nodes[name]
        extData.svelteNodes[name] = value
        extData.nodes[name] = createNodeSpec(value)
        if (value.nodeView) {
          extData.nodeViews[name] = SvelteNodeView.fromComponent(ctx, value.nodeView)
        }
      }
      for (const name in ext.marks) {
        if (name in extData.marks) {
          throw Error(`@my-org/core: duplicate mark "${name}" provided from extension ${key}`)
        }
        extData.marks[name] = ext.marks[name]
      }
    }

    const schema = new Schema({
      nodes: {
        doc: {
          content: 'block+'
        },
        text: {
          group: 'inline'
        },
        ...extData.nodes
      },
      marks: extData.marks
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
    this.nodeViews.set(extData.nodeViews)
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

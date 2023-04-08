import { chainCommands } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'
import { MarkSpec, NodeSpec, Schema, SchemaSpec } from 'prosemirror-model'
import type { Plugin } from 'prosemirror-state'
import { NodeViewConstructor } from 'prosemirror-view'
import { get, writable } from 'svelte/store'

import type {
  Command,
  Commands,
  Editor,
  EditorProps,
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

  init(editor: Editor, { extensions = [] }: EditorProps) {
    const extData: {
      commands: { [name: string]: (...args: any[]) => Command }
      marks: { [name: string]: MarkSpec }
      nodes: { [name: string]: NodeSpec }
      nodeViews: { [node: string]: NodeViewConstructor }
      sortedKeymaps: { [key: string]: { cmd: Command; priority: number }[] }
      svelteNodes: { [name: string]: SveltePMNode }
    } = {
      commands: {},
      marks: {},
      nodes: {},
      nodeViews: {},
      sortedKeymaps: {},
      svelteNodes: {}
    }
    for (const key in extensions) {
      const ext = extensions[key]
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
          extData.nodeViews[name] = SvelteNodeView.fromComponent(editor, value.nodeView)
        }
      }
      for (const name in ext.marks) {
        if (name in extData.marks) {
          throw Error(`@my-org/core: duplicate mark "${name}" provided from extension ${key}`)
        }
        extData.marks[name] = ext.marks[name]
      }
      if (ext.commands) {
        extData.commands = { ...extData.commands, ...ext.commands }
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
      ...extensions.reduce(
        (acc, ext) => [...acc, ...((ext.plugins && ext.plugins(editor, schema)) || [])],
        [] as Plugin[]
      )
    ]
    this.commands.set(extData.commands)
    this.extensions.set(extensions)
    this.plugins.set(plugins)
    this.schema.set(schema)
    this.nodeViews.set(extData.nodeViews)
  }

  initExtensions(editor: Editor) {
    const extensions = get(this.extensions)
    for (const name in extensions) {
      const ext = extensions[name]
      if (ext.init) ext.init(editor)
    }
  }

  getExtension<K extends keyof Extensions>(name: K) {
    return get(this.extensions).find(e => e.name === name) as Extensions[K] | undefined
  }

  destroy() {
    get(this.extensions).forEach(e => e.destroy && e.destroy())
  }
}

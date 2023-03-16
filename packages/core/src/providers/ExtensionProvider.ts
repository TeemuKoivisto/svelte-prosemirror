import { chainCommands } from 'prosemirror-commands'
import { keymap } from 'prosemirror-keymap'
import type { Command, Plugin } from 'prosemirror-state'
import { SvelteComponentTyped } from 'svelte'
import { get, writable } from 'svelte/store'

import type {
  Commands,
  EditorContext,
  EditorProps,
  CreateExtension,
  Extension,
  Extensions
} from '../typings'
import { BaseNodeView } from '../BaseNodeView'
import { NodeSpec, Schema, SchemaSpec } from 'prosemirror-model'
import { NodeViewConstructor } from 'prosemirror-view'
import { htmlToDOMOutputSpec } from './htmlToDOMOutputSpec'

export class ExtensionProvider {
  #props: EditorProps

  extensions = writable<Extension[]>([])
  plugins = writable<Plugin[]>([])
  commands = writable<Commands>({})
  schema = writable<Schema>()
  nodeViews = writable<{ [node: string]: NodeViewConstructor }>({})

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
          // @ts-ignore
          acc[key] = [...acc[key], ...cmd].sort((a, b) => b.priority - a.priority)
        } else {
          // @ts-ignore
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
            throw Error(`@my-org/core: duplicate nodes provided from extensions: ${name}`)
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

    const nodeViews = {} as { [node: string]: NodeViewConstructor }
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
            const spec = htmlToDOMOutputSpec(comp.$$.root.firstChild)
            console.log('spec', spec)
            return spec
            // const html = comp.$$.root.innerHTML
            // div.removeChild(comp.$$.root.firstChild)
            // div.innerHTML = html
            // console.log('html', html)
            // console.log('div', div)
            // return comp.$$.root.firstChild as HTMLElement
            // return { dom: comp.$$.root.firstChild as HTMLElement }
          }
        })
      }
      if (value.component) {
        // nodeViews[name] = BaseNodeView.fromComponent(ctx, value.component)
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
    get(this.extensions).forEach(e => e.onDestroy && e.onDestroy())
  }
}

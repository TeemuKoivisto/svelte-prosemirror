import { Schema } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'

import { SvelteNodeView } from './SvelteNodeView'
import { createNodeSpec } from './extensions/createNodeSpec'

import type { Editor, EditorProps, ExtensionData, Initialized } from './typings'

export function createExtensions(editor: Editor, { extensions = [] }: EditorProps): Initialized {
  const extData: ExtensionData = {
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
  return { ...extData, plugins, schema }
}

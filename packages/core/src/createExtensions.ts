import { Schema } from 'prosemirror-model'
import { Command, Plugin } from 'prosemirror-state'

import { SvelteNodeView } from './SvelteNodeView'
import { createNodeSpec } from './extensions/createNodeSpec'

import type { Cmd, Editor, EditorProps, ExtensionData, Initialized } from './typings'
import { keymap } from 'prosemirror-keymap'

export function createExtensions(editor: Editor, { extensions = [] }: EditorProps): Initialized {
  const extData: ExtensionData = {
    commands: {},
    marks: {},
    markViews: {},
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
        extData.nodeViews[name] = value.nodeView(editor)
      }
    }
    for (const name in ext.marks) {
      if (name in extData.marks) {
        throw Error(`@my-org/core: duplicate mark "${name}" provided from extension ${key}`)
      }
      const { schema, markView } = ext.marks[name]
      if (schema) {
        extData.marks[name] = schema
      }
      if (markView) {
        extData.markViews[name] = markView
      }
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

  const keymaps = Object.keys(extData.sortedKeymaps).reduce(
    (acc, key) => {
      // @ts-ignore
      acc[key] = extData.sortedKeymaps[key][0].cmd
      return acc
    },
    {} as { [key: string]: Command }
  )

  const plugins = [
    keymap(keymaps),
    ...extensions.reduce(
      (acc, ext) => [...acc, ...((ext.plugins && ext.plugins(editor, schema)) || [])],
      [] as Plugin[]
    )
  ]
  return { ...extData, plugins, schema }
}

import { get, Writable, writable } from 'svelte/store'

import { init } from './createEditor'
import { ViewProvider } from './providers/ViewProvider'
import { ExtensionProvider } from './providers/ExtensionProvider'

import type { Schema } from 'prosemirror-model'
import type { Plugin } from 'prosemirror-state'
import type { NodeViewConstructor } from 'prosemirror-view'
import type { EditorView } from 'prosemirror-view'
import type { Commands, EditorProps } from './typings'

export class Editor {
  props = writable<EditorProps | undefined>()
  viewProvider = new ViewProvider()
  extProvider = new ExtensionProvider()

  editorView: EditorView | undefined
  // plugins = writable<Plugin[]>([])
  // commands = writable<Commands>({})
  // schema = writable<Schema>()
  // nodeViews = writable<{ [node: string]: NodeViewConstructor }>({})

  constructor() {
    return this
  }

  setProps(props: EditorProps) {
    this.props.set(props)
    return this
  }

  config(cb: (editor: Editor) => void) {
    return this
  }

  create(dom: HTMLElement) {
    const editorProps = get(this.props) ?? {}
    this.extProvider.init(this, editorProps)
    this.editorView = init(dom, this, editorProps ?? {}, this.editorView)
    this.extProvider.initExtensions(this)
    return this
  }

  recreate(props: EditorProps = {}) {
    this.extProvider.init(this, props)
    const dom = this.editorView?.dom
    if (!dom) {
      throw Error(
        `@my-org/core: No DOM node to which to mount the editor, has the EditorView already been destroyed?`
      )
    }
    this.editorView = init(dom, this, props, this.editorView)
    this.extProvider.initExtensions(this)
    return this
  }

  destroy() {
    this.extProvider.destroy()
    this.editorView?.destroy()
  }

  static create(props: EditorProps, dom: HTMLElement) {
    return new Editor().setProps(props).create(dom)
  }
}

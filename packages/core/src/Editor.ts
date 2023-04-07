import { get, Writable, writable } from 'svelte/store'

import { init } from './createEditor'
import { createProviders } from './providers'
import { ViewProvider } from './providers/ViewProvider'
import { ExtensionProvider } from './providers/ExtensionProvider'

import type { Schema } from 'prosemirror-model'
import type { Plugin } from 'prosemirror-state'
import type { NodeViewConstructor } from 'prosemirror-view'
import type { EditorView } from 'prosemirror-view'
import type { Commands, CreateExtension, EditorContext, EditorProps } from './typings'

export class Editor {
  ctx: EditorContext
  props = writable<EditorProps | undefined>()

  editorView: EditorView | undefined
  // plugins = writable<Plugin[]>([])
  // commands = writable<Commands>({})
  // schema = writable<Schema>()
  // nodeViews = writable<{ [node: string]: NodeViewConstructor }>({})

  constructor() {
    this.ctx = {
      viewProvider: new ViewProvider(),
      extProvider: new ExtensionProvider()
    }
  }

  get view(): ViewProvider {
    return this.ctx.viewProvider
  }

  get extProvider(): ExtensionProvider {
    return this.ctx.extProvider
  }

  setProps(props: EditorProps) {
    this.props.set(props)
    return this
  }

  config(cb: (ctx: EditorContext) => void) {
    return this
  }

  create(dom: HTMLElement) {
    const editorProps = get(this.props) ?? {}
    this.extProvider.init(this.ctx, editorProps)
    this.editorView = init(dom, this.ctx, editorProps ?? {}, this.editorView)
    return this
  }

  destroy() {
    this.extProvider.destroy()
    this.editorView?.destroy()
  }

  static make() {
    return new Editor()
  }
}

import { EditorState, Transaction } from 'prosemirror-state'
import { get, Writable, writable } from 'svelte/store'

import { createExtensions } from './createExtensions'

import type { Schema } from 'prosemirror-model'
import type { Plugin } from 'prosemirror-state'
import type { NodeViewConstructor } from 'prosemirror-view'
import { EditorView } from 'prosemirror-view'
import type { Command, Commands, EditorProps, Extensions, JSONEditorState } from './typings'

export class Editor {
  #editorView: EditorView | undefined

  state = writable<EditorState | undefined>()
  props = writable<EditorProps | undefined>()
  editable = writable<boolean>(true)
  // plugins = writable<Plugin[]>([])
  // commands = writable<Commands>({})
  // schema = writable<Schema>()
  // nodeViews = writable<{ [node: string]: NodeViewConstructor }>({})

  constructor() {
    return this
  }

  get editorView() {
    if (this.#editorView === undefined) {
      throw Error(
        '@my-org/core: Accessed undefined EditorView, did you initialize your Editor properly?'
      )
    }
    return this.#editorView
  }

  get commands() {
    const self = this
    return {
      focus() {
        const view = self.editorView
        const state = view.state
        if (view.hasFocus()) {
          return false
        }
        view.focus()
        view.dispatch(state.tr.scrollIntoView())
        return true
      }
    }
  }

  get fromJSON() {
    const self = this
    return {
      doc: (json: unknown) => self.setState({ doc: json }),
      state: (json: unknown) => self.setState(json)
    }
  }

  get toJSON() {
    const self = this
    return {
      doc: () => self.editorView.state.doc.toJSON(),
      state: () =>
        ({ ...self.editorView.state.toJSON(), plugins: [] } as unknown as JSONEditorState)
    }
  }

  getExtensions() {
    return get(this.props)?.extensions || []
  }

  cmd(cmd: Command) {
    const view = this.editorView
    const state = view.state
    cmd(state, view.dispatch, view)
    this.commands.focus()
    return this
  }

  setProps(props: EditorProps) {
    this.props.set(props)
    return this
  }

  setState(value: EditorState | unknown) {
    const view = this.editorView
    let newState: EditorState
    if (!(value instanceof EditorState)) {
      newState = EditorState.fromJSON(
        {
          schema: view.state.schema,
          plugins: view.state.plugins
        },
        value
      )
    } else {
      newState = value
    }
    view.updateState(newState)
    this.state.set(newState)
  }

  initExtensions(editor: Editor) {
    const extensions = get(this.props)?.extensions || []
    for (const name in extensions) {
      const ext = extensions[name]
      if (ext.init) ext.init(editor)
    }
  }

  getExtension<K extends keyof Extensions>(name: K) {
    return this.getExtensions().find(e => e.name === name) as Extensions[K] | undefined
  }

  config(cb: (editor: Editor) => void) {
    cb(this)
    return this
  }

  create(dom: HTMLElement) {
    const editorProps = get(this.props) ?? {}
    const created = createExtensions(this, editorProps)
    const newState = EditorState.create({
      schema: created.schema,
      plugins: created.plugins
    })
    const oldView = this.#editorView
    let view = oldView
    if (oldView) {
      const self = this
      oldView.setProps({
        state: newState,
        dispatchTransaction(tr: Transaction) {
          if (!this.state) return
          const oldEditorState = this.state
          const newState = oldEditorState.apply(tr)
          self.setState(newState)
          editorProps.onEdit && editorProps.onEdit(newState)
        }
      })
    } else {
      const self = this
      view = new EditorView(
        { mount: dom },
        {
          state: newState,
          nodeViews: created.nodeViews,
          dispatchTransaction(tr: Transaction) {
            const oldEditorState = this.state
            const { state: newState } = oldEditorState.applyTransaction(tr)
            self.setState(newState)
            editorProps.onEdit && editorProps.onEdit(newState)
          }
        }
      )
    }
    this.#editorView = view
    this.state.set(view?.state)
    this.initExtensions(this)
    editorProps.onEditorReady && editorProps.onEditorReady(this)
    return this
  }

  recreate(props?: EditorProps) {
    const dom = this.#editorView?.dom
    if (!dom) {
      throw Error(
        `@my-org/core: No DOM node to which to mount the editor, has the EditorView already been destroyed?`
      )
    }
    if (props) {
      this.setProps(props)
    }
    return this.create(dom)
  }

  destroy() {
    this.getExtensions().forEach(e => {
      if (e.destroy) e.destroy()
    })
    this.#editorView?.destroy()
  }

  static create(props: EditorProps, dom: HTMLElement) {
    return new Editor().setProps(props).create(dom)
  }
}

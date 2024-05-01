import { Fragment, Mark, Node as PMNode } from 'prosemirror-model'
import { EditorState, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { derived, get, writable } from 'svelte/store'

import { createExtensions } from './createExtensions'
import { commands } from './commands'
import { Observable } from './Observable'

import type {
  Cmd,
  DocJSON,
  EditorProps,
  Extensions,
  ExtObject,
  EditorStateJSON,
  Nodes,
  EditorCommands
} from './typings'

type EditorEvents = {
  ready: (editor: Editor) => void
  edit: (state: EditorState) => void
  destroy: (editor: Editor) => void
}

export class Editor extends Observable<EditorEvents> {
  private _editorView: EditorView | undefined

  commands: typeof commands & EditorCommands = commands
  state = writable<EditorState | undefined>()
  props = writable<EditorProps | undefined>()
  editable = writable<boolean>(true)
  extensions = derived(this.props, p => p?.extensions || [])
  extObj = writable<ExtObject>({})

  constructor() {
    super()
    return this
  }

  get editorView() {
    if (this._editorView === undefined) {
      throw Error(
        '@my-org/core: Accessed undefined EditorView, did you initialize your Editor properly?'
      )
    }
    return this._editorView
  }

  get cmds() {
    const cmds = this.commands
    // @TODO type this thing
    const val: Record<string, (...params: any[]) => this> = {}
    const self = this
    for (const name in cmds) {
      const cmdKey = name as keyof typeof cmds
      if (typeof cmds[cmdKey] === 'object') {
        const subCmds: any = {}
        for (const subName in cmds[cmdKey]) {
          // @ts-ignore
          subCmds[subName] = (...params: any[]) => self.cmd(cmds[cmdKey][subName](...params) as Cmd)
        }
        val[cmdKey] = subCmds
      } else {
        val[name] = (...params: any[]) =>
          // @ts-ignore
          self.cmd(cmds[name as keyof typeof cmds](...params) as Cmd)
      }
    }
    return val
  }

  get fromJSON() {
    const self = this
    return {
      doc: (json: DocJSON) => self.setState({ doc: json }),
      state: (json: EditorStateJSON) => self.setState(json)
    }
  }

  get toJSON() {
    const self = this
    return {
      doc: () => self.editorView.state.doc.toJSON() as DocJSON,
      state: () => ({ ...self.editorView.state.toJSON() }) as EditorStateJSON
    }
  }

  // @TODO needs createMark, setAttributes, isEqual
  // maybe monkey-patch state instead..?

  createNode<K extends keyof Nodes>(
    name: K,
    attrs?: Nodes[K],
    content?: Fragment | PMNode[] | PMNode[],
    marks?: Mark[]
  ) {
    const nodes = this.editorView.state.schema.nodes
    if (!(name in nodes)) {
      throw Error(`@my-org/core: Tried to non-existent createNode: ${name}`)
    }
    return nodes[name].createChecked(attrs, content, marks)
  }

  getExtensions() {
    return get(this.props)?.extensions || []
  }

  cmd(cmd: Cmd) {
    const view = this.editorView
    const state = view.state
    cmd(state, view.dispatch, view)
    this.commands.focus()(view.state, view.dispatch, view)
    return this
  }

  setProps(props: EditorProps) {
    this.props.set(props)
    return this
  }

  setState(stateOrJSON: EditorState | EditorStateJSON | DocJSON) {
    const view = this.editorView
    let newState: EditorState
    if (!(stateOrJSON instanceof EditorState)) {
      newState = EditorState.fromJSON(
        {
          schema: view.state.schema,
          plugins: view.state.plugins
        },
        stateOrJSON
      )
    } else {
      newState = stateOrJSON
    }
    view.updateState(newState)
    this.state.set(newState)
  }

  getExtension<K extends keyof Extensions>(name: K) {
    const found = this.getExtensions().find(e => e.name === name)
    if (!found) {
      throw Error(`@my-org/core: Could not find extension "${name}"`)
    }
    return found as Extensions[K]
  }

  maybeGetExtension<K extends keyof Extensions>(name: K) {
    return this.getExtensions().find(e => e.name === name) as Extensions[K] | undefined
  }

  config(cb: (editor: Editor) => void) {
    cb(this)
    return this
  }

  run(dom: HTMLElement, props: EditorProps = {}) {
    const created = createExtensions(this, props)
    const oldProps = get(this.props)
    const newState = EditorState.create({
      schema: created.schema,
      plugins: created.plugins,
      doc: props.doc ? created.schema.nodeFromJSON(props.doc) : undefined
    })
    const oldView = this._editorView
    let view = oldView
    if (oldView) {
      const self = this
      // Recreate only extensions that have changed
      if (props !== oldProps) {
        oldProps?.extensions?.forEach(ext => {
          if (!props.extensions?.find(e => e === ext)) {
            if (ext.destroy) ext.destroy()
          }
        })
      }
      oldView.setProps({
        state: newState,
        markViews: created.markViews,
        nodeViews: created.nodeViews,
        dispatchTransaction(tr: Transaction) {
          if (!this.state) return
          const oldEditorState = this.state
          const newState = oldEditorState.apply(tr)
          self.setState(newState)
          self.emit('edit', newState)
        }
      })
      oldView['editor'] = this
    } else {
      const self = this
      view = new EditorView(
        { mount: dom },
        {
          state: newState,
          markViews: created.markViews,
          nodeViews: created.nodeViews,
          dispatchTransaction(tr: Transaction) {
            const oldEditorState = this.state
            const newState = oldEditorState.apply(tr)
            self.setState(newState)
            self.emit('edit', newState)
          }
        }
      )
      view['editor'] = this
    }
    this._editorView = view
    this.state.set(view?.state)
    this.props.set(props)
    const extObj = {} as ExtObject
    const cmds: typeof commands & EditorCommands = { ...commands }
    props.extensions?.forEach(ext => {
      if (ext.init) ext.init(this)
      // @ts-ignore
      extObj[ext.name] = ext
      if ('commands' in ext) {
        // @ts-ignore
        cmds[ext.name] = ext.commands
      }
    })
    this.commands = cmds
    this.extObj.set(extObj)
    this.emit('ready', this)
    return this
  }

  rerun(props?: EditorProps) {
    const dom = this._editorView?.dom
    if (!dom) {
      throw Error(
        `@my-org/core: Can't recreate Editor, editorView.dom doesn't exist - has EditorView already been destroyed?`
      )
    }
    return this.run(dom, props)
  }

  destroy() {
    this.emit('destroy', this)
    this.getExtensions().forEach(e => {
      if (e.destroy) e.destroy()
    })
    this._editorView?.destroy()
  }

  static create(dom: HTMLElement, props?: EditorProps) {
    return new Editor().run(dom, props)
  }
}

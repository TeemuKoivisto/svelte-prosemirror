import { Fragment, Mark, Node as PMNode } from 'prosemirror-model'
import { EditorState, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

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

interface MutableData {
  state: EditorState
  props: EditorProps
  editable: boolean
  extObj: ExtObject
}
type UpdateArgs = { [K in keyof MutableData]: [field: K, value: MutableData[K]] }[keyof MutableData]
type EditorEvents = {
  ready(editor: Editor): void
  update(...[field, value]: UpdateArgs): void
  destroy(editor: Editor): void
}

export class Editor extends Observable<EditorEvents> {
  private _editorView: EditorView | undefined

  commands: typeof commands & EditorCommands = commands
  data: MutableData | undefined = undefined

  constructor() {
    super()
    return this
  }

  get editorView(): EditorView {
    if (this._editorView === undefined) {
      throw Error(
        '@my-org/core: Accessed undefined EditorView, did you initialize your Editor properly?'
      )
    }
    return this._editorView
  }

  get extensions() {
    return this.data?.props?.extensions || []
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

  docFromJSON(json: DocJSON) {
    return this.setState({ doc: json })
  }

  stateFromJSON(json: EditorStateJSON) {
    return this.setState(json)
  }

  docToJSON() {
    return this.editorView.state.doc.toJSON() as DocJSON
  }

  stateToJSON() {
    return this.editorView.state.toJSON() as EditorStateJSON
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

  cmd(cmd: Cmd) {
    const view = this.editorView
    const state = view.state
    cmd(state, view.dispatch, view)
    this.commands.focus()(view.state, view.dispatch, view)
    return this
  }

  setProps(props: EditorProps) {
    if (!this.data) {
      throw Error(`@my-org/core: Trying to setProps on uninitialized editor`)
    }
    this.data = { ...this.data, props }
    this.emit('update', 'props', props)
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
    if (this.data) {
      this.data = { ...this.data, state: newState }
    }
    this.emit('update', 'state', newState)
    return this
  }

  getExtension<K extends keyof Extensions>(name: K) {
    const found = this.extensions.find(e => e.name === name)
    if (!found) {
      throw Error(`@my-org/core: Could not find extension "${name}"`)
    }
    return found as Extensions[K]
  }

  maybeGetExtension<K extends keyof Extensions>(name: K) {
    return this.extensions.find(e => e.name === name) as Extensions[K] | undefined
  }

  config(cb: (editor: Editor) => void) {
    cb(this)
    return this
  }

  run(dom: HTMLElement, props: EditorProps = {}) {
    const created = createExtensions(this, props)
    const oldProps = this.data?.props
    const newState = EditorState.create({
      schema: created.schema,
      plugins: created.plugins,
      doc: props.doc ? created.schema.nodeFromJSON(props.doc) : undefined
    })
    let view = this._editorView
    if (view) {
      const self = this
      // Recreate only extensions that have changed
      if (props !== oldProps) {
        oldProps?.extensions?.forEach(ext => {
          if (!props.extensions?.find(e => e === ext)) {
            if (ext.destroy) ext.destroy()
          }
        })
      }
      view.setProps({
        state: newState,
        markViews: created.markViews,
        nodeViews: created.nodeViews,
        dispatchTransaction(tr: Transaction) {
          if (!this.state) return
          const oldEditorState = this.state
          const newState = oldEditorState.apply(tr)
          self.setState(newState)
        }
      })
      view['editor'] = this
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
          }
        }
      )
      view['editor'] = this
    }
    this._editorView = view as EditorView
    this.data = {
      state: this._editorView.state,
      props,
      editable: this._editorView.editable,
      extObj: {}
    }
    this.commands = { ...commands }
    props.extensions?.forEach(ext => {
      if (ext.init) ext.init(this)
      // @ts-ignore
      this.data.extObj[ext.name] = ext
      if ('commands' in ext) {
        // @ts-ignore
        this.commands[ext.name] = ext.commands
      }
    })
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
    this.extensions.forEach(e => {
      if (e.destroy) e.destroy()
    })
    this._editorView?.destroy()
  }

  static create(dom: HTMLElement, props?: EditorProps) {
    return new Editor().run(dom, props)
  }
}

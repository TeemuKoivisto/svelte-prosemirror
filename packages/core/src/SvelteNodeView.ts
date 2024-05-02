import { Attrs, DOMSerializer, Node as PMNode } from 'prosemirror-model'
import type {
  Decoration,
  DecorationSource,
  EditorView,
  NodeView,
  NodeViewConstructor
} from 'prosemirror-view'

import type { SvelteComponent } from 'svelte'
import type { Editor } from './typings'

export interface SvelteNodeViewProps<A extends Attrs> {
  node: PMNode
  attrs: A
  contentDOM: (node: HTMLElement) => void
  selected: boolean | undefined
  view: EditorView
  getPos: () => number | undefined
  decorations: readonly Decoration[]
  innerDecorations: DecorationSource
  editor: Editor
}

export class SvelteNodeView<A extends Attrs> implements NodeView {
  protected _dom?: HTMLElement
  contentDOM?: HTMLElement

  node: PMNode
  decorations: readonly Decoration[]
  innerDecorations: DecorationSource

  selected: boolean | undefined
  editor: Editor
  component?: typeof SvelteComponent<SvelteNodeViewProps<A>>
  mounted?: SvelteComponent

  constructor(
    node: PMNode,
    readonly view: EditorView,
    readonly getPos: () => number | undefined,
    decorations: readonly Decoration[],
    innerDecorations: DecorationSource,
    editor: Editor,
    component?: typeof SvelteComponent<SvelteNodeViewProps<A>>
  ) {
    this.node = node
    this.view = view
    this.decorations = decorations
    this.innerDecorations = innerDecorations
    this.editor = editor
    this.component = component
  }

  get dom() {
    if (!this._dom) {
      throw Error(
        '@my-org/core: Accessing uninitialized dom inside SvelteNodeView! Check your "init" method'
      )
    }
    return this._dom
  }

  get props(): SvelteNodeViewProps<A> {
    return {
      node: this.node,
      attrs: this.node.attrs as A,
      selected: this.selected,
      view: this.view,
      getPos: this.getPos,
      decorations: this.decorations,
      innerDecorations: this.innerDecorations,
      editor: this.editor,
      contentDOM: (node: HTMLElement) => {
        if (this.contentDOM) {
          node.appendChild(this.contentDOM)
        }
      }
    }
  }

  init = (): this => {
    const toDOM = this.node.type.spec.toDOM
    if (!toDOM) throw Error(`@my-org/core: node "${this.node.type}" was not given a toDOM method!`)
    const { dom, contentDOM } = DOMSerializer.renderSpec(document, toDOM(this.node))
    // this._dom = dom as HTMLElement
    this.contentDOM = contentDOM
    this._dom = document.createElement(this.node.type.spec.inline ? 'span' : 'div')
    if (this.component) {
      this.mounted = new this.component({ target: this.dom, props: this.props })
    } else {
      contentDOM && this._dom.appendChild(contentDOM)
    }
    return this
  }

  render() {
    this.mounted?.$$set && this.mounted?.$$set(this.props)
  }

  shouldUpdate = (node: PMNode) => {
    // console.log('should update')
    if (node.type !== this.node.type) {
      return false
    } else if (node.sameMarkup(this.node)) {
      return false
    }
    return true
  }

  update = (
    node: PMNode,
    decorations: readonly Decoration[],
    innerDecorations: DecorationSource
  ): boolean => {
    // if (!newNode.sameMarkup(this.node)) return false
    if (node.type.name !== this.node.type.name) {
      return false
    }
    this.node = node
    this.decorations = decorations
    this.innerDecorations = innerDecorations
    this.render()
    return true
  }

  selectNode = () => {
    // console.log('selectNode ')
    this.selected = true
    this.render()
  }

  deselectNode = () => {
    // console.log('deselectNode ')
    this.selected = false
    this.render()
  }

  destroy = () => {
    this.mounted?.$destroy()
  }

  ignoreMutation = (_mutation: MutationRecord) => true

  static fromComponent<A extends Attrs>(
    editor: Editor,
    component?: typeof SvelteComponent<SvelteNodeViewProps<A>>
  ): NodeViewConstructor {
    return (
      node: PMNode,
      view: EditorView,
      getPos: () => number | undefined,
      decorations: readonly Decoration[],
      innerDecorations: DecorationSource
    ) => new this(node, view, getPos, decorations, innerDecorations, editor, component).init()
  }
}

import { Attrs, Node as PMNode } from 'prosemirror-model'
import type {
  Decoration,
  DecorationSource,
  EditorView,
  NodeView,
  NodeViewConstructor
} from 'prosemirror-view'

import type { SvelteComponentTyped } from 'svelte'
import type { EditorContext } from './typings'

export interface SvelteNodeViewProps {
  node: PMNode
  attrs: Attrs
  selected: boolean | undefined
  view: EditorView
  getPos: () => number
  decorations: readonly Decoration[]
  innerDecorations: DecorationSource
  ctx: EditorContext
}

export class SvelteNodeView implements NodeView {
  protected _dom?: HTMLElement
  contentDOM?: HTMLElement

  node: PMNode
  decorations: readonly Decoration[]
  innerDecorations: DecorationSource

  selected: boolean | undefined
  ctx: EditorContext
  component: SvelteComponentTyped<{}>
  #mounted?: SvelteComponentTyped

  constructor(
    node: PMNode,
    readonly view: EditorView,
    readonly getPos: () => number,
    decorations: readonly Decoration[],
    innerDecorations: DecorationSource,
    ctx: EditorContext,
    component: SvelteComponentTyped<SvelteNodeViewProps>
  ) {
    this.node = node
    this.view = view
    this.decorations = decorations
    this.innerDecorations = innerDecorations
    this.ctx = ctx
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

  get props(): SvelteNodeViewProps {
    return {
      node: this.node,
      attrs: this.node.attrs,
      selected: this.selected,
      view: this.view,
      getPos: this.getPos,
      decorations: this.decorations,
      innerDecorations: this.innerDecorations,
      ctx: this.ctx
    }
  }

  init = (): this => {
    const toDOM = this.node.type.spec.toDOM
    if (!toDOM) throw Error(`@my-org/core: node "${this.node.type}" was not given a toDOM method!`)
    // const { dom, contentDOM } = DOMSerializer.renderSpec(document, toDOM(this.node))
    // this._dom = dom as HTMLElement
    // this.contentDOM = contentDOM
    // console.log('dom', dom)
    // console.log('contentDOM', contentDOM)
    this._dom = document.createElement(this.node.type.spec.inline ? 'span' : 'div')
    // @ts-ignore
    this.#mounted = new this.component({ target: this.dom, props: this.props })
    console.log('mounted', this.#mounted)
    return this
  }

  render() {
    this.#mounted?.$$set && this.#mounted?.$$set(this.props)
  }

  shouldUpdate = (node: PMNode) => {
    console.log('should update')
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
    console.log('update')
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
    console.log('selectNode ')
    this.selected = true
    this.render()
  }

  deselectNode = () => {
    console.log('deselectNode ')
    this.selected = false
    this.render()
  }

  destroy = () => {
    this.#mounted?.$destroy()
  }

  ignoreMutation = () => true

  static fromComponent(
    ctx: EditorContext,
    component: SvelteComponentTyped<SvelteNodeViewProps>
  ): NodeViewConstructor {
    return (
      node: PMNode,
      view: EditorView,
      getPos: () => number,
      decorations: readonly Decoration[],
      innerDecorations: DecorationSource
    ) => new this(node, view, getPos, decorations, innerDecorations, ctx, component).init()
  }
}

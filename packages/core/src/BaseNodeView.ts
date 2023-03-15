import { DOMSerializer, Node as PMNode } from 'prosemirror-model'
import type {
  Decoration,
  DecorationSource,
  EditorView,
  NodeView,
  NodeViewConstructor
} from 'prosemirror-view'
import type { SvelteComponentTyped } from 'svelte'

import type { EditorContext } from './typings'

export class BaseNodeView implements NodeView {
  protected _dom?: HTMLElement
  contentDOM?: HTMLElement

  node: PMNode
  decorations: readonly Decoration[]
  innerDecorations: DecorationSource
  ctx: EditorContext
  component?: SvelteComponentTyped<{}>
  #mounted?: SvelteComponentTyped

  constructor(
    node: PMNode,
    readonly view: EditorView,
    readonly getPos: () => number,
    decorations: readonly Decoration[],
    innerDecorations: DecorationSource,
    ctx: EditorContext,
    component?: SvelteComponentTyped<{}>
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
      throw Error('Accessing uninitialized dom inside BaseNodeView! Check your "init" method')
    }
    return this._dom
  }

  /**
   * Override this
   */
  init = (): this => {
    // if (this.component) {
    //   this._dom = document.createElement(this.node.type.spec.inline ? 'span' : 'div')
    //   // @ts-ignore
    //   this.#mounted = new this.component({ target: this.dom, props: { node: this.node, attrs: this.node.attrs } })
    // }
    const toDOM = this.node.type.spec.toDOM
    if (toDOM) {
      const { dom, contentDOM } = DOMSerializer.renderSpec(document, toDOM(this.node))
      this._dom = dom as HTMLElement
      this.contentDOM = contentDOM
      console.log('dom', dom)
      console.log('contentDOM', contentDOM)
    }
    return this
  }

  /**
   * Override this
   */
  updateContents = (): void => {}

  shouldUpdate: (node: PMNode) => boolean = node => {
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
    this.updateContents()
    return true
  }

  setDomAttrs(node: PMNode, element: HTMLElement, omit: string[] = []) {
    Object.keys(node.attrs || {}).forEach(attr => {
      if (!omit.includes(attr)) {
        element.setAttribute(attr, node.attrs[attr])
      }
    })
  }

  selectNode = () => {
    this.dom.classList.add('ProseMirror-selectednode')
  }

  deselectNode = () => {
    this.dom.classList.remove('ProseMirror-selectednode')
  }

  destroy = () => {}

  static fromComponent<P>(
    ctx: EditorContext,
    component?: SvelteComponentTyped<{}>
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

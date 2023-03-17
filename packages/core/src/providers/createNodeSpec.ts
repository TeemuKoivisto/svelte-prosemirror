import { DOMOutputSpec, Node as PMNode, NodeSpec } from 'prosemirror-model'

import { getAttrsWithOutputSpec } from './getAttrsWithOutputSpec'
import { SveltePMNode } from '../typings'
import { htmlToDOMOutputSpec } from './htmlToDOMOutputSpec'

export function createNodeSpec(node: SveltePMNode): NodeSpec {
  const { attrs, schema, component } = node
  const nodeSpec = {
    ...schema
  }
  const staticSpec = createSpec(node)
  if (component) {
    nodeSpec.toDOM = (node: PMNode) => {
      const div = document.createElement('div')
      const comp = new component({
        target: div,
        props: {
          node,
          attrs: node.attrs
        }
      })
      const spec = htmlToDOMOutputSpec(comp.$$.root.firstChild)
      console.log('spec', spec)
      return spec as unknown as DOMOutputSpec
    }
    nodeSpec.parseDOM = [
      ...(nodeSpec.parseDOM || []),
      {
        tag: staticSpec[0],
        getAttrs: (dom: HTMLElement | string) => {
          if (dom instanceof HTMLElement) {
            return getAttrsWithOutputSpec(staticSpec, dom, { selector: [] })
          }
          return null
        }
      }
    ]
    // nodeViews[name] = BaseNodeView.fromComponent(ctx, component)
  }
  return nodeSpec
}

export function createSpec(node: SveltePMNode): readonly [string, ...any[]] {
  const { attrs, schema, component } = node
  if (!component && schema?.toDOM === undefined) {
    throw Error(
      `You must provide either Svelte component or schema.toDOM method for your Svelte PMNode!`
    )
  } else if (!component && schema?.toDOM) {
    return ['']
    // return schema.toDOM
  }
  const div = document.createElement('div')
  const comp = new component({
    target: div,
    props: {
      node: undefined,
      attrs: attrs || {}
    }
  })
  const spec = htmlToDOMOutputSpec(comp.$$.root.firstChild)
  console.log('spec', spec)
  // @TODO add class list for 'tag'
  return spec as [string, ...any[]]
}

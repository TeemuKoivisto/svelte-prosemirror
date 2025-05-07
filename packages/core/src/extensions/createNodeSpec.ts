import { DOMOutputSpec, Node as PMNode, NodeSpec } from 'prosemirror-model'

import { getAttrsWithOutputSpec } from './getAttrsWithOutputSpec'
import { SveltePMNode } from '../typings'
import { htmlToDOMOutputSpec } from './htmlToDOMOutputSpec'

import { mount } from 'svelte'

export async function createNodeSpec(node: SveltePMNode<any>): Promise<NodeSpec> {
  const { schema } = node
  const nodeSpec = {
    ...schema
  }
  const component = node.component // || node.nodeView
  if (component) {
    const staticSpec = await createSpec(node)
    nodeSpec.toDOM = (node: PMNode) => {
      const div = document.createElement('div')
      const comp = mount(component, {
        target: div,
        props: {
          node,
          attrs: node.attrs,
          contentDOM: () => undefined
        }
      })
      comp.then((comp: any) => {
        const spec = htmlToDOMOutputSpec(comp.$$.root.firstChild)
        // console.log('spec', spec)
        return spec as unknown as DOMOutputSpec
      })
      return div
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
  } else if (!component && schema?.toDOM === undefined) {
    throw Error(
      `You must provide either Svelte component or schema.toDOM method for your Svelte PMNode!`
    )
  }
  return nodeSpec
}

export async function createSpec(node: SveltePMNode<any>): Promise<readonly [string, ...any[]]> {
  const { attrs, component } = node
  if (!component) {
    return ['']
  }
  const div = document.createElement('div')
  const comp = await mount(component, {
    target: div,
    props: {
      node: undefined,
      attrs,
      contentDOM: () => undefined
    }
  })
  const spec = htmlToDOMOutputSpec(comp.$$.root.firstChild)
  // console.log('spec', spec)
  // @TODO add class list for 'tag'
  return spec as [string, ...any[]]
}

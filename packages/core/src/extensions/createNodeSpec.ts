import { getAttrsWithOutputSpec } from './getAttrsWithOutputSpec.js';
import { htmlToDOMOutputSpec } from './htmlToDOMOutputSpec.js';
import { SveltePMNode } from '../typings/index.js';
import { DOMOutputSpec, Node as PMNode, NodeSpec } from 'prosemirror-model';
import { mount } from 'svelte';

export async function createNodeSpec(node: SveltePMNode<any>): Promise<NodeSpec> {
	const { schema } = node;
	const nodeSpec = {
		...schema,
	};
	const component = node.component; // || node.nodeView
	if (component) {
		const staticSpec = await createSpec(node);
		nodeSpec.toDOM = (node: PMNode) => {
			// ===== Clone the static spec to avoid modifying the original
			const clonedSpec = [...staticSpec];

			// If the spec has attributes (usually at index 1 if present)
			if (
				typeof clonedSpec[1] === 'object' &&
				clonedSpec[1] !== null &&
				!Array.isArray(clonedSpec[1])
			) {
				// Merge the node's attributes with the static attributes
				clonedSpec[1] = { ...clonedSpec[1], ...node.attrs };
			} else if (Object.keys(node.attrs).length > 0) {
				// If there are no attributes in the spec but the node has attributes, add them
				clonedSpec.splice(1, 0, { ...node.attrs });
			}

			return clonedSpec as unknown as DOMOutputSpec;
		};
		nodeSpec.parseDOM = [
			...(nodeSpec.parseDOM || []),
			{
				tag: staticSpec[0],
				getAttrs: (dom: HTMLElement | string) => {
					if (dom instanceof HTMLElement) {
						return getAttrsWithOutputSpec(staticSpec, dom, { selector: [] });
					}
					return null;
				},
			},
		];
	} else if (!component && schema?.toDOM === undefined) {
		throw Error(
			`You must provide either Svelte component or schema.toDOM method for your Svelte PMNode!`,
		);
	}
	return nodeSpec;
}

export async function createSpec(node: SveltePMNode<any>): Promise<readonly [string, ...any[]]> {
	const { attrs, component } = node;
	if (!component) {
		return [''];
	}
	const div = document.createElement('div');
	// eslint-disable-next-line @typescript-eslint/await-thenable
	const comp = (await mount(component, {
		target: div,
		props: {
			node: undefined,
			attrs,
			contentDOM: () => undefined,
		},
	})) as any;
	// const spec = htmlToDOMOutputSpec(comp.$$.root.firstChild)
	const spec = htmlToDOMOutputSpec(comp.ref);
	// console.log('spec', spec)
	// @TODO add class list for 'tag'
	return spec as [string, ...any[]];
}

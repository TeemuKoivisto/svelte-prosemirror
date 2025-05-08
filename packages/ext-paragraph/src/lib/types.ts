import type { Component } from 'svelte';
import type { Node as PMNode } from 'prosemirror-model';

type Props = { node: PMNode } & {
	indent: number;
};

export interface Paragraph extends Component<Props> {}

import type { Node as PMNode } from 'prosemirror-model';
import type { Component } from 'svelte';

type Props = { node: PMNode } & {
	indent: number;
};

export interface Paragraph extends Component<Props> {}

import type { MarkSpec } from 'prosemirror-model';

export const strikethrough: MarkSpec = {
	attrs: { dataTracked: { default: null } },
	parseDOM: [
		{ tag: 's' },
		{ tag: 'strike' },
		{ style: 'text-decoration=line-through' },
		{ style: 'text-decoration-line=line-through' },
	],
	toDOM: () => ['s'],
};

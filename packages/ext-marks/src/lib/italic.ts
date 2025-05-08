import type { MarkSpec } from 'prosemirror-model';

// :: MarkSpec An emphasis mark. Rendered as an `<em>` element.
// Has parse rules that also match `<i>` and `font-style: italic`.
export const italic: MarkSpec = {
	attrs: { dataTracked: { default: null } },
	parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
	toDOM() {
		return ['em', 0];
	},
};

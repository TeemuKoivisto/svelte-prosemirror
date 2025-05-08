import Equation, { equationAttrs, equationSchema } from './Equation.svelte';

import { SvelteNodeView } from '@my-org/core';

import type { Extension } from '@my-org/core';

export const equationExtension = () => {
	return {
		name: 'equation' as const,
		nodes: {
			equation: {
				attrs: equationAttrs,
				schema: equationSchema,
				nodeView: editor => SvelteNodeView.fromComponent(editor, Equation),
				// component: Equation
			},
		},
	} satisfies Extension;
};

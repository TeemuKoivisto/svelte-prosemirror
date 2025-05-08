import Paragraph, { paragraphAttrs, paragraphSchema } from './Paragraph.svelte';
import type { Extension } from '@my-org/core';

export function paragraphExtension() {
	return {
		name: 'paragraph' as const,
		nodes: {
			paragraph: {
				attrs: paragraphAttrs,
				schema: paragraphSchema,
				component: Paragraph,
			},
		},
	} satisfies Extension;
}

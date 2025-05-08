import Figcaption, { figcaptionAttrs, figcaptionSchema } from './Figcaption.svelte';
import Figure, { figureAttrs, figureSchema } from './Figure.svelte';
import Image, { imageAttrs, imageSchema } from './Image.svelte';
import type { Extension } from '@my-org/core';

export const figureExtension = () => {
	return {
		name: 'figure' as const,
		nodes: {
			figcaption: {
				attrs: figcaptionAttrs,
				schema: figcaptionSchema,
				component: Figcaption,
			},
			figure: {
				attrs: figureAttrs,
				schema: figureSchema,
				component: Figure,
			},
			image: {
				attrs: imageAttrs,
				schema: imageSchema,
				component: Image,
			},
		},
	} satisfies Extension;
};

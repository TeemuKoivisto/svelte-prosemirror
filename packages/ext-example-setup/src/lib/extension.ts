import { exampleSetup } from 'prosemirror-example-setup';
import { Schema } from 'prosemirror-model';
import 'prosemirror-state';

import type { Extension } from '@my-org/core';
import type { Plugin } from 'prosemirror-state';

export const exampleSetupExtension = (opts: Partial<Parameters<typeof exampleSetup>[0]>) => {
	return {
		name: 'example-setup' as const,
		plugins(_, schema: Schema): Plugin[] {
			return exampleSetup({ ...opts, schema });
		},
	} satisfies Extension;
};

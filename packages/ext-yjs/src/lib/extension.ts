import { YjsStore } from './YjsStore';
import * as commands from './commands';
import { yjsExtensionName } from './types';
import { redo, undo, yCursorPlugin, ySyncPlugin, yUndoPlugin } from 'y-prosemirror';
import type { YjsOptions } from './types';
import type { Extension } from '@my-org/core';
import type { Plugin } from 'prosemirror-state';

export const yjsExtension = (opts: YjsOptions) => {
	const store = new YjsStore(opts);
	return {
		name: yjsExtensionName,
		opts,
		commands,
		keymaps: {
			'Mod-z': undo,
			'Mod-y': redo,
			'Mod-Shift-z': redo,
		},
		init(editor) {
			store.setEditor(editor);
		},
		plugins(): Plugin[] {
			return [
				ySyncPlugin(store.yXmlFragment, {
					permanentUserData: store.permanentUserData,
					colors: [
						{ light: '#ecd44433', dark: '#ecd444' },
						{ light: '#ee635233', dark: '#ee6352' },
						{ light: '#6eeb8333', dark: '#6eeb83' },
					],
				}),
				yCursorPlugin(store.awareness),
				yUndoPlugin(),
			];
		},
		store,
		destroy() {
			store.destroy();
		},
	} satisfies Extension;
};

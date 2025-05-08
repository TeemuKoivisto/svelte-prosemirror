import type { Commands } from './typings/index.js';
import type { Editor } from './typings/index.js';
import type { EditorView } from 'prosemirror-view';

declare global {
	interface Window {
		editorView: EditorView;
		commands: Commands;
	}
}

declare module 'prosemirror-view' {
	interface EditorView {
		editor: Editor;
	}
}

export * from './createExtensions.js';
export * from './Editor.js';
export * from './Observable.js';
export * from './SvelteNodeView.js';
export * from './typings/index.js';

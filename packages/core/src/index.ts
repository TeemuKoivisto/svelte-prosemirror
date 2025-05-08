import type { EditorView } from 'prosemirror-view';
import type { Commands } from './typings';
import type { Editor } from './typings';

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

export * from './createExtensions';
export * from './Editor';
export * from './Observable';
export * from './SvelteNodeView';
export * from './typings';

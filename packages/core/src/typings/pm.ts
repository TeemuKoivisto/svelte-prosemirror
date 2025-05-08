import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

export type Cmd = (
	state: EditorState,
	dispatch: ((tr: Transaction) => void) | undefined,
	view: EditorView,
) => boolean | undefined | void;

export interface Commands {
	[name: string]: (...args: any[]) => Cmd;
}

// @ts-ignore
export interface PMDoc extends Record<string, any> {}

// @ts-ignore
export interface DocJSON extends Record<string, any> {}
export interface EditorStateJSON {
	doc: DocJSON;
	selection?: { [key: string]: any };
	// plugins?: { [key: string]: any }
}

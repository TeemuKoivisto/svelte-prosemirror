import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

export type Cmd = (
	state: EditorState,
	dispatch: ((tr: Transaction) => void) | undefined,
	view: EditorView,
) => boolean | undefined | void;

export type Commands = { [name: string]: (...args: any[]) => Cmd };

export type PMDoc = Record<string, any>;

export type DocJSON = Record<string, any>;
export interface EditorStateJSON {
	doc: DocJSON;
	selection?: { [key: string]: any };
	// plugins?: { [key: string]: any }
}

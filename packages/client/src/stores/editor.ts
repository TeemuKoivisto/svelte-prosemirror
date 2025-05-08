import { getActiveMarks } from './getActiveMarks';
import { derived, get, writable } from 'svelte/store';
import type { Editor, EditorProps, ExtObject } from '@my-org/core';
import type { EditorState } from 'prosemirror-state';

const STATE_STORAGE_KEY = 'editor-state';

export let editor: Editor | undefined;
export const props = writable<EditorProps>();
export const state = writable<EditorState | undefined>();
export const extObj = writable<ExtObject>({} as ExtObject);
export const activeMarks = derived(state, s => (s ? getActiveMarks(s) : []));

export const editorActions = {
	async setEditor(instance: Editor) {
		editor = await (instance as any);
		try {
			const existing = localStorage.getItem(STATE_STORAGE_KEY);
			const yjsExt = instance.getExtension('yjs');
			if (existing && !yjsExt) {
				instance.setState(JSON.parse(existing));
			}
		} catch (err) {
			console.error(err);
		}
		extObj.set(instance.data.extObj);
		props.set(instance.data.props);
		state.set(instance.data.state);
		instance.on('update', (k, v) => {
			if (k === 'extObj') {
				extObj.set(v);
			} else if (k === 'props') {
				props.set(v);
			} else if (k === 'state') {
				state.set(v);
				localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(v.toJSON()));
			}
		});
	},
};

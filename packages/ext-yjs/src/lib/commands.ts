import { setAction, YjsAction } from './actions';
import type { Command } from '@my-org/core';

export const createSnapshot = (): Command => (state, dispatch) => {
	if (dispatch) {
		const tr = setAction(state.tr, YjsAction.createSnapshot, true);
		tr.setMeta('origin', 'yjs-extension');
		dispatch(tr);
	}
	return true;
};

import type { Transaction } from 'prosemirror-state';

export enum YjsAction {
	createSnapshot = 'yjs-create-snapshot',
}

export type YjsActionParams = {
	[YjsAction.createSnapshot]: boolean;
};

export function getAction<K extends keyof YjsActionParams>(tr: Transaction, action: K) {
	return tr.getMeta(action) as YjsActionParams[K] | undefined;
}

export function setAction<K extends keyof YjsActionParams>(
	tr: Transaction,
	action: K,
	payload: YjsActionParams[K],
) {
	return tr.setMeta(action, payload);
}

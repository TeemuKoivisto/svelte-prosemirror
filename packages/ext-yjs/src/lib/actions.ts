import type { Transaction } from 'prosemirror-state';

export enum YjsAction {
	createSnapshot = 'yjs-create-snapshot',
}

export type YjsActionParams = {
	[YjsAction.createSnapshot]: boolean;
};

export const getAction = <K extends keyof YjsActionParams>(tr: Transaction, action: K) =>
	tr.getMeta(action) as YjsActionParams[K] | undefined;

export const setAction = <K extends keyof YjsActionParams>(
	tr: Transaction,
	action: K,
	payload: YjsActionParams[K],
) => tr.setMeta(action, payload);

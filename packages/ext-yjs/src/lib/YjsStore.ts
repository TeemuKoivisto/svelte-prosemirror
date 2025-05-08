import { ProsemirrorBinding, ySyncPluginKey } from 'y-prosemirror';
import { Awareness } from 'y-protocols/awareness';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import { derived, get, writable } from 'svelte/store';

import { createYjsSnapshot } from './createYjsSnapshot';

import type { Editor } from '@my-org/core';
import type { AwarenessChange, YjsOptions, YjsSnapshot, YjsUser } from './types';

export class YjsStore {
	#editor: Editor | undefined;
	#opts: YjsOptions;

	ydoc: Y.Doc;
	permanentUserData: Y.PermanentUserData;
	awareness: Awareness;
	provider: WebsocketProvider;
	yXmlFragment: Y.XmlFragment;

	snapshots = writable<YjsSnapshot[]>([]);
	selectedSnapshot = writable<YjsSnapshot | null>(null);
	currentUser = writable<YjsUser>();
	usersMap = writable<Map<number, YjsUser>>(new Map());
	users = derived(this.usersMap, v =>
		Array.from(v.values()).reduce((acc, cur) => {
			if (!acc.find(u => u.id === cur.id)) {
				acc.push(cur);
			}
			return acc;
		}, [] as YjsUser[]),
	);

	constructor(opts: YjsOptions) {
		this.#opts = opts;
		const { document, user, initial, ws_url } = opts;
		const ydoc = initial?.doc || new Y.Doc();
		ydoc.gc = false;
		this.ydoc = ydoc;
		this.permanentUserData = new Y.PermanentUserData(ydoc);
		this.permanentUserData.setUserMapping(ydoc, user.clientID, user.name);
		this.provider = initial?.provider || new WebsocketProvider(ws_url, document.id, ydoc);
		this.awareness = this.provider.awareness;
		this.yXmlFragment = ydoc.getXmlFragment('pm-doc');
		this.currentUser.set(opts.user);
		this.subscribeToYjs();
	}

	setEditor(editor: Editor) {
		this.#editor = editor;
	}

	subscribeToYjs() {
		this.snapshots.set(this.ydoc.getArray<YjsSnapshot>('versions').toArray());
		this.ydoc.getArray<YjsSnapshot>('versions').observe(() => {
			this.snapshots.set(this.ydoc.getArray<YjsSnapshot>('versions').toArray());
		});
		const updatedUser = get(this.currentUser);
		updatedUser.clientID = this.ydoc.clientID;
		this.currentUser.set(updatedUser);
		this.usersMap.update(m => m.set(updatedUser.clientID, updatedUser));
		this.permanentUserData.setUserMapping(this.ydoc, this.ydoc.clientID, updatedUser.name);
		this.awareness.setLocalStateField('user', updatedUser);
		this.awareness.on('update', this.updateUsers);
	}

	createSnapshot() {
		const versions = this.ydoc.getArray<YjsSnapshot>('versions');
		const prevVersion = versions.length === 0 ? null : versions.get(versions.length - 1);
		const prevSnapshot =
			prevVersion === null ? Y.emptySnapshot : Y.decodeSnapshot(prevVersion.snapshot);
		const snapshot = Y.snapshot(this.ydoc);
		if (prevVersion) {
			// account for the action of adding a version to ydoc
			const prevVersionID = prevSnapshot.sv.get(prevVersion.clientID);
			if (!prevVersionID) {
				throw Error('Yjs prevVersionID was undefined!');
			}
			prevSnapshot.sv.set(prevVersion.clientID, prevVersionID + 1);
		}
		if (!Y.equalSnapshots(prevSnapshot, snapshot)) {
			versions.push([createYjsSnapshot(snapshot, this.ydoc.clientID)]);
		}
	}

	inspectSnapshot(snap: YjsSnapshot | undefined) {
		if (!snap || get(this.selectedSnapshot)?.id === snap.id) {
			return this.resumeEditing();
		}
		const ySnapshot = Y.decodeSnapshot(snap.snapshot);
		let prevSnapshot: YjsSnapshot | undefined,
			foundPrevSnapshot = false;
		this.ydoc.getArray<YjsSnapshot>('versions').forEach(s => {
			if (s.id === snap.id) {
				foundPrevSnapshot = true;
			} else if (!foundPrevSnapshot) {
				prevSnapshot = s;
			}
		});
		const binding: ProsemirrorBinding | null = ySyncPluginKey.getState(
			this.#editor!.viewProvider.getState(),
		).binding;
		if (!binding) {
			throw Error('Failed to retrieve ProsemirrorBinding from ySyncPlugin');
		}
		binding.renderSnapshot(
			ySnapshot,
			prevSnapshot ? Y.decodeSnapshot(prevSnapshot.snapshot) : Y.emptySnapshot,
		);
		this.selectedSnapshot.set(snap);
	}

	deleteSnapshot(snap: YjsSnapshot) {
		const versions = this.ydoc.getArray<YjsSnapshot>('versions');
		versions.forEach((v, i) => {
			if (v.id === snap.id) {
				versions.delete(i);
			}
		});
	}

	resumeEditing() {
		const binding: ProsemirrorBinding | null = ySyncPluginKey.getState(
			this.#editor!.viewProvider.getState(),
		).binding;
		if (!binding) {
			throw Error('@ext-yjs: failed to retrieve ProsemirrorBinding from ySyncPlugin');
		}
		binding.unrenderSnapshot();
		this.selectedSnapshot.set(null);
	}

	updateUsers = (update: AwarenessChange) => {
		const { added, removed } = update;
		if (added.length === 0 && removed.length === 0) {
			return;
		}
		const states = this.awareness.getStates() as Map<
			number,
			{
				cursor: any;
				user: YjsUser;
			}
		>;
		const newUsersMap = get(this.usersMap);
		added.forEach(clientID => {
			const state = states.get(clientID);
			if (state) {
				newUsersMap.set(clientID, state.user);
			}
		});
		removed.map(clientID => newUsersMap.delete(clientID));
		this.usersMap.set(newUsersMap);
	};

	destroy() {
		this.ydoc.destroy();
		this.provider.destroy();
	}
}

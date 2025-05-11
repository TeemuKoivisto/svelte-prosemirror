import { WebsocketProvider } from 'y-websocket';
import { Doc } from 'yjs';

export const yjsExtensionName = 'yjs' as const;

export enum YjsStatus {
    enabled = 'enabled',
    disabled = 'disabled',
}

export type YjsOptions = {
    document: {
        id: string;
    };
    user: YjsUser;
    initial?: {
        doc: Doc;
        provider: WebsocketProvider;
    };
    ws_url: string;
};

export interface YjsUser {
    id: string;
    clientID: number;
    name: string;
    color: string;
}

export interface YjsSnapshot {
    id: string;
    date: number;
    snapshot: Uint8Array;
    clientID: number;
}

export type AwarenessChange = {
    added: number[];
    updated: number[];
    removed: number[];
};

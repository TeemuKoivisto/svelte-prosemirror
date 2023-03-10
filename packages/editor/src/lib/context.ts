import { getContext as getCtx, setContext as setCtx } from 'svelte'
import type { Writable } from 'svelte/store'

import type { EditorContext, EditorProps, ViewProvider, ExtensionProvider } from '@my-org/core'

export type Contexts = {
  'editor-ctx': Writable<EditorContext>
  'editor-view': Writable<ViewProvider>
  'editor-extensions': Writable<ExtensionProvider>
  'editor-props': Writable<EditorProps>
}

export function setContext<K extends keyof Contexts>(ctx: K, val: Contexts[K]) {
  return setCtx(ctx, val)
}

export function getContext<K extends keyof Contexts>(ctx: K) {
  return getCtx<Contexts[K]>(ctx)
}

import type { ViewProvider } from '../providers/ViewProvider'
import type { ExtensionProvider } from '../providers/ExtensionProvider'

export interface EditorContext {
  viewProvider: ViewProvider
  extProvider: ExtensionProvider
}
export type { ViewProvider } from '../providers/ViewProvider'
export type { ExtensionProvider } from '../providers/ExtensionProvider'

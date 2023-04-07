import { ViewProvider } from './ViewProvider'
import { ExtensionProvider } from './ExtensionProvider'

import type { EditorContext } from '../typings'

export const createProviders = (): EditorContext => {
  return {
    viewProvider: new ViewProvider(),
    extProvider: new ExtensionProvider()
  }
}

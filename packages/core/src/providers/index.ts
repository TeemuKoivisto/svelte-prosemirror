import { ViewProvider } from './ViewProvider'
import { ExtensionProvider } from './ExtensionProvider'

import type { EditorProps, EditorContext } from '../typings'

export const createProviders = (props: EditorProps): EditorContext => {
  return {
    viewProvider: new ViewProvider(),
    extProvider: new ExtensionProvider(props)
  }
}

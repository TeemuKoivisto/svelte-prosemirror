import { yjsExtension } from './extension'
import { yjsExtensionName } from './types'
import * as yjsCommands from './commands'

declare module '@my-org/core' {
  interface Extensions {
    [yjsExtensionName]: ReturnType<typeof yjsExtension>
  }
  interface EditorCommands {
    [yjsExtensionName]: typeof yjsCommands
  }
}

export * as yjsCommands from './commands'
export * from './generateUser'

export { YjsStore } from './YjsStore'
export { yjsExtension } from './extension'

export * from './types'

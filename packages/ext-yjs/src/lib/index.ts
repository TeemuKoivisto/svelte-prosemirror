import { yjsExtension } from './extension'
import { yjsExtensionName } from './types'

declare module '@my-org/core' {
  interface Extensions {
    [yjsExtensionName]: ReturnType<ReturnType<typeof yjsExtension>>
  }
}

export * as yjsCommands from './commands'
export * from './generateUser'

export { YjsStore } from './YjsStore'
export { yjsExtension } from './extension'

export * from './types'

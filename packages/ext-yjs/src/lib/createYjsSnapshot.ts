import * as Y from 'yjs'
import { v4 as uuidv4 } from 'uuid'

import type { YjsSnapshot } from './types'

export function createYjsSnapshot(ysnap: Y.Snapshot, clientID: number): YjsSnapshot {
  return {
    id: uuidv4(),
    date: Date.now(),
    snapshot: Y.encodeSnapshot(ysnap),
    clientID
  }
}

import { bold } from './bold'
import { code } from './code'
import { italic } from './italic'
import { link } from './link'
import { strikethrough } from './strikethrough'

import type { Extension } from '@my-org/core'

export const marksExtension = () => {
    return {
        name: 'basic-marks' as const,
        marks: {
            bold: {
                schema: bold
            },
            code: {
                schema: code
            },
            italic: {
                schema: italic
            },
            link: {
                schema: link
            },
            strikethrough: {
                schema: strikethrough
            }
        }
    } satisfies Extension
}

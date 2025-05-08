import Blockquote, { blockquoteAttrs, blockquoteSchema } from './Blockquote.svelte'

import type { Extension } from '@my-org/core'

export const blockquoteExtension = () => {
    return {
        name: 'blockquote' as const,
        nodes: {
            blockquote: {
                attrs: blockquoteAttrs,
                schema: blockquoteSchema,
                component: Blockquote
            }
        }
    } satisfies Extension
}

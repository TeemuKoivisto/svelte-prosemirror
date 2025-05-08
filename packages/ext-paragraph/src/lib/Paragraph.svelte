<script lang="ts" module>
    import type { NodeProps } from '@my-org/core'
    import type { Node as PMNode, NodeSpec } from 'prosemirror-model'

    export interface ParagraphAttrs {
        indent: number
    }

    export const paragraphAttrs: ParagraphAttrs = {
        indent: 0
    }

    export const paragraphSchema: NodeSpec = {
        attrs: {
            indent: { default: 0 }
        },
        content: 'inline*',
        group: 'block'
    }
</script>

<script lang="ts">
    interface Props {
        node: PMNode | undefined /** */
        attrs: ParagraphAttrs /** */
        contentDOM: (node: HTMLElement) => void /** */
        ref?: HTMLParagraphElement
    }

    let { node, attrs, contentDOM, ref }: Props = $props()
</script>

<p data-indent={attrs.indent} data-hole bind:this={ref}></p>

<style lang="scss" global>
    p {
        margin: 1rem 0;
    }
</style>

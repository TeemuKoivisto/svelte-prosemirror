<script lang="ts" module>
    import type { NodeSpec } from 'prosemirror-model';

    // eslint-disable-next-line
    export interface BlockquoteAttrs {}

    export const blockquoteAttrs: BlockquoteAttrs = {};

    export const blockquoteSchema: NodeSpec = {
        attrs: {},
        content: 'block+',
        group: 'block',
        defining: true,
    };
</script>

<script lang="ts">
    export interface Props {
        ref?: HTMLQuoteElement;
    }

    let { ref }: Props = $props();
    export { ref };
</script>

<blockquote data-hole bind:this={ref}></blockquote>

<style lang="scss" global>
    blockquote {
        margin: 1rem 0;
    }
</style>

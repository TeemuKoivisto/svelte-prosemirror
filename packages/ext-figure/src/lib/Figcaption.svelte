<script lang="ts" module>
    import type { NodeSpec } from 'prosemirror-model';

    // eslint-disable-next-line
    export interface FigcaptionAttrs {}

    export const figcaptionAttrs: FigcaptionAttrs = {};

    export const figcaptionSchema: NodeSpec = {
        attrs: Object.entries(figcaptionAttrs).reduce(
            (acc, [key, value]) => ({ ...acc, [key]: { default: value } }),
            {},
        ),
        content: 'inline*',
        group: 'block',
        isolating: true,
        selectable: false,
    };
</script>

<script lang="ts">
    export interface Props {
        ref?: HTMLElement;
    }

    let { ref }: Props = $props();

    export { ref };
</script>

<!-- svelte-ignore a11y_figcaption_parent -->
<figcaption data-hole bind:this={ref}></figcaption>

<style lang="scss">
    figcaption {
        color: #5d5d5d;
        font-size: 0.9rem;
        font-style: italic;
        padding: 2px;
        text-align: center;
    }
</style>

<script lang="ts" module>
    import type { NodeSpec } from 'prosemirror-model';

    export interface ImageAttrs {
        title: string;
        src: string;
        alt: string;
    }

    export const imageAttrs: ImageAttrs = {
        title: '',
        src: '',
        alt: '',
    };

    export const imageSchema: NodeSpec = {
        attrs: Object.entries(imageAttrs).reduce(
            (acc, [key, value]) => ({ ...acc, [key]: { default: value } }),
            {},
        ),
        selectable: true,
        // inline: true,
        // group: 'inline',
        draggable: true,
    };
</script>

<script lang="ts">
    export interface Props {
        attrs: ImageAttrs /** */;
        ref?: HTMLImageElement;
    }

    let { attrs, ref }: Props = $props();

    export { ref };
</script>

<img src={attrs.src} alt={attrs.alt} title={attrs.title} bind:this={ref} />

<style lang="scss">
    :global(img.ProseMirror-selectednode) {
        outline: 2px solid #8cf;
    }
</style>

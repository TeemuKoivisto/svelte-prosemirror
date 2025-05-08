import { Mark } from 'prosemirror-model'
import type { MarkSpec } from 'prosemirror-model'

// :: MarkSpec A link. Has `href` and `title` attributes. `title`
// defaults to the empty string. Rendered and parsed as an `<a>`
// element.
export const link: MarkSpec = {
    attrs: {
        href: {},
        title: { default: null },
        dataTracked: { default: null }
    },
    inclusive: false,
    parseDOM: [
        {
            tag: 'a[href]',
            getAttrs(dom: HTMLElement | string) {
                if (dom instanceof HTMLElement) {
                    return {
                        src: dom.getAttribute('src'),
                        title: dom.getAttribute('title'),
                        alt: dom.getAttribute('alt')
                    }
                }
                return null
            }
        }
    ],
    toDOM(node: Mark) {
        const { href, title } = node.attrs
        return ['a', { href, title }, 0]
    }
}

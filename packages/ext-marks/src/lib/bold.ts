import type { MarkSpec } from 'prosemirror-model'

// :: MarkSpec A strong mark. Rendered as `<strong>`, parse rules
// also match `<b>` and `font-weight: bold`.
export const bold: MarkSpec = {
  attrs: { dataTracked: { default: null } },
  parseDOM: [
    { tag: 'strong' },
    // This works around a Google Docs misbehavior where
    // pasted content will be inexplicably wrapped in `<b>`
    // tags with a font-weight normal.
    {
      tag: 'b',
      getAttrs: (dom: HTMLElement | string) => {
        if (dom instanceof HTMLElement) {
          return dom.style.fontWeight !== 'normal' && null
        }
        return null
      }
    },
    {
      style: 'font-weight',
      getAttrs: (dom: HTMLElement | string) => {
        if (typeof dom === 'string') {
          return /^(bold(er)?|[5-9]\d{2,})$/.test(dom) && null
        }
        return null
      }
    }
  ],
  toDOM() {
    return ['strong', 0]
  }
}

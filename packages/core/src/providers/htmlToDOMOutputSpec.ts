import { DOMOutputSpec } from 'prosemirror-model'

export function htmlToDOMOutputSpec(
  el: HTMLElement,
  collected: any[] = [],
  holeFound = false
): any[] {
  collected.push(el.tagName.toLowerCase())
  const attrs = {} as { [attr: string]: string }
  console.log(Array.from(el.attributes))
  Array.from(el.attributes).forEach(attr => {
    if (attr.name === 'data-hole') {
      if (holeFound) {
        throw Error(
          '@my-org/core: Duplicate holes provided! Remember to only set "data-hole" attribute once!'
        )
      }
      holeFound = true
    }
    attrs[attr.name] = attr.value
  })
  collected.push(attrs)
  if (holeFound) {
    collected.push(0)
  }
  if (el.children.length > 0) {
  }
  return collected
}

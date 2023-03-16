import { DOMOutputSpec } from 'prosemirror-model'

export function htmlToDOMOutputSpec(
  el: HTMLElement,
  collected: any[] = [],
  recursed: { holeFound: boolean } = { holeFound: false }
): any[] {
  collected.push(el.tagName.toLowerCase())
  const attrs = {} as { [attr: string]: string }
  console.log(Array.from(el.attributes))
  Array.from(el.attributes).forEach(attr => {
    if (attr.name === 'data-hole') {
      if (recursed.holeFound) {
        throw Error(
          '@my-org/core: Duplicate holes provided! Remember to only set "data-hole" attribute once!'
        )
      }
      recursed.holeFound = true
    }
    // if (attr.value !== "") {
    // }
    attrs[attr.name] = attr.value
  })
  collected.push(attrs)
  if (recursed.holeFound) {
    collected.push(0)
  }
  if (el.children.length > 0) {
    const children = [] as any[]
    Array.from(el.children).forEach(child => {
      children.push(htmlToDOMOutputSpec(child as HTMLElement, [], recursed))
    })
    collected.push(children.flat())
  }
  return collected
}

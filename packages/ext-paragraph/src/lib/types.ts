import { SvelteComponentTyped } from 'svelte'
import type { Node as PMNode } from 'prosemirror-model'

type Props = { node: PMNode } & {
  indent: number
}

export class Paragraph extends SvelteComponentTyped<Props> {}

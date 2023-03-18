<script lang="ts" context="module">
  import type { NodeSpec } from 'prosemirror-model'

  export interface Attrs {
    id: string | undefined
    title: string
    latex: string
  }

  export const attrs: Attrs = {
    id: undefined,
    title: '',
    latex: ''
  }

  export const schema: NodeSpec = {
    attrs: Object.entries(attrs).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: { default: value } }),
      {}
    ),
    content: 'inline*',
    selectable: false,
    group: 'block',
    // @TODO customize NodeSpec, add -> attrs, selectors
    parseDOM: [
      {
        tag: 'figure.equation',
        getAttrs: (dom: HTMLElement | string) => {
          if (dom instanceof HTMLElement) {
            return {
              id: dom.getAttribute('id'),
              src: dom.getAttribute('src')
            }
          }
          return null
        }
      }
    ],
    toDOM(node: PMNode) {
      const { id, title, src, alt } = node.attrs
      return ['figure', { id, class: 'equation' }, ['img', { src, alt }], ['figcaption', {}, 0]]
    }
  }
</script>

<script lang="ts">
  import { EditorView as CodeMirror, lineNumbers, placeholder, ViewUpdate } from '@codemirror/view'
  import { EditorState } from '@codemirror/state'
  import { createPopper } from '@popperjs/core'
  import type { Instance, OptionsGeneric, Modifier } from '@popperjs/core'
  import katex from 'katex'
  import { DOMSerializer, Node as PMNode } from 'prosemirror-model'
  import type {
    Decoration,
    DecorationSource,
    EditorView,
    NodeView,
    NodeViewConstructor
  } from 'prosemirror-view'
  import { createEventDispatcher, onMount } from 'svelte'
  import { EditorContext } from '@my-org/core'

  export let node: PMNode | undefined = undefined,
    attrs: Attrs,
    view: EditorView,
    getPos: () => number,
    decorations: readonly Decoration[],
    innerDecorations: DecorationSource,
    update: (
      newNode: PMNode,
      _decorations: readonly Decoration[],
      _innerDecorations: DecorationSource
    ) => boolean,
    selectNode: () => void,
    deselectNode: () => void,
    ctx: EditorContext

  const { id, latex, title } = attrs

  let codemirrorEl: HTMLElement
  let popperEl: HTMLElement
  let popperInstance: Instance | undefined
  let codemirror: CodeMirror | undefined

  const dispatch = createEventDispatcher<{ update: { attrs: any } }>()

  onMount(() => {
    if (!node) return
    popperEl = document.createElement('div')
    popperEl.classList.add('popup')
    document.body.appendChild(popperEl)
    if (latex) {
      katex.render(latex, codemirrorEl, {
        throwOnError: false
      })
    }
    return () => {
      document.body.removeChild(popperEl)
      codemirror?.destroy()
      closePopper()
    }
  })

  function openPopper(
    target: HTMLElement,
    content: HTMLElement,
    opts?: Partial<OptionsGeneric<Partial<Modifier<any, any>>>>
  ) {
    closePopper()
    popperEl.appendChild(content)
    popperEl.setAttribute('data-show', '')
    popperInstance = createPopper(target, popperEl, opts)
  }

  function updatePopper() {
    if (popperInstance) {
      popperInstance.update()
    }
  }

  function closePopper() {
    if (popperInstance) {
      while (popperEl.hasChildNodes()) {
        popperEl.removeChild(popperEl.firstChild as ChildNode)
      }
      popperEl.removeAttribute('data-show')
      popperInstance.destroy()
    }
  }

  function handleCodeMirrorChange(v: ViewUpdate) {
    if (!v.docChanged) {
      return
    }
    const updatedLatex = v.view.state.doc.toJSON().join('\n')
    const { tr } = view.state
    const pos = getPos()

    tr.setNodeMarkup(pos, undefined, {
      ...attrs,
      latex: updatedLatex
    })
    view.dispatch(tr)
  }

  function handleCodeMirrorOpen() {
    if (!codemirror) {
      codemirror = new CodeMirror({
        state: EditorState.create({
          doc: latex,
          extensions: [
            placeholder('Enter LaTeX equation, e.g. "a^2 = \\sqrt{b^2 + c^2}"'),
            lineNumbers(),
            CodeMirror.lineWrapping,
            CodeMirror.updateListener.of(handleCodeMirrorChange)
          ]
        })
      })
      openPopper(popperEl, codemirrorEl, {
        placement: 'bottom',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8]
            }
          }
        ]
      })

      window.requestAnimationFrame(() => {
        codemirror?.focus()
      })
    }
  }

  function handleLatexChange() {
    dispatch('update', { attrs: {} })
  }
</script>

<figure class="equation" {id}>
  {#if latex}
    <div class="equation-editor" data-latex={latex} bind:this={codemirrorEl}>
      <a
        class="equation-editor-info"
        href="https://en.wikibooks.org/wiki/LaTeX/Mathematics#Symbols"
        target="_blank"
        rel="noreferrer"
      >
        ?
      </a>
    </div>
  {:else}
    <div>placeholder</div>
  {/if}
  <figcaption data-hole />
</figure>

<style lang="scss">
  .popup {
    color: #353535;
    font-family: 'PT Sans', sans-serif;
    min-width: 100px;
    position: absolute;
    width: auto;
    z-index: 5;
    opacity: 1;
  }

  .popup[data-show] {
    display: inline-block;
  }

  .popup-arrow,
  .popup-arrow::before {
    position: absolute;
    width: 8px;
    height: 8px;
    background: inherit;
  }

  .popup-arrow {
    visibility: hidden;
  }

  .popup-arrow::before {
    visibility: visible;
    content: '';
    transform: rotate(45deg);
  }

  .popup[data-popper-placement^='bottom'] > .popup-arrow {
    top: -5px;
    left: calc(50% - 5px);
    border-bottom-color: #e2e2e2;
    border-top-width: 0;
    margin: 0 5px;
  }

  .popup[data-popper-placement^='top'] > .popup-arrow {
    bottom: -5px;
    left: calc(50% - 5px);
    border-top-color: #e2e2e2;
    border-bottom-width: 0;
    margin: 0 5px;
  }

  .popup[data-popper-placement^='left'] > .popup-arrow {
    right: -5px;
    top: calc(50% - 5px);
    border-left-color: #e2e2e2;
    border-right-width: 0;
    margin: 5px 0;
  }

  .popup[data-popper-placement^='right'] > .popup-arrow {
    left: -5px;
    top: calc(50% - 5px);
    border-right-color: #e2e2e2;
    border-left-width: 0;
    margin: 5px 0;
  }

  .popup .equation-editor {
    position: relative;
    min-width: 500px;
    max-width: 800px;
  }

  /* .popup .cm-editor {
  border: 1px solid #e2e2e2;
  box-shadow: 0 4px 9px 0 rgba(84, 83, 83, 0.3);
  height: auto;
  min-height: 4em;
} */
  .popup .equation-editor:first-child {
    background: #fff;
    border: 1px solid #e2e2e2;
    box-shadow: 0 4px 9px 0 rgb(84 83 83 / 30%);
    height: auto;
    min-height: 4em;
  }

  .popup .equation-editor-info {
    align-items: center;
    border: 1px solid #e2e2e2;
    border-radius: 50%;
    bottom: 6px;
    color: #6e6e6e;
    display: inline-flex;
    cursor: pointer;
    font-size: 12px;
    height: 16px;
    justify-content: center;
    opacity: 0.5;
    position: absolute;
    right: 6px;
    text-decoration: none;
    width: 16px;
    z-index: 2;
  }

  .popup .equation-editor-info:hover {
    opacity: 1;
  }

  .popup .cm-scroller {
    max-height: 400px;
  }

  .popup .cm-placeholder {
    color: #999 !important;
  }
</style>

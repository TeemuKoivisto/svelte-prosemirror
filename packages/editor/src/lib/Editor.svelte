<script lang="ts">
  import type { EditorView } from 'prosemirror-view'
  import { onDestroy } from 'svelte'

  import { init } from '@my-org/core'

  import { getContext } from './context'

  let editorView: EditorView | undefined = undefined
  let rootElement: HTMLElement | undefined = undefined
  const ctx = getContext('editor-ctx')
  const editorProps = getContext('editor-props')

  $: {
    if (rootElement) {
      editorView = init(rootElement, $ctx, $editorProps, editorView)
    }
  }

  onDestroy(() => {
    editorView?.destroy()
  })
</script>

<div bind:this={rootElement} />

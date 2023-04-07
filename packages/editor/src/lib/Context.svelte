<script lang="ts">
  import type { EditorState } from 'prosemirror-state'
  import type { Schema } from 'prosemirror-model'
  import { writable } from 'svelte/store'

  import { createProviders } from '@my-org/core'

  import { setContext } from './context'

  import type { CreateExtension, EditorContext, EditorProps } from '@my-org/core'

  export let extensions: CreateExtension[] = [],
    schema: Schema | undefined = undefined,
    onEditorReady: ((stores: EditorContext) => void) | undefined = undefined,
    onEdit: ((state: EditorState) => void) | undefined = undefined

  let editorProps = {
    extensions,
    schema,
    onEditorReady,
    onEdit
  }
  $: {
    let newProps = {
      extensions,
      schema,
      onEditorReady,
      onEdit
    }
    const newCtx = createProviders()
    newCtx.extProvider.init(newCtx, newProps)
    ctx.set(newCtx)
    view.set(newCtx.viewProvider)
    extProvider.set(newCtx.extProvider)
    props.set(newProps)
  }

  const ctx = writable(createProviders())
  const view = writable($ctx.viewProvider)
  const extProvider = writable($ctx.extProvider)
  const props = writable(editorProps)
  setContext('editor-ctx', ctx)
  setContext('editor-view', view)
  setContext('editor-extensions', extProvider)
  setContext('editor-props', props)
</script>

<slot />

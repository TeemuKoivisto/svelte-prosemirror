<script lang="ts">
  import Toolbar from '$components/Toolbar.svelte'
  import { YJS_URL } from '$config'
  import { editor, editorActions } from '$stores/editor'
  import { Editor } from '@my-org/core'
  import { blockquoteExtension } from '@my-org/ext-blockquote'
  import { equationExtension } from '@my-org/ext-equation'
  import { exampleSetupExtension } from '@my-org/ext-example-setup'
  import { figureExtension } from '@my-org/ext-figure'
  import { marksExtension } from '@my-org/ext-marks'
  import { paragraphExtension } from '@my-org/ext-paragraph'
  import { yjsExtension } from '@my-org/ext-yjs'
  import '@my-org/ext-example-setup/gapcursor.css'
  import '@my-org/ext-example-setup/menu.css'
  import '@my-org/ext-example-setup/prosemirror-example-setup.css'
  import '@my-org/ext-yjs/yjs.css'
  import { onMount } from 'svelte'
  import type { EditorProps } from '@my-org/core'

  let documentId = $state('abcd1234')
  let editorInstance: Editor
  let props: EditorProps = $state({})

  let editorRef: HTMLDivElement = $state()

  // Create Yjs extension separately so that it's not destroyed if props that are not related to it change
  // Otherwise the provider is destroyed and edits stop working...
  let yjs = $derived(
    YJS_URL
      ? yjsExtension({
          document: {
            id: 'docId126'
          },
          user: {
            id: 'id-john-123',
            name: 'John',
            clientID: 1,
            color: '#ff3354'
          },
          ws_url: YJS_URL
        })
      : undefined
  )

  onMount(() => {
    props = {
      extensions: [
        exampleSetupExtension({ history: !yjs }),
        paragraphExtension(),
        blockquoteExtension(),
        figureExtension(),
        equationExtension(),
        marksExtension(),
        ...(yjs ? [yjs] : [])
      ]
    }
    Editor.create(editorRef, props).then(editor => {
      editorInstance = editor
      editorActions.setEditor(editorInstance)
    })
  })

  function handleInsertFigure() {
    editor?.cmd((state, dispatch) => {
      const tr = state.tr
      const { schema } = state
      const nodes = schema.nodes
      tr.insert(2, nodes.paragraph.createAndFill() as any)
      tr.insert(
        1,
        nodes.figure.create(undefined, [
          nodes.image.create({
            src: 'https://upload.wikimedia.org/wikipedia/en/7/70/Bob_at_Easel.jpg',
            alt: 'Bob Ross in front of painting',
            title: 'Bob Ross in front of painting'
          }),
          nodes.figcaption.create(undefined, schema.text('Happy trees :)'))
        ])
      )
      dispatch(tr)
    })
  }

  function handleInsertEquation() {
    editor?.cmd((state, dispatch) => {
      const tr = state.tr
      const { schema } = state
      const nodes = schema.nodes
      tr.insert(2, nodes.paragraph.createAndFill() as any)
      tr.insert(
        1,
        nodes.equation.create(
          {
            latex: 'a^2 = \\sqrt{b^2 + c^2}'
          },
          schema.text('Mah equation')
        )
      )
      dispatch(tr)
    })
  }
</script>

<section class="flex flex-col items-start pb-8">
  <fieldset class="bg-white p-4">
    <legend>Props</legend>
    <div class="mb-4">
      <label class="mr-4" for="documentId">Document id</label>
      <input class="bg-gray-100 rounded" bind:value={documentId} id="documentId" />
    </div>
    <button class="btn" type="button" onclick={handleInsertFigure}>Insert figure</button>
    <button class="btn" type="button" onclick={handleInsertEquation}>Insert equation</button>
  </fieldset>
  <div class="mt-3 bg-white rounded w-full">
    <Toolbar />
    <!-- <div use:editor_action bind:this={editorRef}></div> -->
    <div bind:this={editorRef}></div>
  </div>
</section>

<style lang="scss">
  .btn {
    @apply bg-gray-200 py-1 px-2 rounded hover:bg-gray-300;
  }
  :global(.ProseMirror) {
    border-top: 0;
    min-height: 300px;
    overflow-wrap: break-word;
    outline: none;
    white-space: pre-wrap;
    width: 100%;
    @apply p-4;
  }
</style>

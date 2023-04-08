<script lang="ts">
  import { Editor } from '@my-org/core'
  import { Context } from '@my-org/editor'

  import { editorActions } from '$stores/editor'

  import { paragraphExtension } from '@my-org/ext-paragraph'
  import { figureExtension } from '@my-org/ext-figure'
  import { equationExtension } from '@my-org/ext-equation'
  import { exampleSetupExtension } from '@my-org/ext-example-setup'
  import { marksExtension } from '@my-org/ext-marks'
  import { yjsExtension } from '@my-org/ext-yjs'

  import { YJS_URL } from '$config'

  import type { EditorContext, EditorProps } from '@my-org/core'

  let documentId = 'abcd1234'
  let instance: Editor

  function editor(dom: HTMLElement) {
    const props: EditorProps = {
      extensions: [
        paragraphExtension(),
        figureExtension(),
        equationExtension(),
        exampleSetupExtension({ history: false }),
        marksExtension()
      ],
      onEditorReady: handleEditorReady
    }
    if (YJS_URL) {
      props.extensions?.push(
        yjsExtension({
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
      )
    }
    instance = Editor.make().setProps(props).create(dom)
    editorActions.setEditor(instance)
  }

  function handleEditorReady(ctx: EditorContext) {}

  function handleInsertFigure() {
    instance?.view.execCommand((state, dispatch) => {
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
      dispatch && dispatch(tr)
    })
  }

  function handleInsertEquation() {
    instance?.view.execCommand((state, dispatch) => {
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
      dispatch && dispatch(tr)
    })
  }
</script>

<section class="p-4 h-full m-auto lg:container md:p-16 md:pt-8 xs:p-8 rounded-2xl">
  <header class="flex flex-col items-center mt-8">
    <h1 class="my-3 text-5xl font-bold flex items-center hover:underline">
      <a href="https://github.com/TeemuKoivisto/svelte-prosemirror">svelte-to-prosemirror</a>
    </h1>
    <div class="mt-6" />
  </header>
  <main>
    <fieldset>
      <legend>Props</legend>
      <div>
        <label for="documentId">Document id</label>
        <input bind:value={documentId} id="documentId" />
      </div>
      <button class="btn" on:click={handleInsertFigure}>Insert figure</button>
      <button class="btn" on:click={handleInsertEquation}>Insert equation</button>
    </fieldset>
    <div class="editor">
      <div use:editor />
    </div>
  </main>
</section>

<style lang="scss">
  main {
    margin: 40px auto 0 auto;
    size: A4 portrait;
    @apply flex flex-col items-center w-full;
  }
  fieldset {
    margin: 1rem 0;
  }
  label {
    margin-right: 0.75rem;
  }
  .btn {
    @apply bg-gray-200 py-1 px-2 rounded hover:bg-gray-300;
  }
  .editor {
    max-width: 50rem;
    @apply bg-white rounded w-full;
  }
  :global(.ProseMirror) {
    border-top: 0;
    min-height: 140px;
    overflow-wrap: break-word;
    outline: none;
    white-space: pre-wrap;
    width: 100%;
    @apply p-4;
  }
</style>

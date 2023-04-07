<script lang="ts">
  import { Editor } from '@my-org/core'
  import { Context } from '@my-org/editor'

  import { paragraphExtension } from '@my-org/ext-paragraph'
  import { figureExtension } from '@my-org/ext-figure'
  import { equationExtension } from '@my-org/ext-equation'
  import { exampleSetupExtension } from '@my-org/ext-example-setup'

  import type { EditorContext } from '@my-org/core'

  let documentId = 'abcd1234'
  let instance: Editor

  function editor(dom: HTMLElement) {
    instance = Editor.make()
      .setProps({
        extensions: [
          paragraphExtension(),
          figureExtension(),
          equationExtension(),
          exampleSetupExtension()
        ],
        onEditorReady: handleEditorReady
      })
      .create(dom)
  }

  function handleEditorReady(ctx: EditorContext) {
    ctx.viewProvider.execCommand((state, dispatch) => {
      const tr = state.tr
      const { schema } = state
      const nodes = schema.nodes
      tr.insert(2, nodes.paragraph.createAndFill() as any)
      tr.insert(
        1,
        nodes.equation.createAndFill(
          {
            latex: 'a^2 = \\sqrt{b^2 + c^2}'
          },
          schema.text('Mah equation')
        ) as any
      )
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
    </fieldset>
    <div use:editor />
  </main>
</section>

<style lang="scss">
  main {
    margin: 40px auto 0 auto;
    max-width: 680px;
    padding-bottom: 20px;
  }
  fieldset {
    margin: 1rem 0;
  }
  label {
    margin-right: 0.75rem;
  }
  :global(.ProseMirror) {
    border: 1px solid black;
    min-height: 140px;
    overflow-wrap: break-word;
    outline: none;
    padding: 10px;
    white-space: pre-wrap;
    max-width: 600px;
    width: 100%;
  }
</style>

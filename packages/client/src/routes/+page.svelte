<script lang="ts">
  import { Context, Editor } from '@my-org/editor'

  import { paragraphExtension } from '@my-org/ext-paragraph'
  import { figureExtension } from '@my-org/ext-figure'
  import { equationExtension } from '@my-org/ext-equation'

  import type { EditorContext } from '@my-org/core'
  import { onMount } from 'svelte'

  let documentId = 'abcd1234',
    extensions = [] as any[]

  onMount(() => {
    extensions = [paragraphExtension(), figureExtension(), equationExtension()]
  })

  function handleEditorReady(ctx: EditorContext) {
    ctx.viewProvider.execCommand((state, dispatch) => {
      const tr = state.tr
      tr.insert(
        1,
        state.schema.nodes.equation.createAndFill(
          {
            latex: 'a^2 = \\sqrt{b^2 + c^2}'
          },
          state.schema.text('Mah equation')
        ) as any
      )
      // tr.insert(
      //   1,
      //   state.schema.nodes.figure.createAndFill(
      //     {
      //       src: 'https://upload.wikimedia.org/wikipedia/en/7/70/Bob_at_Easel.jpg',
      //       alt: 'Bob Ross in front of painting',
      //       caption: 'Happy trees :)'
      //     },
      //     state.schema.text('Happy trees :)')
      //   ) as any
      // )
      dispatch && dispatch(tr)
    })
  }
</script>

<section class="p-4 h-full m-auto lg:container md:p-16 md:pt-8 xs:p-8 rounded-2xl">
  <header class="flex flex-col items-center mt-8">
    <h1 class="my-3 text-5xl font-bold flex items-center hover:underline">
      <a href="https://github.com/TeemuKoivisto/svelte-prosemirror">svelte-prosemirror</a>
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
    {#if extensions.length > 0}
      <Context {extensions} onEditorReady={handleEditorReady}>
        <Editor />
      </Context>
    {/if}
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

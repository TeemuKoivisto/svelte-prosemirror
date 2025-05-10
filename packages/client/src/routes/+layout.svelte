<script lang="ts">
  import '../tailwind.css'
  interface Props {
    children?: import('svelte').Snippet
  }

  let { children }: Props = $props()
</script>

<div class="main-bg font-sans min-h-screen text-gray-900">
  <header class="flex flex-col items-center mt-8">
    <h1 class="my-3 text-5xl font-bold flex items-center hover:underline">
      <a href="https://github.com/TeemuKoivisto/svelte-prosemirror">svelte-prosemirror</a>
    </h1>
    <div class="mt-6"></div>
  </header>
  <main class="flex-col items-center justify-center h-full max-w-[800px] mx-[auto]">
    {@render children?.()}
  </main>
</div>

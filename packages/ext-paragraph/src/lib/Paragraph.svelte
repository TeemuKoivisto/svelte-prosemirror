<svelte:options tag="my-component" />

<script lang="ts">
  export let indent = 0

  const schema = {
    content: 'inline',
    gropu: 'block'
  }
</script>

<p data-indent={indent}>
  <slot />
</p>

<style lang="scss">
  p {
    margin: 1rem 0;
  }
</style>

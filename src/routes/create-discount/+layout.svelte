<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import { onMount } from 'svelte';
  
  onMount(() => {
    console.log('Create Discount Layout mounted');
  });
</script>

<Layout>
  <slot />
  <div class="debug-banner">Create Discount Route Active</div>
</Layout>

<style>
  .debug-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: red;
    color: white;
    padding: 8px;
    text-align: center;
    z-index: 9999;
  }
</style>

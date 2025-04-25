<script lang="ts">
  import { page } from '$app/stores'

  export let href: string = ''
  export let isMobile: boolean = false

  // Determine if current link is active
  $: isActive = $page.url.pathname === href
</script>

{#if isMobile}
  <a
    {href}
    class="block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 ease-in-out {
      isActive 
        ? 'bg-primary-600 text-white' 
        : 'text-neutral-700 hover:bg-neutral-100'
    }"
    on:click
  >
    <slot />
  </a>
{:else}
  <a
    {href}
    class="px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ease-in-out {
      isActive 
        ? 'bg-primary-600 text-white' 
        : 'text-neutral-700 hover:bg-neutral-100'
    }"
  >
    <slot />
  </a>
{/if}

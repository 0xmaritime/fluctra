<script lang="ts">
  import { page } from '$app/stores'

  export let href: string = ''
  export let isMobile: boolean = false

  // Determine if current link is active (use startsWith for parent routes)
  $: isActive = $page.url.pathname === href || ($page.url.pathname.startsWith(href) && href !== '/')
</script>

{#if isMobile}
  <a
    {href}
    class="block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ease-out {
      isActive 
        ? 'bg-[var(--color-interactive)] text-[var(--color-interactive-text)]' 
        : 'text-[var(--color-text-primary)] hover:bg-[var(--color-gray-100)]'
    }"
    on:click
  >
    <slot />
  </a>
{:else}
  <a
    {href}
    class="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out {
      isActive 
        ? 'bg-[var(--color-interactive)] text-[var(--color-interactive-text)]' 
        : 'text-[var(--color-text-primary)] hover:bg-[var(--color-gray-100)]'
    }"
  >
    <slot />
  </a>
{/if}

<style>
  @media (prefers-color-scheme: dark) {
    a:not(.isActive) {
      color: var(--color-text-primary);
    }
    a:not(.isActive):hover {
      background-color: var(--color-gray-800);
    }
  }
</style>

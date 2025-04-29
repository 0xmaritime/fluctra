<script lang="ts">
  import { page } from '$app/stores';

  export let href: string = '';
  export let isMobile: boolean = false;

  // Determine if current link is active (use startsWith for parent routes)
  $: isActive = $page.url.pathname === href || ($page.url.pathname.startsWith(href) && href !== '/');

  // Base classes for common styling
  const baseClasses = `
    px-[calc(var(--spacing)*1.5)] py-[calc(var(--spacing))] 
    rounded-lg font-semibold 
    transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-expo)]
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary-500)/40]
  `; // Using --radius-md implicitly

  // Conditional classes based on state and mode
  $: activeClass = 'bg-[var(--color-interactive)] text-[var(--color-interactive-text)]';
  $: inactiveClass = `
    text-[var(--color-text-primary)]
    hover:bg-[var(--color-background-emphasis)]
  `;

  // Text size class based on mobile prop
  $: textSizeClass = isMobile ? 'text-[length:var(--text-base)]' : 'text-[length:var(--text-sm)]';

  // Final combined classes
  $: linkClass = `
    ${baseClasses}
    ${textSizeClass}
    ${isActive ? activeClass : inactiveClass}
    ${isMobile ? 'block' : ''}
  `;
</script>

<a {href} class={linkClass} on:click>
  <slot />
</a>

<!-- Removed <style> block as dark mode hover is handled inline with dark: prefix -->

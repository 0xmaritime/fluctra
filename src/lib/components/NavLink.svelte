<script lang="ts">
  import { page } from '$app/stores';

  export let href: string = '';
  export let isMobile: boolean = false;

  // Determine if current link is active (use startsWith for parent routes)
  $: isActive = $page.url.pathname === href || ($page.url.pathname.startsWith(href) && href !== '/');

  // Base classes for common styling
  const baseClasses = "px-3 py-2 rounded-lg font-medium transition-all duration-200 ease-out"; // Using --radius-md implicitly

  // Conditional classes based on state and mode
  $: activeClass = 'bg-[var(--color-interactive)] text-[var(--color-interactive-text)]';
  $: inactiveClass = `
    text-[var(--color-text-primary)]
    hover:bg-[var(--color-gray-100)]
    dark:hover:bg-[var(--color-gray-800)]
  `; // Hover styles defined directly as they differ for dark mode

  // Text size class based on mobile prop
  $: textSizeClass = isMobile ? 'text-base' : 'text-sm';

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
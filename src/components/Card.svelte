<script lang="ts">
  export let title: string = '';
  export let subtitle: string = '';
  export let className: string = '';
  // Padding is now handled by the base .card class in app.css (defaults to p-6).
  // If different padding is needed occasionally, it can be overridden via the className prop, e.g., className="p-4".
</script>

<div class={`card ${className}`}>
  {#if title}
    <div class="mb-[calc(var(--spacing)*2.5)]"> <!-- Equivalent to mb-5 (20px) ~mb-4 original -->
      <h3 class="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
      {#if subtitle}
        <p class="text-sm text-[var(--color-text-secondary)] mt-[var(--spacing)]">{subtitle}</p> <!-- Equivalent to mt-1 (8px) -->
      {/if}
    </div>
  {/if}
  <div>
    <slot />
  </div>
</div>
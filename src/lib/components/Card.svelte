<script lang="ts">
  export let title: string = '';
  export let subtitle: string = '';
  export let className: string = '';
  // Padding is now handled by the base .card class in app.css (defaults to p-6).
  // If different padding is needed occasionally, it can be overridden via the className prop, e.g., className="p-4".
</script>

<div class={`card ${className}`}>
  {#if title}
    <div class="mb-[calc(var(--spacing)*3)]"> <!-- Use 24px spacing -->
      <h3 class="text-[length:var(--text-lg)] font-bold text-[var(--color-text-primary)]">{title}</h3> <!-- Use DS text size and bold weight -->
      {#if subtitle}
        <p class="text-[length:var(--text-sm)] text-[var(--color-text-secondary)] mt-[calc(var(--spacing)/2)]">{subtitle}</p> <!-- Use DS text size and 4px margin -->
      {/if}
    </div>
  {/if}
  <div>
    <slot />
  </div>
</div>

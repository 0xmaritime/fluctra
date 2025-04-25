<script lang="ts">
  export let title: string = '';
  export let subtitle: string = '';
  export let className: string = '';
  // Padding is now handled by the base .card class in app.css
</script>

<div class={`card ${className}`}>
  {#if title}
    <div class="mb-[var(--spacing-5)]"> <!-- Replaced mb-4 with Meridian variable -->
      <h3 class="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
      {#if subtitle}
        <p class="text-sm text-[var(--color-text-secondary)] mt-[var(--spacing-2)]">{subtitle}</p> <!-- Replaced mt-1 with Meridian variable -->
      {/if}
    </div>
  {/if}
  <div>
    <slot />
  </div>
</div>

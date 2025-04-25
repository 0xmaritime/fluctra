<script lang="ts">
  export let title: string;
  export let value: string | number;
  export let change: number | null = null;
  // Now expects ONLY the path data string(s), not the full <svg> tag
  export let iconPaths: string = '';
  export let variant: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' = 'default';

  // Map variants to Meridian CSS variables for the icon background and text
  const variantStyles = {
    default: { bg: 'var(--color-gray-100)', text: 'var(--color-gray-800)' /* Add dark mode vars if needed */ },
    primary: { bg: 'var(--color-primary-100)', text: 'var(--color-primary-800)' /* Add dark mode vars */ },
    secondary: { bg: 'var(--color-secondary-100)', text: 'var(--color-secondary-800)' /* Add dark mode vars */ },
    success: { bg: 'var(--color-success-100)', text: 'var(--color-success-800)' /* Add dark mode vars */ },
    warning: { bg: 'var(--color-warning-100)', text: 'var(--color-warning-800)' /* Add dark mode vars */ },
    error: { bg: 'var(--color-error-100)', text: 'var(--color-error-800)' /* Add dark mode vars */ }
    // Add dark mode mapping here if needed based on final app.css
  };

  $: currentVariant = variantStyles[variant];

  // Determine change color using Meridian semantic colors
  $: changeColorVar = change === null ? '' : change > 0 ? 'var(--color-success-700)' : change < 0 ? 'var(--color-error-700)' : 'var(--color-text-secondary)';

  // Format change percentage
  $: formattedChange = change === null ? null : `${change > 0 ? '+' : ''}${change}%`;

</script>

<div class="card p-6">
  <div class="flex items-start justify-between">
    <div>
      <p class="text-sm font-medium text-[var(--color-text-secondary)]">{title}</p>
      <p class="mt-2 text-3xl font-semibold text-[var(--color-text-primary)]">{value}</p> <!-- Changed from mt-[calc(var(--spacing))] to mt-2 (16px) -->

      {#if change !== null}
        <div class="mt-2 flex items-center"> <!-- Changed from mt-[calc(var(--spacing))] to mt-2 (16px) -->
          <span class="text-sm font-medium flex items-center" style:color={changeColorVar}>
            {#if change > 0}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mr-1"><path fill-rule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clip-rule="evenodd" /></svg>
            {:else if change < 0}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mr-1"><path fill-rule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clip-rule="evenodd" /></svg>
            {/if}
            {formattedChange}
          </span>
          <span class="text-sm text-[var(--color-text-secondary)] ml-1">from last period</span>
        </div>
      {/if}
    </div>

    {#if iconPaths}
      <div class="rounded-full p-3" style:background-color={currentVariant.bg} style:color={currentVariant.text}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
          <!-- Render the path data directly -->
          {@html iconPaths} <!-- Reverted back to @html as paths can include multiple elements -->
        </svg>
      </div>
    {/if}
  </div>
</div>

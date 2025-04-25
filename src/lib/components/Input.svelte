<script lang="ts">
  export let type: string = 'text';
  export let placeholder: string = '';
  export let value: string | number = ''; // Allow number type as well
  export let label: string = '';
  export let helpText: string = '';
  export let error: string = '';
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let className: string = '';
  export let id: string = '';

  // Generate random ID if none provided
  if (!id) {
    id = `input-${Math.random().toString(36).substring(2, 9)}`;
  }
</script>

<div class={className}>
  {#if label}
    <label for={id} class="block text-sm font-medium text-[var(--color-text-primary)] mb-0.5"> <!-- Changed from mb-[calc(var(--spacing)/2)] to mb-0.5 (4px) -->
      {label}
      {#if required}
        <span class="text-[var(--color-error-500)]">*</span>
      {/if}
    </label>
  {/if}

  <input
    {id}
    {type}
    {placeholder}
    bind:value
    {disabled}
    {required}
    class="input {error ? 'error' : ''}"
    {...$$restProps}
    on:input
    on:change
    on:focus
    on:blur
  />

  {#if helpText && !error}
    <p class="mt-0.5 text-sm text-[var(--color-text-secondary)]">{helpText}</p> <!-- Changed from mt-[calc(var(--spacing)/2)] to mt-0.5 (4px) -->
  {/if}

  {#if error}
    <p class="mt-0.5 text-sm text-[var(--color-error-500)]">{error}</p> <!-- Changed from mt-[calc(var(--spacing)/2)] to mt-0.5 (4px) -->
  {/if}
</div>

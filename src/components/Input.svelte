<script lang="ts">
  export let type: string = 'text'
  export let placeholder: string = ''
  export let value: string = ''
  export let label: string = ''
  export let helpText: string = ''
  export let error: string = ''
  export let required: boolean = false
  export let disabled: boolean = false
  export let className: string = ''
  export let id: string = ''
  
  // Generate random ID if none provided
  if (!id) {
    id = `input-${Math.random().toString(36).substring(2, 9)}`
  }
</script>

<div class={className}>
  {#if label}
    <label for={id} class="block text-sm font-medium text-neutral-900 mb-1">
      {label}
      {#if required}
        <span class="text-error-500">*</span>
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
    class="input {error ? 'border-error-500 focus:ring-error-500' : ''}"
    on:input
    on:change
    on:focus
    on:blur
  />
  
  {#if helpText && !error}
    <p class="mt-1 text-sm text-neutral-500">{helpText}</p>
  {/if}
  
  {#if error}
    <p class="mt-1 text-sm text-error-600">{error}</p>
  {/if}
</div>
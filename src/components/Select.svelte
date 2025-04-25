<script lang="ts">
  export let options: { value: string; label: string }[] = []
  export let value: string = ''
  export let label: string = ''
  export let helpText: string = ''
  export let error: string = ''
  export let required: boolean = false
  export let disabled: boolean = false
  export let className: string = ''
  export let placeholder: string = 'Select an option'
  export let id: string = ''
  
  // Generate random ID if none provided
  if (!id) {
    id = `select-${Math.random().toString(36).substring(2, 9)}`
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
  
  <div class="relative">
    <select
      {id}
      bind:value
      {disabled}
      {required}
      class="input appearance-none pr-8 {error ? 'border-error-500 focus:ring-error-500' : ''}"
      on:change
    >
      <option value="" disabled selected>{placeholder}</option>
      {#each options as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
    
    <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-neutral-400">
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </div>
  </div>
  
  {#if helpText && !error}
    <p class="mt-1 text-sm text-neutral-500">{helpText}</p>
  {/if}
  
  {#if error}
    <p class="mt-1 text-sm text-error-600">{error}</p>
  {/if}
</div>
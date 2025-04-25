<script lang="ts">
  export let title: string
  export let value: string | number
  export let change: number | null = null
  export let icon: string = ''
  export let variant: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' = 'default'
  
  // Map variants to classes for the icon background
  const bgColorClass = {
    default: 'bg-neutral-100 text-neutral-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-error-100 text-error-800'
  }
  
  // Determine if change is positive, negative, or neutral
  $: changeColorClass = change === null 
    ? '' 
    : change > 0 
      ? 'text-success-600' 
      : change < 0 
        ? 'text-error-600' 
        : 'text-neutral-500'
  
  // Format change percentage
  $: formattedChange = change === null 
    ? null 
    : `${change > 0 ? '+' : ''}${change}%`
</script>

<div class="card p-6">
  <div class="flex items-start justify-between">
    <div>
      <p class="text-sm font-medium text-neutral-500">{title}</p>
      <p class="mt-2 text-3xl font-semibold text-neutral-900">{value}</p>
      
      {#if change !== null}
        <div class="mt-2 flex items-center">
          <span class={`text-sm ${changeColorClass} font-medium flex items-center`}>
            {#if change > 0}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mr-1">
                <path fill-rule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clip-rule="evenodd" />
              </svg>
            {:else if change < 0}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mr-1">
                <path fill-rule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clip-rule="evenodd" />
              </svg>
            {/if}
            {formattedChange}
          </span>
          <span class="text-sm text-neutral-500 ml-1">from last period</span>
        </div>
      {/if}
    </div>
    
    {#if icon}
      <div class={`rounded-full p-3 ${bgColorClass[variant]}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
          {@html icon}
        </svg>
      </div>
    {/if}
  </div>
</div>
<script lang="ts">
  export let progress: number
  export let color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' = 'primary'
  export let size: 'xs' | 'sm' | 'md' | 'lg' = 'md'
  export let className: string = ''
  export let showValue: boolean = false
  
  // Ensure progress is between 0 and 100
  $: validProgress = Math.max(0, Math.min(100, progress))
  
  // Create a formatter for displaying percentages
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
  
  // Format the progress value
  $: formattedProgress = formatter.format(validProgress / 100)
  
  // Map colors to Tailwind classes
  const colorClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500'
  }
  
  // Map sizes to height classes
  const sizeClasses = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }
</script>

<div class={className}>
  <div class="flex justify-between items-center mb-1">
    <slot name="label"></slot>
    {#if showValue}
      <span class="text-sm font-medium text-neutral-700">{formattedProgress}</span>
    {/if}
  </div>
  
  <div class={`w-full bg-neutral-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
    <div 
      class={`${colorClasses[color]} transition-all duration-500 ease-out h-full rounded-full`}
      style={`width: ${validProgress}%`}
    ></div>
  </div>
  
  <slot name="help"></slot>
</div>
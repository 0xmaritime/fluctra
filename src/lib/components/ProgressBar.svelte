<script lang="ts">
  export let progress: number;
  export let color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' = 'primary';
  export let size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  export let className: string = '';
  export let showValue: boolean = false;

  // Ensure progress is between 0 and 100
  $: validProgress = Math.max(0, Math.min(100, progress));

  // Create a formatter for displaying percentages
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  // Format the progress value
  $: formattedProgress = formatter.format(validProgress / 100);

  // Map prop colors to Meridian CSS variables
  const colorVarMap = {
    primary: 'var(--color-primary-600)',
    secondary: 'var(--color-secondary-500)',
    success: 'var(--color-success-500)',
    warning: 'var(--color-warning-500)',
    error: 'var(--color-error-500)'
  };

  // Map sizes to height classes (using standard Tailwind heights)
  const sizeClasses = {
    xs: 'h-1', // 4px
    sm: 'h-2', // 8px
    md: 'h-3', // 12px
    lg: 'h-4'  // 16px
  };

  $: progressBgColor = colorVarMap[color];
</script>

<div class={className}>
  <div class="flex justify-between items-center mb-[calc(var(--spacing)/2)]">
    <slot name="label"></slot>
    {#if showValue}
      <span class="text-[length:var(--text-sm)] font-medium text-[var(--color-text-secondary)]">{formattedProgress}</span>
    {/if}
  </div>

  <div class={`w-full bg-[var(--color-gray-200)] dark:bg-[var(--color-gray-700)] rounded-full overflow-hidden ${sizeClasses[size]}`}>
    <div
      class="transition-all duration-[var(--duration-normal)] ease-[var(--ease-out-expo)] h-full rounded-full"
      style:width="{validProgress}%"
      style:background-color={progressBgColor}
    ></div>
  </div>

  <slot name="help"></slot>
</div>

<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral' = 'primary'
  export let className: string = ''
  
  // Map variants to classes
  const variantClasses = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    neutral: 'badge-neutral'
  }
</script>

<span class={`badge ${variantClasses[variant]} ${className}`}>
  <slot />
</span>

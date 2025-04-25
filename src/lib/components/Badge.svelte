<script lang="ts">
  // Added 'info' based on app.css implementation, assuming it might be needed.
  // Added 'primary' based on app.css implementation.
  export let variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral' | 'info' = 'primary';
  export let className: string = '';

  // Map variants to base classes from app.css
  const variantClasses = {
    primary: 'badge-primary',
    secondary: 'badge-secondary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    neutral: 'badge-neutral',
    info: 'badge-info' // Added mapping for info
  };
</script>

<span class={`badge ${variantClasses[variant]} ${className}`}>
  <slot />
</span>
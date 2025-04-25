<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'ghost' = 'primary'
  export let size: 'sm' | 'md' | 'lg' = 'md'
  export let type: 'button' | 'submit' | 'reset' = 'button'
  export let disabled: boolean = false
  export let fullWidth: boolean = false
  export let className: string = ''
  
  // Compute sizes
  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  }
  
  // Compute variant classes
  const variantClasses = {
    primary: 'button-primary',
    secondary: 'button-secondary',
    ghost: 'button-ghost'
  }
  
  // Generate class string
  const buttonClass = `
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${fullWidth ? 'w-full' : ''} 
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `
</script>

<button 
  {type}
  class={buttonClass}
  {disabled}
  on:click
>
  <slot />
</button>

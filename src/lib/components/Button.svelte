<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let disabled: boolean = false;
  export let fullWidth: boolean = false;
  export let className: string = '';
  export let stopPropagation: boolean = false;

  // Base variant classes from app.css
  const variantClasses = {
    primary: 'button-primary',
    secondary: 'button-secondary',
    ghost: 'button-ghost'
  };

  // Size classes from app.css
  const sizeClasses = {
    sm: 'button-sm',
    md: 'button-md',
    lg: 'button-lg'
  };

  // Combine classes
  $: buttonClass = `
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  function handleClick(e: MouseEvent) {
    if (stopPropagation) e.stopPropagation();
    $$restProps.onclick?.(e);
  }
</script>

<button
  {type}
  class={buttonClass}
  {disabled}
  {...$$restProps}
  on:click={handleClick}
>
  <slot />
</button>

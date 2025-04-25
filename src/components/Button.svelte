<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'ghost' = 'primary';
  // Note: Size prop is currently unused as base styles define one size.
  // If size variations are needed, they should be added as modifier classes (e.g., .button-sm) in app.css
  // and applied here based on the 'size' prop.
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let disabled: boolean = false;
  export let fullWidth: boolean = false;
  export let className: string = '';

  // Base variant classes from app.css
  const variantClasses = {
    primary: 'button-primary',
    secondary: 'button-secondary',
    ghost: 'button-ghost'
  };

  // Combine classes
  $: buttonClass = `
    ${variantClasses[variant]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim(); // Use trim() to remove leading/trailing whitespace

</script>

<button
  {type}
  class={buttonClass}
  {disabled}
  on:click
>
  <slot />
</button>

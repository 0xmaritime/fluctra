### Avatar Components

**Rounded Corner Avatars**:
- Use `rounded-lg` class for consistent corner rounding (0.5rem radius)
- Randomly selects from design system colors (primary, secondary, success, warning, error, info)
- White text for contrast
- Default border: `border border-[var(--color-border-subtle)]`

Example:
```html
<div class="w-5 h-5 rounded-lg flex items-center justify-center text-white" 
     style:background="var(--color-{['primary','secondary','success','warning','error','info'][Math.floor(Math.random() * 6)]}-500)">
  <!-- Content -->
</div>
```

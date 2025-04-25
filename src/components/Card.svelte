<script lang="ts">
  export let title: string = '';
  export let subtitle: string = '';
  export let className: string = '';
  export let padding: string = 'p-6';
</script>

<div class={`card ${padding} ${className}`}>
  {#if title}
    <div class="mb-4">
      <h3 class="text-lg font-semibold text-neutral-900">{title}</h3>
      {#if subtitle}
        <p class="text-sm text-neutral-500 mt-1">{subtitle}</p>
      {/if}
    </div>
  {/if}
  <div>
    <slot />
  </div>
</div>
<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/Button.svelte'; // Use refactored Button component
</script>

<div class="text-center py-8"> <!-- Replaced py-[calc(var(--spacing)*8)] -->
  <h1 class="text-4xl font-bold text-[var(--color-interactive)] mb-2">Oops!</h1> <!-- Replaced mb-[calc(var(--spacing)*2)] -->
  <h2 class="text-2xl font-semibold text-[var(--color-foreground)] mb-1">{$page.status}: {$page.error?.message || 'Page Not Found'}</h2> <!-- Replaced mb-[calc(var(--spacing))] -->
  <p class="text-[var(--color-text-secondary)] mb-4 max-w-xl mx-auto"> <!-- Replaced mb-[calc(var(--spacing)*4)] -->
    Sorry, we couldn't find the page you were looking for: {$page.url.pathname}
  </p>
  <Button on:click={() => import('$app/navigation').then(nav => nav.goto('/'))}>
    Return to Home Page
  </Button>
</div>

<script lang="ts">
  import { page } from '$app/stores';
  import Button from '../components/Button.svelte'; // Use refactored Button component
</script>

<div class="text-center py-[calc(var(--spacing)*8)]"> <!-- py-16 -> 64px -->
  <h1 class="text-4xl font-bold text-[var(--color-interactive)] mb-[calc(var(--spacing)*2)]">Oops!</h1> <!-- text-primary-600 -> text-interactive, mb-4 -> 16px -->
  <h2 class="text-2xl font-semibold text-[var(--color-foreground)] mb-[calc(var(--spacing))]">{$page.status}: {$page.error?.message || 'Page Not Found'}</h2> <!-- text-neutral-900 -> text-foreground, mb-2 -> 8px -->
  <p class="text-[var(--color-text-secondary)] mb-[calc(var(--spacing)*4)] max-w-xl mx-auto"> <!-- text-neutral-600 -> text-secondary, mb-8 -> 32px -->
    Sorry, we couldn't find the page you were looking for: {$page.url.pathname}
  </p>
  <Button on:click={() => import('$app/navigation').then(nav => nav.goto('/'))}>
    Return to Home Page
  </Button>
</div>
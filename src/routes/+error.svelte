<script lang="ts">
  import { page } from '$app/stores'
  import Button from '../components/Button.svelte' // Import Button component
</script>

<div class="text-center py-16">
  <h1 class="text-4xl font-bold text-primary-600 mb-4">Oops!</h1>
  <h2 class="text-2xl font-semibold text-neutral-900 mb-2">{$page.status}: {$page.error?.message || 'Page Not Found'}</h2>
  <p class="text-neutral-600 mb-8">
    Sorry, we couldn't find the page you were looking for: {$page.url.pathname}
  </p>
  <Button on:click={() => import('$app/navigation').then(nav => nav.goto('/'))}>
    Return to Home Page
  </Button>
</div>

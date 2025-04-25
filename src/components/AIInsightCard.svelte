<script lang="ts">
  export let insights: string[] = []
  export let title: string = 'AI Insights'
  export let actionText: string = 'View Details'
  export let onAction: () => void = () => {}
</script>

<div class="card bg-secondary-50 border-secondary-200 p-6">
  <div class="flex items-center space-x-2 mb-4">
    <div class="font-semibold text-neutral-900">{title}</div>
    <Badge variant="secondary">AI Powered</Badge>
  </div>
  
  {#if insights.length > 0}
    <ul class="space-y-2 mb-6">
      {#each insights as insight}
        <li class="flex items-start">
          <span class="text-secondary-500 mt-1 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
              <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192z" />
              <path fill-rule="evenodd" d="M1.764 13.272l-.505-.51a1 1 0 011.416-1.413l.506.51 1.506-1.51a1 1 0 111.414 1.414l-2.676 2.677a1 1 0 01-1.415 0l-.746-.746zm9.618-7.704a1 1 0 00-1.414 0L8.335 7.201l-.507-.51a1 1 0 10-1.414 1.414l.943.943a1 1 0 001.413 0l2.618-2.617a1 1 0 000-1.414z" clip-rule="evenodd" />
            </svg>
          </span>
          <span class="text-neutral-700">{insight}</span>
        </li>
      {/each}
    </ul>
  {:else}
    <p class="text-neutral-700 mb-6">No insights available at this time.</p>
  {/if}
  
  <Button variant="secondary" on:click={onAction}>{actionText}</Button>
</div>

<script context="module">
  import Badge from './Badge.svelte'
  import Button from './Button.svelte'
</script>

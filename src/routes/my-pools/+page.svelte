<script lang="ts">
  import { goto } from '$app/navigation';
  import Card from '$lib/components/Card.svelte';
  import Button from '$lib/components/Button.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import ProgressBar from '$lib/components/ProgressBar.svelte';
  import Select from '$lib/components/Select.svelte';
  import { onMount } from 'svelte';

  // Filter options
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active Only' },
    { value: 'ended', label: 'Ended Only' },
    { value: 'draft', label: 'Drafts' }
  ];

  // State
  let statusFilter = 'all';

  // Mock data for pools
  const myPools = [
    { id: 1, name: 'Solana DeFi Launch', status: 'active' as const, discount: 25, timeRemaining: '3d 2h', raised: 45000, target: 100000, progress: 45, uniqueBuyers: 62, startDate: 'Jul 15, 2025', endDate: 'Jul 25, 2025', chain: 'Solana' },
    { id: 2, name: 'Solana NFT Drop', status: 'active' as const, discount: 35, timeRemaining: '1d 6h', raised: 80000, target: 100000, progress: 80, uniqueBuyers: 94, startDate: 'Jul 20, 2025', endDate: 'Jul 27, 2025', chain: 'Solana' },
    { id: 3, name: 'GameFi Token', status: 'ended' as const, discount: 40, timeRemaining: 'Ended', raised: 100000, target: 100000, progress: 100, uniqueBuyers: 156, startDate: 'Jun 15, 2025', endDate: 'Jul 10, 2025', chain: 'Solana' },
    { id: 4, name: 'Community Round', status: 'draft' as const, discount: 20, timeRemaining: 'Not started', raised: 0, target: 30000, progress: 0, uniqueBuyers: 0, startDate: 'Scheduled for Aug 1, 2025', endDate: 'Scheduled for Aug 10, 2025', chain: 'Solana' },
    { id: 5, name: 'Solana DAO', status: 'draft' as const, discount: 15, timeRemaining: 'Not started', raised: 0, target: 50000, progress: 0, uniqueBuyers: 0, startDate: 'Scheduled for Aug 15, 2025', endDate: 'Scheduled for Aug 30, 2025', chain: 'Solana' }
  ];

  // Computed properties
  $: filteredPools = statusFilter === 'all'
    ? myPools
    : myPools.filter(pool => pool.status === statusFilter);

  // Format currency
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  }

   // Helper functions for badge/progress variants
  function getStatusBadgeVariant(status: 'active' | 'ended' | 'draft'): 'success' | 'secondary' | 'primary' {
      switch (status) {
          case 'active': return 'success';
          case 'ended': return 'secondary';
          case 'draft': return 'primary';
          default: return 'secondary';
      }
  }
  function getDiscountBadgeVariant(discount: number): 'success' | 'primary' | 'secondary' {
      if (discount >= 30) return 'success';
      if (discount >= 15) return 'primary';
      return 'secondary';
  }
   function getProgressBarColor(status: 'active' | 'ended' | 'draft', progress: number): 'success' | 'primary' | 'secondary' {
      if (status === 'draft') return 'secondary';
      if (progress >= 80) return 'success';
      if (progress >= 40) return 'primary';
      return 'secondary';
   }

  // Function to handle resetting the filter
  function viewAllPools() {
      statusFilter = 'all';
  }

  const noPoolsIcon = `<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="8" y1="12" x2="16" y2="12"></line><line x1="12" y1="8" x2="12" y2="16"></line>`;

  onMount(() => {});
</script>

<div class="animate-slide-up space-y-6">
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-4">
     <div>
        <h1 class="text-2xl font-bold text-[var(--color-foreground)]">My Discount Pools</h1>
        <p class="text-[var(--color-text-secondary)] mt-1">Manage your active and past token discount pools</p>
     </div>
    <Button on:click={() => goto('/create-discount')}>Create New Pool</Button>
  </div>

  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-4">
    <div class="text-[var(--color-text-secondary)] font-medium text-sm">
      <span class="font-semibold text-[var(--color-text-primary)]">{filteredPools.length}</span>
      {filteredPools.length === 1 ? 'pool' : 'pools'} found
    </div>
    <Select options={statusOptions} bind:value={statusFilter} className="w-full sm:w-48" />
  </div>

  {#if filteredPools.length === 0}
    <Card>
      <div class="text-center py-8">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12 mx-auto text-[var(--color-text-secondary)] opacity-50">
           {@html noPoolsIcon}
         </svg>
        <h3 class="mt-4 text-lg font-medium text-[var(--color-foreground)]">No pools found</h3>
        <p class="mt-1 text-[var(--color-text-secondary)]">No pools matching your selected filter.</p>
        <div class="mt-6">
          <Button variant="secondary" on:click={viewAllPools}>
            View All Pools
          </Button>
        </div>
      </div>
    </Card>
  {:else}
    <div class="space-y-6">
      {#each filteredPools as pool (pool.id)}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <!-- Added flex-wrap here -->
          <div class="flex justify-between flex-wrap gap-y-4 gap-x-2 items-start">
            <div>
              <div class="flex items-center gap-x-3">
                <h3 class="text-lg font-semibold text-[var(--color-text-primary)]">{pool.name}</h3>
                 <Badge variant={getStatusBadgeVariant(pool.status)}>{pool.status}</Badge>
              </div>
              <div class="flex items-center mt-1 flex-wrap gap-x-2 gap-y-1">
                 <Badge variant={getDiscountBadgeVariant(pool.discount)}>{pool.discount}% Discount</Badge>
                 <Badge variant="neutral">{pool.chain}</Badge>
              </div>
            </div>

            <div class="text-right text-xs text-[var(--color-text-secondary)] shrink-0">
              <div>
                {pool.status === 'draft' ? 'Scheduled' : 'Started'}: <span class="font-medium text-[var(--color-text-primary)]">{pool.startDate}</span>
              </div>
              <div>
                {pool.status === 'draft' ? 'Ends (Est.)' : pool.status === 'ended' ? 'Ended' : 'Ends'}: <span class="font-medium text-[var(--color-text-primary)]">{pool.endDate}</span>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <div class="flex justify-between text-sm text-[var(--color-text-secondary)] mb-1">
              <span>
                {#if pool.status === 'draft'}
                    Target: {formatCurrency(pool.target)}
                {:else}
                   {formatCurrency(pool.raised)} / {formatCurrency(pool.target)} Raised
                {/if}
              </span>
              <span>
                {#if pool.status === 'active'}
                    {pool.timeRemaining} remaining
                {:else if pool.status === 'ended'}
                    Completed
                {:else}
                    Not started
                {/if}
              </span>
            </div>

            <ProgressBar
              progress={pool.progress}
              color={getProgressBarColor(pool.status, pool.progress)}
              showValue={false}
            />
          </div>

          <div class="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-2">
            <div class="text-sm text-[var(--color-text-secondary)]">
               {#if pool.status !== 'draft'}
                {pool.uniqueBuyers} unique buyers
               {:else}
                 <span class="italic">Draft - Not active</span>
               {/if}
            </div>

            <div class="flex space-x-3">
              {#if pool.status === 'draft'}
                <Button variant="secondary" size="sm" on:click={() => goto(`/create-discount?edit=${pool.id}`)}>
                  Edit
                </Button>
                <Button size="sm" on:click={() => alert('Deploying pool ' + pool.id)}>
                  Deploy
                </Button>
              {:else}
                <Button variant="ghost" size="sm" on:click={() => goto(`/analytics?pool=${pool.id}`)}>
                  Analytics
                </Button>
                <Button size="sm" on:click={() => alert('Manage pool ' + pool.id)}>
                  Manage
                </Button>
              {/if}
            </div>
          </div>
        </Card>
      {/each}
    </div>
  {/if}
</div>

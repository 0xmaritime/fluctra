<script lang="ts">
  import { goto } from '$app/navigation';
  import Card from '../../components/Card.svelte';
  import StatCard from '../../components/StatCard.svelte';
  import Button from '../../components/Button.svelte';
  import Badge from '../../components/Badge.svelte';
  import ProgressBar from '../../components/ProgressBar.svelte';
  import AIInsightCard from '../../components/AIInsightCard.svelte';
  import { onMount } from 'svelte';

  // Active pools data (example)
  const activePools = [
    { id: 1, name: 'MyToken Presale', discount: 30, timeRemaining: '12h 45m', raised: 15200, target: 20000, progress: 76, chain: 'Ethereum' },
    { id: 2, name: 'MyToken Phase 2', discount: 15, timeRemaining: '2d 8h', raised: 9360, target: 50000, progress: 19, chain: 'Base' }
  ];

  // AI-generated recommendations (example)
  const aiInsights = [
    'Based on current market conditions, consider adjusting your Phase 2 discount to 20% to accelerate sales.',
    'Your presale pool is attracting 2.5x more unique wallets than similar tokens in your category.',
    'Consider implementing a 7-day lockup for price stability after your presale concludes.'
  ];

  // Format currency
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  }

  // Function to determine badge variant based on discount
  function getDiscountBadgeVariant(discount: number): 'success' | 'primary' | 'secondary' {
      if (discount >= 40) return 'success';
      if (discount >= 25) return 'primary';
      return 'secondary';
  }

  // Function to determine progress bar color based on status/progress
   function getProgressBarColor(progress: number): 'success' | 'primary' | 'secondary' {
      if (progress >= 80) return 'success';
      if (progress >= 40) return 'primary';
      return 'secondary'; // Or perhaps 'warning' if very low?
   }

   // Define icon PATH DATA strings as variables using template literals
   const activePoolsIconPaths = `<rect x="2" y="6" width="20" height="12" rx="2"></rect><path d="M12 12h.01"></path><path d="M17 12h.01"></path><path d="M7 12h.01"></path>`;
   const totalVolumeIconPaths = `<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>`;
   const uniqueBuyersIconPaths = `<path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path><circle cx="10" cy="7" r="4"></circle><path d="M16 3.13a4 4 0 010 7.75"></path>`;


  onMount(() => {
    // Could include initialization of data fetching or other setup
  });
</script>

<div class="animate-slide-up space-y-6">
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-4">
    <div>
        <h1 class="text-2xl font-bold text-[var(--color-foreground)]">Creator Dashboard</h1>
        <p class="text-[var(--color-text-secondary)] mt-1">Welcome back! Here's an overview of your discount pools.</p>
    </div>
    <Button on:click={() => goto('/create-discount')}>Create New Pool</Button>
  </div>

  <!-- Stats Overview -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <StatCard
      title="Active Pools"
      value={activePools.length}
      iconPaths={activePoolsIconPaths}
      variant="primary"
    />

    <StatCard
      title="Total Volume"
      value={formatCurrency(activePools.reduce((sum, pool) => sum + pool.raised, 0))}
      change={12}
      iconPaths={totalVolumeIconPaths}
      variant="secondary"
    />

    <StatCard
      title="Unique Buyers (Total)"
      value="128"
      change={5}
      iconPaths={uniqueBuyersIconPaths}
      variant="success"
    />
  </div>

  <!-- Active Pools -->
  <div>
    <h2 class="text-xl font-semibold text-[var(--color-foreground)] mb-4">Your Active Pools</h2>

    <div class="space-y-6">
      {#if activePools.length > 0}
        {#each activePools as pool}
          <Card>
            <div class="flex flex-col sm:flex-row justify-between items-start gap-y-3">
              <div>
                <h3 class="font-semibold text-lg text-[var(--color-text-primary)]">{pool.name}</h3>
                <div class="mt-2 flex items-center space-x-2 flex-wrap gap-y-1">
                   <Badge variant={getDiscountBadgeVariant(pool.discount)}>
                    {pool.discount}% Discount
                  </Badge>
                  <Badge variant="neutral">{pool.chain}</Badge>
                  <span class="text-sm text-[var(--color-text-secondary)]">Ends in {pool.timeRemaining}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" on:click={() => goto(`/analytics?pool=${pool.id}`)} className="shrink-0">
                 View Analytics
              </Button>
            </div>

            <div class="mt-4">
              <div class="flex justify-between text-sm text-[var(--color-text-secondary)] mb-1">
                <span>Raised: {formatCurrency(pool.raised)}</span>
                <span>Target: {formatCurrency(pool.target)}</span>
              </div>
              <ProgressBar progress={pool.progress} color={getProgressBarColor(pool.progress)} showValue={false} />
            </div>
          </Card>
        {/each}
       {:else}
          <Card>
              <p class="text-center text-[var(--color-text-secondary)] py-4">You have no active discount pools.</p>
              <div class="text-center mt-2">
                   <Button on:click={() => goto('/create-discount')}>Create Your First Pool</Button>
              </div>
          </Card>
       {/if}
    </div>
  </div>


  <!-- AI Insights -->
  {#if aiInsights.length > 0}
  <div>
     <h2 class="text-xl font-semibold text-[var(--color-foreground)] mb-4">AI Insights & Recommendations</h2>
     <AIInsightCard
      insights={aiInsights}
      title="Optimize Your Current Pools"
      actionText="View Full Analytics"
      onAction={() => goto('/analytics')}
    />
  </div>
  {/if}

</div>
<script lang="ts">
  import { goto } from '$app/navigation'
  import Card from '../../components/Card.svelte'
  import StatCard from '../../components/StatCard.svelte'
  import Button from '../../components/Button.svelte'
  import Badge from '../../components/Badge.svelte'
  import ProgressBar from '../../components/ProgressBar.svelte'
  import AIInsightCard from '../../components/AIInsightCard.svelte'
  import { onMount } from 'svelte'
  
  // Active pools data
  const activePools = [
    {
      id: 1,
      name: 'MyToken Presale',
      discount: 30,
      timeRemaining: '12h 45m',
      raised: 15200,
      target: 20000,
      progress: 76
    },
    {
      id: 2,
      name: 'MyToken Phase 2',
      discount: 15,
      timeRemaining: '2d 8h',
      raised: 9360,
      target: 50000,
      progress: 19
    }
  ]
  
  // AI-generated recommendations
  const aiInsights = [
    'Based on current market conditions, we recommend adjusting your Phase 2 discount to 20% to accelerate sales.',
    'Your presale pool is attracting 2.5x more unique wallets than similar tokens in your category.',
    'Consider implementing a 7-day lockup for price stability after your presale concludes.'
  ]
  
  // Format currency
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }
  
  onMount(() => {
    // Could include initialization of data fetching or other setup
  })
</script>

<div class="animate-slide-up">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold text-neutral-900">Creator Dashboard</h1>
    <Button on:click={() => goto('/create-discount')}>Create New Pool</Button>
  </div>
  
  <p class="text-neutral-600 mb-8">Welcome back! Here's an overview of your discount pools.</p>
  
  <!-- Stats Overview -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <StatCard
      title="Active Pools"
      value={activePools.length}
      icon='<rect x="2" y="6" width="20" height="12" rx="2"></rect><path d="M12 12h.01"></path><path d="M17 12h.01"></path><path d="M7 12h.01"></path>'
      variant="primary"
    />
    
    <StatCard
      title="Total Volume"
      value={formatCurrency(activePools.reduce((sum, pool) => sum + pool.raised, 0))}
      change={12}
      icon='<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>'
      variant="secondary"
    />
    
    <StatCard
      title="Unique Buyers"
      value="128"
      change={5}
      icon='<path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path><circle cx="10" cy="7" r="4"></circle><path d="M16 3.13a4 4 0 010 7.75"></path>'
      variant="success"
    />
  </div>
  
  <!-- Active Pools -->
  <h2 class="text-xl font-semibold text-neutral-900 mb-4">Your Active Pools</h2>
  
  <div class="space-y-6">
    {#each activePools as pool}
      <Card>
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-semibold text-lg text-neutral-900">{pool.name}</h3>
            <div class="mt-2 flex items-center space-x-2">
              <Badge variant={pool.discount >= 25 ? 'primary' : 'secondary'}>
                {pool.discount}% Discount
              </Badge>
              <span class="text-sm text-neutral-500">Ends in {pool.timeRemaining}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" on:click={() => goto(`/analytics/${pool.id}`)}>
            View Details
          </Button>
        </div>
        
        <div class="mt-4">
          <div class="flex justify-between text-sm text-neutral-600 mb-1">
            <span>Raised: {formatCurrency(pool.raised)}</span>
            <span>Target: {formatCurrency(pool.target)}</span>
          </div>
          <ProgressBar progress={pool.progress} />
        </div>
      </Card>
    {/each}
  </div>
  
  <!-- AI Insights -->
  <div class="mt-8">
    <AIInsightCard 
      insights={aiInsights} 
      title="Optimize Your Current Pools"
      actionText="View Analytics"
      onAction={() => goto('/analytics')}
    />
  </div>
</div>

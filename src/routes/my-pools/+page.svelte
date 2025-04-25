<script lang="ts">
  import { goto } from '$app/navigation'
  import Card from '../../components/Card.svelte' // Adjusted import path
  import Button from '../../components/Button.svelte' // Adjusted import path
  import Badge from '../../components/Badge.svelte' // Adjusted import path
  import ProgressBar from '../../components/ProgressBar.svelte' // Adjusted import path
  import Select from '../../components/Select.svelte' // Adjusted import path
  import { onMount } from 'svelte'
  
  // Filter options
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'active', label: 'Active Only' },
    { value: 'ended', label: 'Ended Only' },
    { value: 'draft', label: 'Drafts' }
  ]
  
  // State
  let statusFilter = 'all'
  
  // Mock data for pools
  const myPools = [
    {
      id: 1,
      name: 'MyToken Presale',
      status: 'active',
      discount: 30,
      timeRemaining: '12h 45m',
      raised: 15200,
      target: 20000,
      progress: 76,
      uniqueBuyers: 82,
      startDate: 'Jul 15, 2025',
      endDate: 'Jul 20, 2025',
      chain: 'Ethereum'
    },
    {
      id: 2,
      name: 'MyToken Phase 2',
      status: 'active',
      discount: 15,
      timeRemaining: '2d 8h',
      raised: 9360,
      target: 50000,
      progress: 19,
      uniqueBuyers: 46,
      startDate: 'Jul 18, 2025',
      endDate: 'Jul 25, 2025',
      chain: 'Base'
    },
    {
      id: 3,
      name: 'NFT Holders Event',
      status: 'ended',
      discount: 40,
      timeRemaining: 'Ended',
      raised: 25000,
      target: 25000,
      progress: 100,
      uniqueBuyers: 134,
      startDate: 'Jun 28, 2025',
      endDate: 'Jul 10, 2025',
      chain: 'Ethereum'
    },
    {
      id: 4,
      name: 'Community Round',
      status: 'draft',
      discount: 20,
      timeRemaining: 'Not started',
      raised: 0,
      target: 30000,
      progress: 0,
      uniqueBuyers: 0,
      startDate: 'Scheduled for Aug 1, 2025',
      endDate: 'Scheduled for Aug 10, 2025',
      chain: 'Solana'
    }
  ]
  
  // Computed properties
  $: filteredPools = statusFilter === 'all' 
    ? myPools 
    : myPools.filter(pool => pool.status === statusFilter)
  
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
    // Any initialization needed
  })
</script>

<div class="animate-slide-up">
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-4 mb-6">
    <div>
      <h1 class="text-2xl font-bold text-neutral-900">My Discount Pools</h1>
      <p class="text-neutral-600 mt-1">Manage your active and past token discount pools</p>
    </div>
    
    <Button on:click={() => goto('/create-discount')}>Create New Pool</Button>
  </div>
  
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-4 mb-6">
    <div class="text-neutral-700 font-medium">
      <span class="font-semibold">{filteredPools.length}</span> {filteredPools.length === 1 ? 'pool' : 'pools'} found
    </div>
    
    <Select
      options={statusOptions}
      bind:value={statusFilter}
      className="w-full sm:w-48"
    />
  </div>
  
  {#if filteredPools.length === 0}
    <Card>
      <div class="text-center py-8">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-12 h-12 mx-auto text-neutral-400">
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-neutral-900">No pools found</h3>
        <p class="mt-1 text-neutral-600">No pools matching your selected filter.</p>
        
        <div class="mt-6">
          <Button variant="secondary" on:click={() => statusFilter = 'all'}>
            View All Pools
          </Button>
        </div>
      </div>
    </Card>
  {:else}
    <div class="space-y-6">
      {#each filteredPools as pool}
        <Card className="hover:shadow-md transition-shadow duration-200">
          <div class="flex justify-between flex-wrap gap-y-4">
            <div>
              <div class="flex items-center">
                <h3 class="text-lg font-semibold text-neutral-900">{pool.name}</h3>
                {#if pool.status === 'active'}
                  <Badge variant="success" className="ml-3">Active</Badge>
                {:else if pool.status === 'ended'}
                  <Badge variant="secondary" className="ml-3">Ended</Badge>
                {:else if pool.status === 'draft'}
                  <Badge variant="primary" className="ml-3">Draft</Badge>
                {/if}
              </div>
              
              <div class="flex items-center mt-1 flex-wrap">
                <Badge variant={pool.discount >= 25 ? 'primary' : 'secondary'}>
                  {pool.discount}% Discount
                </Badge>
                <span class="mx-2 text-neutral-300">•</span>
                <span class="text-sm text-neutral-600">{pool.chain}</span>
              </div>
            </div>
            
            <div class="text-right text-sm text-neutral-700">
              <div>
                {pool.status === 'draft' ? 'Scheduled' : 'Started'}: <span class="font-medium">{pool.startDate}</span>
              </div>
              <div>
                {pool.status === 'draft' ? 'End date' : pool.status === 'ended' ? 'Ended' : 'Ends'}: <span class="font-medium">{pool.endDate}</span>
              </div>
            </div>
          </div>
          
          <div class="mt-4">
            <div class="flex justify-between text-sm text-neutral-600 mb-1">
              <span>
                {pool.status === 'draft' 
                  ? 'Target' 
                  : `${formatCurrency(pool.raised)} / ${formatCurrency(pool.target)}`
                }
              </span>
              <span>
                {pool.status === 'active' 
                  ? `${pool.timeRemaining} remaining` 
                  : pool.status === 'ended'
                    ? 'Completed'
                    : 'Not started'
                }
              </span>
            </div>
            
            <ProgressBar 
              progress={pool.progress} 
              color={
                pool.status === 'draft' 
                  ? 'secondary'
                  : pool.progress >= 80 
                    ? 'success' 
                    : pool.progress >= 40 
                      ? 'primary' 
                      : 'secondary'
              }
              showValue={false}
            />
          </div>
          
          <div class="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <span class="text-sm text-neutral-600">
                {pool.uniqueBuyers} unique buyers
              </span>
            </div>
            
            <div class="mt-3 sm:mt-0 flex space-x-3">
              {#if pool.status === 'draft'}
                <Button variant="ghost" on:click={() => goto('/create-discount')}>
                  Edit
                </Button>
                <Button on:click={() => {}}>
                  Deploy
                </Button>
              {:else}
                <Button variant="ghost" on:click={() => goto('/analytics')}>
                  Analytics
                </Button>
                <Button on:click={() => {}}>
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

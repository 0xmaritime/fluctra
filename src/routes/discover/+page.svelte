<script lang="ts">
  import Card from '../../components/Card.svelte' // Adjusted import path
  import Input from '../../components/Input.svelte' // Adjusted import path
  import Select from '../../components/Select.svelte' // Adjusted import path
  import Button from '../../components/Button.svelte' // Adjusted import path
  import Badge from '../../components/Badge.svelte' // Adjusted import path
  import AIInsightCard from '../../components/AIInsightCard.svelte' // Adjusted import path
  import { onMount } from 'svelte'
  
  // State for filters
  let blockchain = 'all'
  let minDiscount = 15
  let categories = {
    defi: true,
    gaming: true,
    nft: false,
    ai: true
  }
  let healthScore = '70'
  let timeRemaining = 'active'
  let sortBy = 'discount'
  
  // Blockchain options
  const blockchainOptions = [
    { value: 'all', label: 'All Chains' },
    { value: 'ethereum', label: 'Ethereum' },
    { value: 'solana', label: 'Solana' },
    { value: 'bnb', label: 'BNB Chain' },
    { value: 'base', label: 'Base' }
  ]
  
  // Health score options
  const scoreOptions = [
    { value: 'any', label: 'Any Score' },
    { value: '70', label: '70+ (Good)' },
    { value: '85', label: '85+ (Excellent)' }
  ]
  
  // Time remaining options
  const timeOptions = [
    { value: 'any', label: 'Any Duration' },
    { value: 'ending', label: 'Ending Soon (< 24h)' },
    { value: 'active', label: 'All Active' },
    { value: 'starting', label: 'Starting Soon' }
  ]
  
  // Sort options
  const sortOptions = [
    { value: 'discount', label: 'Sort: Highest Discount' },
    { value: 'ending', label: 'Sort: Ending Soon' },
    { value: 'newest', label: 'Sort: Newest' },
    { value: 'health', label: 'Sort: Highest Health Score' }
  ]
  
  // Mock data for token listings
  const tokens = [
    {
      id: 1,
      name: 'TokenA Finance',
      category: 'DeFi',
      chain: 'Ethereum',
      description: 'TokenA is a lending platform with dynamic interest rates and multi-chain support.',
      discount: 35,
      endTime: '8h 45m',
      healthScore: 92,
      bgColor: 'bg-primary-100',
      textColor: 'text-primary-900'
    },
    {
      id: 2,
      name: 'GameFi Pro',
      category: 'Gaming',
      chain: 'Base',
      description: 'A gaming ecosystem with play-to-earn mechanics and NFT integration.',
      discount: 25,
      endTime: '2d 15h',
      healthScore: 85,
      bgColor: 'bg-secondary-100',
      textColor: 'text-secondary-900'
    },
    {
      id: 3,
      name: 'AIToken',
      category: 'AI/Data',
      chain: 'Solana',
      description: 'Decentralized AI computing platform with tokenized machine learning resources.',
      discount: 20,
      endTime: '5d 8h',
      healthScore: 75,
      bgColor: 'bg-accent-100',
      textColor: 'text-accent-900'
    }
  ]
  
  // AI recommendations
  const aiRecommendations = [
    'Based on your previous purchases and wallet activity, you might be interested in tokens similar to GameFi Pro.'
  ]
  
  // Apply filters function
  function applyFilters() {
    // This would normally filter the results based on selected criteria
    // For the demo, we'll just log the filters
    console.log('Applying filters:', { blockchain, minDiscount, categories, healthScore, timeRemaining, sortBy })
    
    // In a real app, this would trigger an API call or filter the displayed tokens
  }
  
  function showPersonalizedRecommendations() {
    // In a real app, this would load personalized token recommendations
    console.log('Loading personalized recommendations')
  }
  
  onMount(() => {
    // Any initialization needed
  })
</script>

<div class="animate-slide-up">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold text-neutral-900">Discover Discount Opportunities</h1>
    <Button variant="secondary">Create Alert</Button>
  </div>
  
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <!-- Filters Section -->
    <div class="lg:col-span-1 space-y-6">
      <Card title="Filters">
        <div class="space-y-6">
          <Select
            label="Blockchain"
            options={blockchainOptions}
            bind:value={blockchain}
          />
          
          <div>
            <label for="minDiscount" class="block text-sm font-medium text-neutral-900 mb-1">
              Minimum Discount
            </label>
            <input
              id="minDiscount"
              type="range"
              min="0"
              max="75"
              step="5"
              bind:value={minDiscount}
              class="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
            />
            <div class="text-center mt-1 text-sm font-medium text-neutral-700">
              {minDiscount}% or more
            </div>
          </div>
          
          <div>
            <div class="block text-sm font-medium text-neutral-900 mb-2">
              Token Categories
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="cat-defi"
                  bind:checked={categories.defi}
                  class="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                />
                <label for="cat-defi" class="ml-2 text-sm text-neutral-700">
                  DeFi
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="cat-gaming"
                  bind:checked={categories.gaming}
                  class="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                />
                <label for="cat-gaming" class="ml-2 text-sm text-neutral-700">
                  Gaming
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="cat-nft"
                  bind:checked={categories.nft}
                  class="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                />
                <label for="cat-nft" class="ml-2 text-sm text-neutral-700">
                  NFT
                </label>
              </div>
              
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="cat-ai"
                  bind:checked={categories.ai}
                  class="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                />
                <label for="cat-ai" class="ml-2 text-sm text-neutral-700">
                  AI/Data
                </label>
              </div>
            </div>
          </div>
          
          <Select
            label="Pool Health Score"
            options={scoreOptions}
            bind:value={healthScore}
          />
          
          <Select
            label="Time Remaining"
            options={timeOptions}
            bind:value={timeRemaining}
          />
          
          <Button variant="secondary" fullWidth={true} on:click={applyFilters}>
            Apply Filters
          </Button>
        </div>
      </Card>
      
      <AIInsightCard
        title="AI Recommendation"
        insights={aiRecommendations}
        actionText="Show tokens similar to GameFi Pro"
        onAction={showPersonalizedRecommendations}
      />
    </div>
    
    <!-- Results Section -->
    <div class="lg:col-span-3">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-4 mb-6">
        <div class="text-neutral-700 font-medium">
          <span class="font-semibold">{tokens.length} results</span> matching your criteria
        </div>
        
        <Select
          options={sortOptions}
          bind:value={sortBy}
          className="w-full sm:w-64"
        />
      </div>
      
      <div class="space-y-6">
        {#each tokens as token}
          <Card className="hover:shadow-md transition-shadow duration-200">
            <div class="flex flex-col md:flex-row gap-4">
              <!-- Token Logo -->
              <div class="flex-shrink-0">
                <div class={`w-14 h-14 rounded-lg ${token.bgColor} ${token.textColor} flex items-center justify-center font-bold text-xl`}>
                  {token.name.charAt(0)}
                </div>
              </div>
              
              <!-- Token Info -->
              <div class="flex-1">
                <div class="flex flex-col sm:flex-row justify-between gap-y-2">
                  <div>
                    <h3 class="text-lg font-semibold text-neutral-900">{token.name}</h3>
                    <div class="flex items-center mt-1 flex-wrap gap-y-1">
                      <Badge 
                        variant={token.category === 'DeFi' ? 'primary' : token.category === 'Gaming' ? 'secondary' : 'success'}
                      >
                        {token.category}
                      </Badge>
                      <span class="mx-2 text-neutral-300">•</span>
                      <span class="text-sm text-neutral-600">{token.chain}</span>
                    </div>
                  </div>
                  
                  <Badge 
                    variant={token.discount >= 30 ? 'success' : 'primary'} 
                    className="h-min"
                  >
                    {token.discount}% Discount
                  </Badge>
                </div>
                
                <p class="mt-3 text-neutral-600">{token.description}</p>
                
                <div class="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-3">
                  <div>
                    <div class="text-sm text-neutral-500">
                      Sale ends in <span class="font-medium text-neutral-700">{token.endTime}</span>
                    </div>
                    <div class="text-sm text-neutral-500">
                      Health Score: <span class={token.healthScore >= 85 ? 'font-medium text-success-600' : 'font-medium text-primary-600'}>{token.healthScore}</span>
                    </div>
                  </div>
                  
                  <Button>View Details</Button>
                </div>
              </div>
            </div>
          </Card>
        {/each}
      </div>
      
      <!-- Pagination -->
      <div class="flex justify-center mt-8">
        <nav class="flex items-center space-x-2">
          <button type="button" class="p-2 inline-flex items-center justify-center border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50" aria-label="Previous page">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
              <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <button type="button" class="p-2 inline-flex items-center justify-center w-10 h-10 border border-transparent bg-primary-600 rounded-lg text-white" aria-label="Page 1">
            1
          </button>
          
          <button type="button" class="p-2 inline-flex items-center justify-center w-10 h-10 border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50" aria-label="Page 2">
            2
          </button>
          
          <button type="button" class="p-2 inline-flex items-center justify-center w-10 h-10 border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50" aria-label="Page 3">
            3
          </button>
          
          <button type="button" class="p-2 inline-flex items-center justify-center border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50" aria-label="Next page">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</div>

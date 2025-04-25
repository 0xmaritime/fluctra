<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  // Input component not directly used for range, but might be for future search
  // import Input from '$lib/components/Input.svelte';
  import Select from '$lib/components/Select.svelte';
  import Button from '$lib/components/Button.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import AIInsightCard from '$lib/components/AIInsightCard.svelte';
  import { onMount } from 'svelte';

  // State for filters
  let blockchain = 'all';
  let minDiscount = 15;
  let categories = { defi: true, gaming: true, nft: false, ai: true };
  let healthScore = '70';
  let timeRemaining = 'active';
  let sortBy = 'discount';

  // Blockchain options
  const blockchainOptions = [
    { value: 'all', label: 'All Chains' }, { value: 'ethereum', label: 'Ethereum' },
    { value: 'solana', label: 'Solana' }, { value: 'bnb', label: 'BNB Chain' },
    { value: 'base', label: 'Base' }
  ];

  // Health score options
  const scoreOptions = [
    { value: 'any', label: 'Any Score' }, { value: '70', label: '70+ (Good)' },
    { value: '85', label: '85+ (Excellent)' }
  ];

  // Time remaining options
  const timeOptions = [
    { value: 'any', label: 'Any Duration' }, { value: 'ending', label: 'Ending Soon (< 24h)' },
    { value: 'active', label: 'All Active' }, { value: 'starting', label: 'Starting Soon' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'discount', label: 'Sort: Highest Discount' }, { value: 'ending', label: 'Sort: Ending Soon' },
    { value: 'newest', label: 'Sort: Newest' }, { value: 'health', label: 'Sort: Highest Health Score' }
  ];

  // Mock data for token listings
  const tokens = [
    { id: 1, name: 'TokenA Finance', category: 'DeFi', chain: 'Ethereum', description: 'TokenA is a lending platform with dynamic interest rates and multi-chain support.', discount: 35, endTime: '8h 45m', healthScore: 92 },
    { id: 2, name: 'GameFi Pro', category: 'Gaming', chain: 'Base', description: 'A gaming ecosystem with play-to-earn mechanics and NFT integration.', discount: 25, endTime: '2d 15h', healthScore: 85 },
    { id: 3, name: 'AIToken', category: 'AI/Data', chain: 'Solana', description: 'Decentralized AI computing platform with tokenized machine learning resources.', discount: 20, endTime: '5d 8h', healthScore: 75 }
  ];

  // AI recommendations
  const aiRecommendations = [
    'Based on your previous purchases and wallet activity, you might be interested in tokens similar to GameFi Pro.'
  ];

  // Apply filters function (placeholder)
  function applyFilters() {
    console.log('Applying filters:', { blockchain, minDiscount, categories, healthScore, timeRemaining, sortBy });
  }

  function showPersonalizedRecommendations() {
    console.log('Loading personalized recommendations');
  }

  // Helper functions for badge variants
  function getCategoryBadgeVariant(category: string): 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral' | 'info' {
      switch (category.toLowerCase()) {
          case 'defi': return 'primary';
          case 'gaming': return 'secondary';
          case 'ai/data': return 'success';
          case 'nft': return 'info';
          default: return 'neutral';
      }
  }
  function getDiscountBadgeVariant(discount: number): 'success' | 'primary' | 'secondary' {
      if (discount >= 30) return 'success';
      if (discount >= 20) return 'primary';
      return 'secondary';
  }
   function getHealthScoreColor(score: number): string {
       if (score >= 85) return 'var(--color-success-700)';
       if (score >= 70) return 'var(--color-primary-600)';
       return 'var(--color-warning-700)';
   }

  onMount(() => {});
</script>

<div class="animate-slide-up">
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-4 mb-6">
     <div>
        <h1 class="text-2xl font-bold text-[var(--color-foreground)]">Discover Discount Opportunities</h1>
        <p class="text-[var(--color-text-secondary)] mt-1">Find active token sales and get early access prices.</p>
     </div>
    <Button variant="secondary">Create Alert</Button>
  </div>

   <!-- Added grid-cols-1 default -->
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <!-- Filters Section -->
    <div class="lg:col-span-1 space-y-6">
      <Card title="Filters" className="p-5">
        <div class="space-y-5">
          <Select label="Blockchain" options={blockchainOptions} bind:value={blockchain} />

          <div>
            <label for="minDiscount" class="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
              Minimum Discount ({minDiscount}%)
            </label>
             <input
              id="minDiscount"
              type="range"
              min="0" max="75" step="5"
              bind:value={minDiscount}
              class="w-full h-2 bg-[var(--color-gray-200)] dark:bg-[var(--color-gray-700)] rounded-lg appearance-none cursor-pointer accent-[var(--color-interactive)]"
            />
          </div>

          <div>
             <!-- Fixed A11y heading -->
            <div class="block text-sm font-medium text-[var(--color-text-primary)] mb-2" id="category-label">
              Token Categories
            </div>
             <!-- Use aria-labelledby if needed, though structure is clear -->
            <div class="space-y-2" role="group" aria-labelledby="category-label">
              {#each Object.entries(categories) as [key, checked]}
                 <div class="flex items-center">
                  <input type="checkbox" id="cat-{key}" bind:checked={categories[key as keyof typeof categories]} />
                  <label for="cat-{key}" class="ml-2 text-sm text-[var(--color-text-secondary)] capitalize">{key}</label>
                </div>
              {/each}
            </div>
          </div>

          <Select label="Pool Health Score" options={scoreOptions} bind:value={healthScore} />
          <Select label="Time Remaining" options={timeOptions} bind:value={timeRemaining} />

          <Button variant="primary" fullWidth={true} on:click={applyFilters}>
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
        <div class="text-[var(--color-text-secondary)] font-medium text-sm">
          Showing <span class="font-semibold text-[var(--color-text-primary)]">{tokens.length} pools</span> matching criteria
        </div>
        <Select options={sortOptions} bind:value={sortBy} className="w-full sm:w-auto" />
      </div>

      <div class="space-y-6">
        {#each tokens as token (token.id)}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex-shrink-0">
                 <div class="w-14 h-14 rounded-lg bg-[var(--color-background-subtle)] flex items-center justify-center font-bold text-xl text-[var(--color-text-primary)] border border-[var(--color-border-subtle)]">
                  {token.name.charAt(0)}
                </div>
              </div>

              <div class="flex-1">
                <div class="flex flex-col sm:flex-row justify-between gap-y-2">
                  <div>
                    <h3 class="text-lg font-semibold text-[var(--color-text-primary)]">{token.name}</h3>
                    <div class="flex items-center mt-1 flex-wrap gap-x-2 gap-y-1">
                       <Badge variant={getCategoryBadgeVariant(token.category)}>{token.category}</Badge>
                       <Badge variant="neutral">{token.chain}</Badge>
                    </div>
                  </div>
                   <Badge variant={getDiscountBadgeVariant(token.discount)} className="h-min text-base px-3 py-1">
                    {token.discount}% Discount
                  </Badge>
                </div>

                <p class="mt-3 text-[var(--color-text-secondary)] text-sm line-clamp-2">{token.description}</p>

                <!-- Added flex-wrap to this inner div -->
                <div class="mt-4 flex flex-wrap flex-col sm:flex-row justify-between items-start sm:items-center gap-y-3 gap-x-4">
                  <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm">
                     <div class="text-[var(--color-text-secondary)]">
                       Ends in <span class="font-medium text-[var(--color-text-primary)]">{token.endTime}</span>
                     </div>
                     <div class="text-[var(--color-text-secondary)]">
                       Health Score: <span class="font-medium" style:color={getHealthScoreColor(token.healthScore)}>{token.healthScore}</span>
                     </div>
                  </div>
                  <Button size="md" class="mt-2 sm:mt-0">View & Buy</Button> <!-- Ensure button doesn't cause wrap issue -->
                </div>
              </div>
            </div>
          </Card>
        {/each}
      </div>

      <!-- Pagination -->
      <div class="flex justify-center mt-8">
        <nav class="flex items-center space-x-2">
          <Button variant="secondary" size="sm" className="p-2" aria-label="Previous page" disabled>
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" /></svg>
          </Button>
          <Button variant="primary" size="sm" className="w-10 h-10 p-0 flex items-center justify-center" aria-label="Page 1">1</Button>
          <Button variant="secondary" size="sm" className="w-10 h-10 p-0 flex items-center justify-center" aria-label="Page 2">2</Button>
          <Button variant="secondary" size="sm" className="w-10 h-10 p-0 flex items-center justify-center" aria-label="Page 3">3</Button>
          <Button variant="secondary" size="sm" className="p-2" aria-label="Next page">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" /></svg>
          </Button>
        </nav>
      </div>
    </div>
  </div>
</div>

<style>
    /* Style range input track */
    input[type="range"]::-webkit-slider-runnable-track {
        height: 4px;
        cursor: pointer;
        background: var(--color-gray-300);
        border-radius: var(--radius-full);
    }
    input[type="range"]::-moz-range-track {
         height: 4px;
        cursor: pointer;
        background: var(--color-gray-300);
        border-radius: var(--radius-full);
    }
    /* Style range input thumb */
     input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        background: var(--color-interactive);
        border-radius: var(--radius-full);
        cursor: pointer;
        margin-top: -6px; /* Center thumb on track */
    }
     input[type="range"]::-moz-range-thumb {
        width: 16px;
        height: 16px;
        background: var(--color-interactive);
        border-radius: var(--radius-full);
        cursor: pointer;
        border: none;
    }

     /* Checkbox base inherited from app.css */
     input[type="checkbox"] {
       margin-right: 0.5rem; /* Spacing from label */
     }
     input[type="checkbox"] + label {
         cursor: pointer;
     }

    @media (prefers-color-scheme: dark) {
         input[type="range"]::-webkit-slider-runnable-track { background: var(--color-gray-700); }
         input[type="range"]::-moz-range-track { background: var(--color-gray-700); }
         input[type="range"]::-webkit-slider-thumb { background: var(--color-interactive); }
         input[type="range"]::-moz-range-thumb { background: var(--color-interactive); }
    }
</style>

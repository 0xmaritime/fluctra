<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import Input from '$lib/components/Input.svelte';
  import Select from '$lib/components/Select.svelte';
  import { discountFormData, type TokenInfo } from '../formStore';
  import { derived } from 'svelte/store';

  // Distribution strategy options
  const strategyOptions = [
    { value: 'standard', label: 'Standard (First-come, first-served)' },
    { value: 'tiered', label: 'Tiered (AI Optimized Schedule)' },
    { value: 'whitelist', label: 'Whitelist Only (Requires Setup)' }
  ];

  // Reactive calculations for display
  const calculatedValues = derived(discountFormData, ($data) => {
    const discountRateNum = parseFloat($data.discountRate) || 0;
    const maxSaleAmountNum = parseFloat($data.maxSaleAmount) || 0;
    const marketPrice = $data.tokenInfo?.marketPrice || 0.05; // Example placeholder
    const discountedPrice = marketPrice * (1 - discountRateNum / 100);
    const estimatedValue = discountedPrice * maxSaleAmountNum;
    return { discountedPrice, estimatedValue };
  });

  // Format numbers for display
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(amount);
  }

  // Example: Fetch market price based on token address/chain (placeholder)
  $: {
      if ($discountFormData.tokenAddress && $discountFormData.blockchain) {
          setTimeout(() => {
              discountFormData.update(data => ({
                  ...data,
                  tokenInfo: { ...data.tokenInfo, marketPrice: 0.05 } // Example price
              }));
          }, 500);
      }
  }

</script>

<Card>
  <h2 class="text-xl font-semibold text-[var(--color-foreground)] mb-3">Discount Strategy</h2> <!-- Standardized utility -->

  <div class="space-y-3"> <!-- Standardized utility -->
    <div>
      <Input
        type="number"
        label="Discount Rate (%)"
        bind:value={$discountFormData.discountRate}
        required
        min="1"
        max="90"
        helpText="Set the percentage discount off the current market price. AI Suggestion: 25-35% based on volatility."
      />
    </div>

    <div>
      <Input
        type="number"
        label="Sale Duration (Days)"
        bind:value={$discountFormData.duration}
        required
        min="1"
        max="30"
        helpText="How long the discount pool will remain active. AI Suggestion: 3-7 days for optimal momentum."
      />
    </div>

    <div>
      <Input
        type="number"
        label="Maximum Sale Amount (Total Tokens)"
        bind:value={$discountFormData.maxSaleAmount}
        required
        min="1"
        helpText={`Value at current market price (discounted): ~${formatCurrency($calculatedValues.estimatedValue)} USD. This is the total number of your tokens available in the pool.`}
      />
      {#if $discountFormData.tokenInfo.marketPrice === 0 && $discountFormData.tokenAddress}
         <p class="mt-1 text-sm text-[var(--color-warning-700)]">Fetching market price...</p>
      {/if}
    </div>

    <div>
      <Select
        label="Distribution Strategy"
        options={strategyOptions}
        bind:value={$discountFormData.distributionStrategy}
        required
        helpText="Choose how tokens are sold. Tiered strategy recommended for attracting quality holders."
      />
    </div>
  </div>
</Card>

<!-- Navigation buttons are handled by the parent layout -->

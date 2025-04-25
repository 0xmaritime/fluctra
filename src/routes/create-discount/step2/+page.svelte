<script lang="ts">
  import { goto } from '$app/navigation'
  import Card from '../../../components/Card.svelte'
  import Button from '../../../components/Button.svelte'
  import Input from '../../../components/Input.svelte'
  import Select from '../../../components/Select.svelte'
  import { discountFormData } from '../formStore'
  
  // Distribution strategy options
  const strategyOptions = [
    { value: 'standard', label: 'Standard (First-come, first-served)' },
    { value: 'tiered', label: 'Tiered (AI Optimized)' },
    { value: 'whitelist', label: 'Whitelist Only' }
  ]
  
  // Convert string inputs to numbers for calculations
  $: discountRateNum = typeof $discountFormData.discountRate === 'string' 
    ? parseFloat($discountFormData.discountRate) || 0 
    : $discountFormData.discountRate
    
  $: maxSaleAmountNum = typeof $discountFormData.maxSaleAmount === 'string'
    ? parseFloat($discountFormData.maxSaleAmount) || 0
    : $discountFormData.maxSaleAmount

  // Derived values
  $: discountedPrice = $discountFormData.tokenInfo.marketPrice * (1 - discountRateNum / 100)
  $: estimatedValue = discountedPrice * maxSaleAmountNum
  
  // Format numbers for display
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }
</script>

<Card>
  <h2 class="text-xl font-semibold text-neutral-900 mb-6">Discount Strategy</h2>
  
  <div class="space-y-6">
    <div>
      <Input
        type="number"
        label="Discount Rate (%)"
        bind:value={$discountFormData.discountRate}
        required
        helpText="AI Recommended: 25-35% based on market volatility (1-90%)"
      />
    </div>
    
    <div>
      <Input
        type="number"
        label="Sale Duration (Days)"
        bind:value={$discountFormData.duration}
        required
        helpText="AI Recommended: 3-7 days for optimal momentum (1-30 days)"
      />
    </div>
    
    <div>
      <Input
        type="number"
        label="Maximum Sale Amount (Tokens)"
        bind:value={$discountFormData.maxSaleAmount}
        required
        helpText={`Estimated Value: ${formatCurrency(estimatedValue)} USD at discounted price (Minimum 1 token)`}
      />
    </div>
    
    <div>
      <Select
        label="Distribution Strategy"
        options={strategyOptions}
        bind:value={$discountFormData.distributionStrategy}
        required
        helpText="Tiered strategy recommended for attracting quality holders"
      />
    </div>
  </div>
  
  <div class="flex justify-between mt-8">
    <Button variant="ghost" on:click={() => goto('/create-discount/step1')}>
      Back
    </Button>
    <Button on:click={() => goto('/create-discount/step3')}>
      Continue to Review
    </Button>
  </div>
</Card>

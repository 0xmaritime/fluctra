<script lang="ts">
  import { goto } from '$app/navigation'
  import Card from '../../../components/Card.svelte'
  import Button from '../../../components/Button.svelte'
  import Badge from '../../../components/Badge.svelte'
  import { discountFormData } from '../formStore'
  
  // Format numbers for display
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }
  
  // Calculate derived values
  $: discountedPrice = $discountFormData.tokenInfo.marketPrice * (1 - parseFloat($discountFormData.discountRate) / 100)
  $: totalValue = discountedPrice * parseFloat($discountFormData.maxSaleAmount)
</script>

<Card>
  <h2 class="text-xl font-semibold text-neutral-900 mb-6">Review & Deploy</h2>
  
  <div class="space-y-6">
    <div>
      <h3 class="font-medium text-neutral-900 mb-2">Token Details</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-neutral-500">Token Name</p>
          <p class="font-medium">{$discountFormData.tokenInfo.name}</p>
        </div>
        <div>
          <p class="text-sm text-neutral-500">Token Symbol</p>
          <p class="font-medium">{$discountFormData.tokenInfo.symbol}</p>
        </div>
        <div>
          <p class="text-sm text-neutral-500">Blockchain</p>
          <p class="font-medium">{$discountFormData.blockchain}</p>
        </div>
        <div>
          <p class="text-sm text-neutral-500">Contract Address</p>
          <p class="font-mono text-sm">{$discountFormData.tokenAddress}</p>
        </div>
      </div>
    </div>
    
    <div>
      <h3 class="font-medium text-neutral-900 mb-2">Discount Details</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p class="text-sm text-neutral-500">Discount Rate</p>
          <div class="flex items-center">
            <p class="font-medium">{$discountFormData.discountRate}%</p>
            <div class="ml-2">
              <Badge variant="primary">AI Optimized</Badge>
            </div>
          </div>
        </div>
        <div>
          <p class="text-sm text-neutral-500">Duration</p>
          <p class="font-medium">{$discountFormData.duration} days</p>
        </div>
        <div>
          <p class="text-sm text-neutral-500">Max Sale Amount</p>
          <p class="font-medium">{$discountFormData.maxSaleAmount} tokens</p>
        </div>
        <div>
          <p class="text-sm text-neutral-500">Discounted Price</p>
          <p class="font-medium">{formatCurrency(discountedPrice)}</p>
        </div>
        <div>
          <p class="text-sm text-neutral-500">Total Value</p>
          <p class="font-medium">{formatCurrency(totalValue)}</p>
        </div>
        <div>
          <p class="text-sm text-neutral-500">Strategy</p>
          <p class="font-medium">{$discountFormData.distributionStrategy}</p>
        </div>
      </div>
    </div>
    
    <div class="pt-4 border-t border-neutral-200">
      <div class="flex items-start">
        <input 
          type="checkbox" 
          id="confirm-verified" 
          bind:checked={$discountFormData.verified}
          class="mt-1 mr-2"
        />
        <label for="confirm-verified" class="text-sm text-neutral-700">
          I confirm that all token information is accurate and I have verified the contract address
        </label>
      </div>
    </div>
  </div>
  
  <div class="flex justify-between mt-8">
    <Button variant="ghost" on:click={() => goto('/create-discount/step2')}>
      Back
    </Button>
    <Button 
      on:click={() => alert('Pool deployed successfully!')}
      disabled={!$discountFormData.verified}
    >
      Deploy Discount Pool
    </Button>
  </div>
</Card>

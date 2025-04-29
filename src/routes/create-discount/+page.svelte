<script lang="ts">
  import { goto } from '$app/navigation';
  import Card from '$lib/components/Card.svelte';
  import Button from '$lib/components/Button.svelte';
  import Input from '$lib/components/Input.svelte';
  import Select from '$lib/components/Select.svelte';
  import { discountFormData } from './formStore';
  import { derived } from 'svelte/store';

  // Blockchain options
  const blockchainOptions = [
    { value: 'ethereum', label: 'Ethereum' },
    { value: 'solana', label: 'Solana' },
    { value: 'bnb', label: 'BNB Chain' },
    { value: 'base', label: 'Base' }
  ];

  // Distribution strategy options
  const strategyOptions = [
    { value: 'standard', label: 'Standard (First-come, first-served)' },
    { value: 'tiered', label: 'Tiered (AI Optimized Schedule)' },
    { value: 'whitelist', label: 'Whitelist Only (Requires Setup)' }
  ];

  // Reactive calculations
  const calculatedValues = derived(discountFormData, ($data) => {
    const discountRateNum = parseFloat($data.discountRate) || 0;
    const maxSaleAmountNum = parseFloat($data.maxSaleAmount) || 0;
    const marketPrice = $data.tokenInfo?.marketPrice || 0;
    const discountedPrice = marketPrice > 0 ? marketPrice * (1 - discountRateNum / 100) : 0;
    const totalValue = discountedPrice * maxSaleAmountNum;
    return { discountedPrice, totalValue, marketPrice };
  });

  // Format currency
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: amount < 1 ? 6 : 2
    }).format(amount);
  }

  // Deployment function
  let isDeploying = false;
  async function deployPool() {
    if (!$discountFormData.verified || isDeploying) return;

    isDeploying = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Pool deployed successfully!');
      goto('/dashboard');
    } catch (error) {
      console.error("Deployment failed:", error);
      alert('Deployment failed. Please check console for details.');
    } finally {
      isDeploying = false;
    }
  }
</script>

<Card>
  <h2 class="text-xl font-semibold text-[var(--color-foreground)] mb-6">Create Discount Pool</h2>

  <div class="space-y-6">
    <!-- Token Selection Section -->
    <div>
      <h3 class="font-medium text-[var(--color-text-primary)] mb-3">Token Details</h3>
      <div class="space-y-3">
        <Select
          label="Blockchain Network"
          options={blockchainOptions}
          bind:value={$discountFormData.blockchain}
          placeholder="Select Network"
          required
        />

        <Input
          label="Token Contract Address"
          placeholder="0x..."
          bind:value={$discountFormData.tokenAddress}
          required
          helpText="Enter the verified contract address of the token you want to discount."
        />

        <Input
          label="Token Name (Auto-fetched if possible)"
          placeholder="My Awesome Token"
          bind:value={$discountFormData.tokenInfo.name}
          required
        />

        <Input
          label="Token Symbol (Auto-fetched if possible)"
          placeholder="MAT"
          bind:value={$discountFormData.tokenInfo.symbol}
          required
        />
      </div>
    </div>

    <!-- Discount Parameters Section -->
    <div>
      <h3 class="font-medium text-[var(--color-text-primary)] mb-3">Discount Parameters</h3>
      <div class="space-y-3">
        <Input
          type="number"
          label="Discount Rate (%)"
          bind:value={$discountFormData.discountRate}
          required
          min="1"
          max="90"
          helpText="Set the percentage discount off the current market price."
        />

        <Input
          type="number"
          label="Sale Duration (Days)"
          bind:value={$discountFormData.duration}
          required
          min="1"
          max="30"
        />

        <Input
          type="number"
          label="Maximum Sale Amount (Total Tokens)"
          bind:value={$discountFormData.maxSaleAmount}
          required
          min="1"
        />

        <Select
          label="Distribution Strategy"
          options={strategyOptions}
          bind:value={$discountFormData.distributionStrategy}
          required
        />
      </div>
    </div>

    <!-- Review Section -->
    <div>
      <h3 class="font-medium text-[var(--color-text-primary)] mb-3">Summary</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-[var(--color-text-secondary)]">Token</p>
          <p class="font-medium text-[var(--color-text-primary)]">
            {$discountFormData.tokenInfo.name} ({$discountFormData.tokenInfo.symbol})
          </p>
        </div>
        <div>
          <p class="text-sm text-[var(--color-text-secondary)]">Network</p>
          <p class="font-medium text-[var(--color-text-primary)] capitalize">
            {$discountFormData.blockchain}
          </p>
        </div>
        <div>
          <p class="text-sm text-[var(--color-text-secondary)]">Discounted Price</p>
          <p class="font-medium text-[var(--color-text-primary)]">
            {#if $calculatedValues.discountedPrice > 0}
              {formatCurrency($calculatedValues.discountedPrice)}
            {:else}
              <span class="text-[var(--color-text-secondary)] italic">Requires Market Price</span>
            {/if}
          </p>
        </div>
        <div>
          <p class="text-sm text-[var(--color-text-secondary)]">Total Pool Value</p>
          <p class="font-medium text-[var(--color-text-primary)]">
            {#if $calculatedValues.totalValue > 0}
              {formatCurrency($calculatedValues.totalValue)}
            {:else}
              <span class="text-[var(--color-text-secondary)] italic">Requires Market Price</span>
            {/if}
          </p>
        </div>
      </div>
    </div>

    <!-- Confirmation and Deployment -->
    <div class="pt-4 border-t border-[var(--color-border-default)]">
      <div class="flex items-start">
        <input
          type="checkbox"
          id="confirm-verified"
          bind:checked={$discountFormData.verified}
          class="mt-1 mr-2 h-4 w-4 rounded border-[var(--color-border-default)] text-[var(--color-interactive)] focus:ring-[var(--color-interactive)]"
          disabled={isDeploying}
        />
        <label for="confirm-verified" class="text-sm text-[var(--color-text-secondary)]">
          I confirm that all information is accurate and understand the associated gas fees.
        </label>
      </div>
    </div>

    <div class="flex justify-end">
      <Button
        on:click={deployPool}
        disabled={!$discountFormData.verified || isDeploying || $calculatedValues.marketPrice <= 0}
      >
        {#if isDeploying}
          Deploying...
        {:else}
          Deploy Discount Pool
        {/if}
      </Button>
    </div>
  </div>
</Card>

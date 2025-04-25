<script lang="ts">
  import { goto } from '$app/navigation';
  import Card from '$lib/components/Card.svelte';
  import Button from '$lib/components/Button.svelte';
  import Badge from '$lib/components/Badge.svelte';
  import { discountFormData } from '../formStore';
  import { derived } from 'svelte/store';

  let isDeploying = false; // State for deployment process

  // Reactive calculations for display
  const calculatedValues = derived(discountFormData, ($data) => {
    const discountRateNum = parseFloat($data.discountRate) || 0;
    const maxSaleAmountNum = parseFloat($data.maxSaleAmount) || 0;
    const marketPrice = $data.tokenInfo?.marketPrice || 0; // Use fetched price
    const discountedPrice = marketPrice > 0 ? marketPrice * (1 - discountRateNum / 100) : 0;
    const totalValue = discountedPrice * maxSaleAmountNum;
    return { discountedPrice, totalValue, marketPrice };
  });

  // Format numbers for display
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: amount < 1 ? 6 : 2 // More precision for low values
    }).format(amount);
  }

  // Function to handle pool deployment (example)
  async function deployPool() {
    if (!$discountFormData.verified || isDeploying) return;

    isDeploying = true;
    console.log("Deploying pool with data:", $discountFormData);

    try {
      // --- ACTUAL DEPLOYMENT LOGIC WOULD GO HERE ---
      // 1. Interact with Wallet (e.g., ethers.js signer)
      // 2. Call smart contract factory function
      // 3. Send transaction to create the pool contract
      // 4. Transfer tokens to the new pool contract (if applicable)
      // 5. Wait for transaction confirmation
      // Example simulation:
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      // --- END OF ACTUAL DEPLOYMENT LOGIC ---

      alert('Pool deployed successfully!'); // Replace with better notification
      // Consider resetting the form store after successful deployment
      // discountFormData.set({ /* initial state */ });
      goto('/dashboard'); // Redirect to dashboard or pool management page
    } catch (error) {
      console.error("Deployment failed:", error);
      alert('Deployment failed. Please check console for details.'); // Replace with better error handling
    } finally {
      isDeploying = false;
    }
  }

</script>

<Card>
  <h2 class="text-xl font-semibold text-[var(--color-foreground)] mb-[calc(var(--spacing)*3)]">Review & Deploy</h2> <!-- mb-6 -> 24px -->

  <div class="space-y-[calc(var(--spacing)*3)]"> <!-- space-y-6 -> 24px -->
    <div>
      <h3 class="font-medium text-[var(--color-text-primary)] mb-2">Token Details</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-[calc(var(--spacing)*2)]"> <!-- gap-4 -> 16px -->
        <div>
          <p class="text-sm text-[var(--color-text-secondary)]">Token Name</p>
          <p class="font-medium text-[var(--color-text-primary)]">{$discountFormData.tokenInfo.name || '-'}</p>
        </div>
        <div>
          <p class="text-sm text-[var(--color-text-secondary)]">Token Symbol</p>
          <p class="font-medium text-[var(--color-text-primary)]">{$discountFormData.tokenInfo.symbol || '-'}</p>
        </div>
        <div>
          <p class="text-sm text-[var(--color-text-secondary)]">Blockchain</p>
          <p class="font-medium text-[var(--color-text-primary)] capitalize">{$discountFormData.blockchain || '-'}</p>
        </div>
        <div>
          <p class="text-sm text-[var(--color-text-secondary)]">Contract Address</p>
          <p class="font-mono text-sm text-[var(--color-text-primary)] break-all">{$discountFormData.tokenAddress || '-'}</p>
        </div>
         <div>
          <p class="text-sm text-[var(--color-text-secondary)]">Current Market Price</p>
          <p class="font-medium text-[var(--color-text-primary)]">
            {#if $calculatedValues.marketPrice > 0}
              {formatCurrency($calculatedValues.marketPrice)}
            {:else}
              <span class="text-[var(--color-text-secondary)] italic">Not available</span>
            {/if}
          </p>
        </div>
      </div>
    </div>

    <div>
      <h3 class="font-medium text-[var(--color-text-primary)] mb-2">Discount Details</h3>
       <div class="grid grid-cols-1 md:grid-cols-3 gap-[calc(var(--spacing)*2)]"> <!-- gap-4 -> 16px -->
        <div>
          <p class="text-sm text-[var(--color-text-secondary)]">Discount Rate</p>
          <div class="flex items-center">
            <p class="font-medium text-[var(--color-text-primary)]">{$discountFormData.discountRate}%</p>
            <!-- Optional: Add badge if AI suggestion was used -->
            <!-- <div class="ml-2"><Badge variant="primary">AI Optimized</Badge></div> -->
          </div>
        </div>
        <div>
          <p class="text-sm text-[var(--color-text-secondary)]">Duration</p>
          <p class="font-medium text-[var(--color-text-primary)]">{$discountFormData.duration} days</p>
        </div>
        <div>
          <p class="text-sm text-[var(--color-text-secondary)]">Max Tokens for Sale</p>
          <p class="font-medium text-[var(--color-text-primary)]">{parseFloat($discountFormData.maxSaleAmount).toLocaleString() || '-'}</p>
        </div>
        <div>
          <p class="text-sm text-[var(--color-text-secondary)]">Price per Token (Discounted)</p>
          <p class="font-medium text-[var(--color-text-primary)]">
            {#if $calculatedValues.discountedPrice > 0}
              {formatCurrency($calculatedValues.discountedPrice)}
            {:else}
               <span class="text-[var(--color-text-secondary)] italic">Requires Market Price</span>
            {/if}
          </p>
        </div>
        <div>
          <p class="text-sm text-[var(--color-text-secondary)]">Est. Total Pool Value</p>
          <p class="font-medium text-[var(--color-text-primary)]">
             {#if $calculatedValues.totalValue > 0}
              {formatCurrency($calculatedValues.totalValue)}
             {:else}
                <span class="text-[var(--color-text-secondary)] italic">Requires Market Price</span>
             {/if}
          </p>
        </div>
        <div>
          <p class="text-sm text-[var(--color-text-secondary)]">Strategy</p>
          <p class="font-medium text-[var(--color-text-primary)] capitalize">{$discountFormData.distributionStrategy || '-'}</p>
        </div>
      </div>
    </div>

    <div class="pt-[calc(var(--spacing)*2)] border-t border-[var(--color-border-default)]"> <!-- pt-4 -> 16px -->
      <div class="flex items-start">
        <!-- Use styled checkbox -->
        <input
          type="checkbox"
          id="confirm-verified"
          bind:checked={$discountFormData.verified}
          class="mt-1 mr-2 h-4 w-4 rounded border-[var(--color-border-default)] text-[var(--color-interactive)] focus:ring-[var(--color-interactive)]"
          disabled={isDeploying}
        />
        <label for="confirm-verified" class="text-sm text-[var(--color-text-secondary)]">
          I confirm that all information is accurate, I have verified the contract address, and understand the associated gas fees for deployment.
        </label>
      </div>
      {#if !$discountFormData.verified}
        <p class="mt-1 text-xs text-[var(--color-error-500)]">Confirmation required to deploy.</p>
      {/if}
    </div>
  </div>

  <!-- Deployment button within the step content -->
  <div class="flex justify-end mt-[calc(var(--spacing)*4)]"> <!-- mt-8 -> 32px -->
      <Button
          on:click={deployPool}
          disabled={!$discountFormData.verified || isDeploying || $calculatedValues.marketPrice <= 0}
          title={$calculatedValues.marketPrice <= 0 ? 'Market price must be available to deploy' : !$discountFormData.verified ? 'Please confirm details above' : ''}
      >
          {#if isDeploying}
              Deploying... <!-- Add spinner icon later -->
          {:else}
              Deploy Discount Pool
          {/if}
      </Button>
  </div>
</Card>

<!-- Back button remains in parent layout -->

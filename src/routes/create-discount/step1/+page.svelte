<script lang="ts">
  import Card from '$lib/components/Card.svelte';
  import Input from '$lib/components/Input.svelte';
  import Select from '$lib/components/Select.svelte';
  import { discountFormData } from '../formStore';

  // Blockchain options for select
  const blockchainOptions = [
    { value: 'ethereum', label: 'Ethereum' },
    { value: 'solana', label: 'Solana' },
    { value: 'bnb', label: 'BNB Chain' },
    { value: 'base', label: 'Base' }
  ];
</script>

<Card>
  <h2 class="text-xl font-semibold text-[var(--color-foreground)] mb-3">Token Selection</h2> <!-- Standardized utility -->

  <div class="space-y-2"> <!-- Standardized utility -->
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
</Card>

<!-- Navigation is handled by the parent +page.svelte -->

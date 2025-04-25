<script lang="ts">
  import Card from '../../../components/Card.svelte';
  import Input from '../../../components/Input.svelte';
  import Select from '../../../components/Select.svelte';
  import { discountFormData } from '../formStore';

  // Blockchain options for select
  const blockchainOptions = [
    { value: 'ethereum', label: 'Ethereum' },
    { value: 'solana', label: 'Solana' },
    { value: 'bnb', label: 'BNB Chain' }, // Added BNB Chain
    { value: 'base', label: 'Base' }
    // Removed Polygon as it wasn't in original list and might be less relevant
  ];
</script>

<Card>
  <h2 class="text-xl font-semibold text-[var(--color-foreground)] mb-[calc(var(--spacing)*3)]">Token Selection</h2> <!-- mb-6 -> 24px -->

  <div class="space-y-[calc(var(--spacing)*2)]"> <!-- space-y-4 -> 16px -->
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

    <!-- Token Info might be fetched based on address, but keeping manual input for now -->
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
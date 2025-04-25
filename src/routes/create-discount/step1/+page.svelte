<script lang="ts">
  import Card from '../../../components/Card.svelte'
  import Input from '../../../components/Input.svelte'
  import Select from '../../../components/Select.svelte'
  import { discountFormData } from '../formStore'
  
  // Blockchain options for select
  const blockchainOptions = [
    { value: 'ethereum', label: 'Ethereum' },
    { value: 'solana', label: 'Solana' },
    { value: 'polygon', label: 'Polygon' },
    { value: 'base', label: 'Base' }
  ]
</script>

<Card>
  <h2 class="text-xl font-semibold text-neutral-900 mb-6">Token Selection</h2>
  
  <div class="space-y-4">
    <Select
      label="Blockchain Network"
      options={blockchainOptions}
      bind:value={$discountFormData.blockchain}
    />
    
    <Input
      label="Token Contract Address"
      placeholder="0x..."
      bind:value={$discountFormData.tokenAddress}
    />
    
    <Input
      label="Token Name"
      placeholder="My Token"
      bind:value={$discountFormData.tokenInfo.name}
    />
    
    <Input
      label="Token Symbol"
      placeholder="MTK"
      bind:value={$discountFormData.tokenInfo.symbol}
    />
  </div>
</Card>

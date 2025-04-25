<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import { cubicOut } from 'svelte/easing'
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'
  
  export let isConnected: boolean = false
  export let walletAddress: string = ''
  export let onToggle: () => void = () => {}
  
  let isDropdownOpen = false
  
  // Simulated wallet connection options
  const chains = [
    { id: 'ethereum', name: 'Ethereum', icon: '📟' },
    { id: 'solana', name: 'Solana', icon: '🌞' },
    { id: 'bnb', name: 'BNB Chain', icon: '🔶' },
    { id: 'base', name: 'Base', icon: '🔷' }
  ]
  
  // Format wallet address for display
  function formatAddress(address: string): string {
    return address.length > 10 
      ? `${address.slice(0, 6)}...${address.slice(-4)}` 
      : address
  }
  
  // Close dropdown when clicking outside
  function handleClickOutside(event: MouseEvent) {
    if (!browser) return;
    const dropdown = document.getElementById('wallet-dropdown');
    if (isDropdownOpen && dropdown && !event.composedPath().includes(dropdown)) {
      isDropdownOpen = false
    }
  }
  
  // Setup click listener when component mounts
  onMount(() => {
    if (!browser) return;
    
    const handleClick = (event: MouseEvent) => {
      handleClickOutside(event);
    };
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
</script>

<svelte:window on:click|self={() => isDropdownOpen = false} />

<div class="relative" id="wallet-dropdown">
  {#if isConnected}
    <div>
      <button
        on:click={() => isDropdownOpen = !isDropdownOpen}
        class="flex items-center px-3 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        <span class="mr-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
            <rect x="2" y="6" width="20" height="12" rx="2"></rect>
            <path d="M22 10c-2.667 0-5.333 0-8 0"></path>
          </svg>
        </span>
        <span>{formatAddress(walletAddress)}</span>
        <span class="ml-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
          </svg>
        </span>
      </button>
    </div>
  {:else}
    <button
      on:click={() => isDropdownOpen = !isDropdownOpen}
      class="flex items-center px-3 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      <span class="mr-1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
          <rect x="2" y="6" width="20" height="12" rx="2"></rect>
          <path d="M22 10c-2.667 0-5.333 0-8 0"></path>
        </svg>
      </span>
      <span>Connect Wallet</span>
    </button>
  {/if}
  
  {#if isDropdownOpen}
    <div
      transition:fly={{ y: 8, duration: 200, easing: cubicOut }}
      class="absolute right-0 mt-2 w-60 rounded-xl glass shadow-lg z-50 overflow-hidden border border-neutral-100"
    >
      <div class="p-3">
        <div class="text-sm font-medium text-neutral-900 mb-1">Connect with</div>
        <div class="space-y-1">
          {#each chains as chain}
            <button
              on:click={() => {
                onToggle()
                isDropdownOpen = false
              }}
              class="w-full flex items-center px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
            >
              <span class="mr-2">{chain.icon}</span>
              <span>{chain.name}</span>
            </button>
          {/each}
        </div>
        
        {#if isConnected}
          <div class="mt-3 pt-3 border-t border-neutral-200">
            <button
              on:click={() => {
                onToggle()
                isDropdownOpen = false
              }}
              class="w-full flex items-center px-3 py-2 text-sm text-error-600 hover:bg-error-50 rounded-lg transition-colors duration-200"
            >
              <span class="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                  <path fill-rule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 019.75 18h-5.5A2.25 2.25 0 012 15.75V4.25z" clip-rule="evenodd" />
                  <path fill-rule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" clip-rule="evenodd" />
                </svg>
              </span>
              <span>Disconnect</span>
            </button>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import Button from './Button.svelte'; // Import the Button component

  export let isConnected: boolean = false;
  export let walletAddress: string = '';
  export let onToggle: () => void = () => {}; // Prop for the callback

  let isDropdownOpen = false;

  // Simulated wallet connection options
  const chains = [
    { id: 'ethereum', name: 'Ethereum', icon: '📟' },
    { id: 'solana', name: 'Solana', icon: '🌞' },
    { id: 'bnb', name: 'BNB Chain', icon: '🔶' },
    { id: 'base', name: 'Base', icon: '🔷' }
  ];

  // Format wallet address for display
  function formatAddress(address: string): string {
    return address.length > 10
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : address;
  }

  // Close dropdown when clicking outside
  function handleClickOutside(event: MouseEvent) {
    if (!browser) return;
    const dropdown = document.getElementById('wallet-dropdown');
    if (isDropdownOpen && dropdown && !event.composedPath().includes(dropdown)) {
      isDropdownOpen = false;
    }
  }

  // Attach listener on mount, remove on destroy
  onMount(() => {
    if (browser) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      if (browser) {
        document.removeEventListener('click', handleClickOutside);
      }
    };
  });
</script>

<!-- Removed svelte:window listener, using document listener in onMount for better control -->

<div class="relative" id="wallet-dropdown">
  {#if isConnected}
    <!-- Use the Button component for consistency -->
    <Button
      variant="primary"
      size="md"
      on:click={() => isDropdownOpen = !isDropdownOpen}
      className="flex items-center"
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
    </Button>
  {:else}
    <Button
      variant="primary"
      size="md"
      on:click={() => isDropdownOpen = !isDropdownOpen}
      className="flex items-center"
    >
       <span class="mr-1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
          <rect x="2" y="6" width="20" height="12" rx="2"></rect>
          <path d="M22 10c-2.667 0-5.333 0-8 0"></path>
        </svg>
      </span>
      <span>Connect Wallet</span>
    </Button>
  {/if}

  {#if isDropdownOpen}
    <div
      transition:fly={{ y: 8, duration: 200, easing: cubicOut }}
      class="absolute right-0 mt-2 w-60 rounded-xl glass shadow-xl z-50 overflow-hidden border border-[var(--color-border-subtle)]"
      ><!-- Applied .glass, --radius-xl, Meridian shadow-xl -->
      <div class="p-[var(--spacing)]"> <!-- p-1 = 4px, adjusted from p-3 -->
        <div class="text-sm font-medium text-[var(--color-text-primary)] mb-1">Connect with</div>
        <div class="space-y-1">
          {#each chains as chain}
            <button
              on:click={() => {
                onToggle(); // Call the passed callback
                isDropdownOpen = false;
              }}
              class="w-full flex items-center px-3 py-2 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-gray-100)] dark:hover:bg-[var(--color-gray-800)] rounded-lg transition-colors duration-200"
              ><!-- Use correct hover colors -->
              <span class="mr-2">{chain.icon}</span>
              <span>{chain.name}</span>
            </button>
          {/each}
        </div>

        {#if isConnected}
          <div class="mt-[calc(var(--spacing)*1.5)] pt-[calc(var(--spacing)*1.5)] border-t border-[var(--color-border-default)]"> <!-- mt-3/pt-3 = 12px -->
            <button
              on:click={() => {
                onToggle(); // Call the passed callback
                isDropdownOpen = false;
              }}
              class="w-full flex items-center px-3 py-2 text-sm text-[var(--color-error-500)] hover:bg-[var(--color-error-100)] dark:hover:bg-[oklch(var(--color-error-700)/0.3)] rounded-lg transition-colors duration-200"
              ><!-- Use correct error/hover colors -->
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
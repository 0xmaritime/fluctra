<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import Button from '$lib/components/Button.svelte';

  export let isConnected: boolean = false;
  export let walletAddress: string = '';
  // FIX: Rename prop from onToggle to handleToggle
  export let handleToggle: () => void = () => {};
  export let className: string = '';

  let isDropdownOpen = false;

  const chains = [
    { id: 'solana', name: 'Solana', icon: '🌞' },
    { id: 'ethereum', name: 'Ethereum (coming soon)', icon: '📟', disabled: true },
    { id: 'bnb', name: 'BNB Chain (coming soon)', icon: '🔶', disabled: true },
    { id: 'base', name: 'Base (coming soon)', icon: '🔷', disabled: true }
  ];

  function formatAddress(address: string): string {
    return address.length > 10
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : address;
  }

  function handleClickOutside(event: MouseEvent) {
    if (!browser) return;
    const dropdown = document.getElementById('wallet-dropdown');
    if (isDropdownOpen && dropdown && !event.composedPath().includes(dropdown)) {
      isDropdownOpen = false;
    }
  }

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

<div class="relative" id="wallet-dropdown">
  {#if isConnected}
    <Button
      variant="primary"
      size="md"
      on:click={() => isDropdownOpen = !isDropdownOpen}
      className={`flex items-center truncate max-w-[120px] md:max-w-none ${className}`}
    >
      <span class="mr-[calc(var(--spacing)/2)]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--color-interactive-text)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect x="2" y="6" width="20" height="12" rx="2"></rect><path d="M22 10c-2.667 0-5.333 0-8 0"></path></svg>
      </span>
      <span>{formatAddress(walletAddress)}</span>
      <span class="ml-[calc(var(--spacing))]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="var(--color-interactive-text)" class="w-5 h-5"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" /></svg>
      </span>
    </Button>
  {:else}
    <Button
      variant="primary"
      size="md"
      on:click={() => isDropdownOpen = !isDropdownOpen}
      className={`flex items-center ${className}`}
    >
       <span class="mr-[calc(var(--spacing)/2)]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--color-interactive-text)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4"><rect x="2" y="6" width="20" height="12" rx="2"></rect><path d="M22 10c-2.667 0-5.333 0-8 0"></path></svg>
      </span>
      <span>Connect Wallet</span>
    </Button>
  {/if}

  {#if isDropdownOpen}
    <div
      transition:fly={{ y: 8, duration: 200, easing: cubicOut }}
      class="absolute right-0 mx-[calc(var(--spacing)*2)] mt-[calc(var(--spacing))] rounded-xl glass shadow-xl z-50 overflow-hidden border border-[var(--color-border-subtle)] md:mx-0 md:w-60"
    >
      <div class="p-[calc(var(--spacing))]">
        <!-- Removed "Connect with" label -->
        <!-- <div class="text-[length:var(--text-sm)] font-medium text-[var(--color-text-primary)] mb-[calc(var(--spacing)/2)]">Connect with</div> -->
        <div class="space-y-1">
          {#each chains as chain}
            <button
              on:click={() => {
                if (!chain.disabled) {
                  handleToggle(); // FIX: Call renamed prop
                  isDropdownOpen = false;
                }
              }}
              class="w-full flex items-center px-3 py-2 text-[length:var(--text-sm)] rounded-lg transition-colors duration-[var(--duration-normal)] ease-[var(--ease-out-expo)]"
              class:opacity-50={chain.disabled}
              class:cursor-not-allowed={chain.disabled}
              class:text-[var(--color-text-primary)]={!chain.disabled}
              class:text-[var(--color-text-subtle)]={chain.disabled}
              class:hover:bg-[var(--color-background-emphasis)]={!chain.disabled}
              >
              <span class="mr-[calc(var(--spacing))]">{chain.icon}</span>
              <span>{chain.name}</span>
            </button>
          {/each}
        </div>

        {#if isConnected}
          <div class="mt-[calc(var(--spacing))] pt-[calc(var(--spacing))] border-t border-[var(--color-border-default)]">
            <button
              on:click={() => {
                handleToggle(); // FIX: Call renamed prop
                isDropdownOpen = false;
              }}
              class="w-full flex items-center px-3 py-2 text-[length:var(--text-sm)] text-[var(--color-error-500)] hover:bg-[var(--color-error-100)] rounded-lg transition-colors duration-[var(--duration-normal)] ease-[var(--ease-out-expo)]"
              >
              <span class="mr-[calc(var(--spacing))]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="var(--color-error-500)" class="w-4 h-4"><path fill-rule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 019.75 18h-5.5A2.25 2.25 0 012 15.75V4.25z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M19 10a.75.75 0 00-.75-.75H8.704l1.048-.943a.75.75 0 10-1.004-1.114l-2.5 2.25a.75.75 0 000 1.114l2.5 2.25a.75.75 0 101.004-1.114l-1.048-.943h9.546A.75.75 0 0019 10z" clip-rule="evenodd" /></svg>
              </span>
              <span>Disconnect</span>
            </button>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

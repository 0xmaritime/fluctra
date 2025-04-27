<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import NavLink from '$lib/components/NavLink.svelte';
  import WalletConnect from '$lib/components/WalletConnect.svelte';
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';

  let isMenuOpen = false;
  let isConnected = false;
  let walletAddress = '0x1234...5678';

  $: { if ($page.url) { isMenuOpen = false; } }
  $: showAppNav = $page.url.pathname !== '/' && isConnected;

  function toggleConnection() {
    isConnected = !isConnected;
    if (isConnected && $page.url.pathname === '/') {
      goto('/dashboard');
    }
  }

  onMount(() => {});
</script>

<div class="min-h-screen flex flex-col bg-[var(--color-background)]">
  <header class="sticky top-0 z-50">
    <div class="relative">
      <div class="glass border-b border-[var(--color-border-subtle)] shadow-sm">
        <div class="app-container">
          <div class="flex items-center justify-between py-1">
            <div class="flex items-center shrink-0">
              <button on:click={() => goto('/')} class="flex items-center space-x-2 focus:outline-none">
                <svg width="32" height="32" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8">
                  <g transform="translate(8, 12)">
                    <rect x="4" y="10" width="12" height="30" fill="#0057b7" />
                    <rect x="18" y="10" width="8" height="30" fill="#0057b7" opacity="0.7" />
                    <rect x="28" y="10" width="6" height="30" fill="#0057b7" opacity="0.5" />
                    <rect x="36" y="10" width="4" height="30" fill="#0057b7" opacity="0.3" />
                    <rect x="42" y="10" width="2" height="30" fill="#0057b7" opacity="0.15" />
                  </g>
                </svg>
                <span class="text-xl font-semibold tracking-tight text-[var(--color-foreground)]">Fluctra</span>
              </button>
            </div>

            {#if showAppNav}
              <nav class="hidden md:flex flex-1 min-w-0 overflow-x-auto justify-center space-x-1 px-4">
                <NavLink href="/dashboard">Dashboard</NavLink>
                <NavLink href="/create-discount">Create Discount</NavLink>
                <NavLink href="/my-pools">My Pools</NavLink>
                <NavLink href="/analytics">Analytics</NavLink>
                <NavLink href="/discover">Discover</NavLink>
              </nav>
            {/if}

            <div class="flex items-center shrink-0 space-x-2 md:space-x-4">
              <div class="min-w-0 mr-1 md:mr-0">
                 <!-- FIX: Pass renamed prop handleToggle -->
                 <WalletConnect {isConnected} {walletAddress} handleToggle={toggleConnection} className="px-2 md:px-4" />
              </div>

              {#if showAppNav}
                <button
                  on:click={() => isMenuOpen = !isMenuOpen}
                  class="md:hidden rounded-lg p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-gray-100)] dark:hover:bg-[var(--color-gray-800)] focus:outline-none transition-colors duration-200 ease-out"
                  aria-label="Open menu"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    {#if isMenuOpen}
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    {:else}
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    {/if}
                  </svg>
                </button>
              {/if}
            </div>
          </div>
        </div>
      </div>

      {#if isMenuOpen && showAppNav}
        <div transition:fade={{ duration: 150 }} class="glass absolute w-full md:hidden shadow-lg border-b border-[var(--color-border-subtle)]">
          <div class="pt-2 pb-4 space-y-1 px-4">
            <NavLink href="/dashboard" isMobile={true} on:click={() => isMenuOpen = false}>Dashboard</NavLink>
            <NavLink href="/create-discount" isMobile={true} on:click={() => isMenuOpen = false}>Create Discount</NavLink>
            <NavLink href="/my-pools" isMobile={true} on:click={() => isMenuOpen = false}>My Pools</NavLink>
            <NavLink href="/analytics" isMobile={true} on:click={() => isMenuOpen = false}>Analytics</NavLink>
            <NavLink href="/discover" isMobile={true} on:click={() => isMenuOpen = false}>Discover</NavLink>
          </div>
        </div>
      {/if}
    </div>
  </header>

  <main class="flex-1 py-3">
    <div class="app-container animate-fade-in">
      <slot />
    </div>
  </main>

  <footer class="border-t border-[var(--color-border-subtle)] py-3 mt-6">
        <div class="app-container px-4 sm:px-6">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="mb-4 md:mb-0 flex items-center">
          <span class="text-sm text-[var(--color-text-secondary)]">© 2025 Fluctra. All rights reserved.</span>
        </div>
        <div class="flex space-x-6">
           <a href="/terms" class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:underline">Terms</a>
           <a href="/privacy" class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:underline">Privacy</a>
           <a href="/docs" class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:underline">Docs</a>
           <a href="/contact" class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:underline">Contact</a>
        </div>
      </div>
    </div>
  </footer>
</div>

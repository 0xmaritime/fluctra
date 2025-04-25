<script lang="ts">
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import NavLink from './NavLink.svelte' // Note: NavLink might need refactoring too
  import WalletConnect from './WalletConnect.svelte'
  import { fade } from 'svelte/transition'
  import { onMount } from 'svelte'

  // Mobile menu state
  let isMenuOpen = false
  
  // Check if user is connected to wallet
  let isConnected = false
  
  // Sample wallet address for mock functionality
  let walletAddress = '0x1234...5678'
  // Close mobile menu when route changes
  $: {
    if ($page.url) {
      isMenuOpen = false
    }
  }

  // Determine if we should show the app navigation
  $: showAppNav = $page.url.pathname !== '/' && isConnected

  // Toggle wallet connection state (mock functionality)
  function toggleConnection() {
    isConnected = !isConnected
    if (isConnected && $page.url.pathname === '/') {
      goto('/dashboard')
    }
  }
  
  onMount(() => {
    // Any initialization logic can go here
  })
</script>

<div class="min-h-full flex flex-col">
  <!-- Header -->
  <header class="sticky top-0 z-50">
    <div class="relative">
      <div class="glass border-b border-neutral-100 shadow-sm">
        <div class="app-container">
          <div class="flex items-center justify-between py-4">
            <!-- Logo -->
            <div class="flex items-center">
              <button
                on:click={() => goto('/')}
                class="flex items-center space-x-2 focus:outline-none"
              >
                <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                    <path d="M16 8h-8v8h8v-8z"/>
                    <path d="M3 8l3-3h12l3 3"/>
                    <path d="M3 16l3 3h12l3-3"/>
                    <path d="M8 21v-5"/>
                    <path d="M16 21v-5"/>
                    <path d="M8 3v5"/>
                    <path d="M16 3v5"/>
                  </svg>
                </div>
                <span class="text-xl font-semibold tracking-tight text-neutral-950">Fluctra</span>
              </button>
            </div>
            
            <!-- Desktop Navigation (if applicable) -->
            {#if showAppNav}
              <nav class="hidden md:flex space-x-1">
                <NavLink href="/dashboard">Dashboard</NavLink>
                <NavLink href="/create-discount">Create Discount</NavLink>
                <NavLink href="/my-pools">My Pools</NavLink>
                <NavLink href="/analytics">Analytics</NavLink>
                <NavLink href="/discover">Discover</NavLink>
              </nav>
            {/if}
            
            <!-- Wallet Connection -->
            <div class="flex items-center">
              <WalletConnect
                isConnected={isConnected}
                walletAddress={walletAddress}
                onToggle={toggleConnection}
              />
              
              <!-- Mobile menu button -->
              {#if showAppNav}
                <button
                  on:click={() => isMenuOpen = !isMenuOpen}
                  class="ml-4 md:hidden rounded-lg p-2 text-neutral-500 hover:text-neutral-600 hover:bg-neutral-100 focus:outline-none"
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
      
      <!-- Mobile Navigation Menu -->
      {#if isMenuOpen && showAppNav}
        <div 
          transition:fade={{ duration: 150 }}
          class="glass absolute w-full md:hidden shadow-lg border-b border-neutral-100"
        >
          <div class="pt-2 pb-4 space-y-1 px-4">
            <NavLink
              href="/dashboard"
              isMobile={true}
              on:click={() => isMenuOpen = false}
            >
              Dashboard
            </NavLink>
            <NavLink
              href="/create-discount"
              isMobile={true}
              on:click={() => isMenuOpen = false}
            >
              Create Discount
            </NavLink>
            <NavLink
              href="/my-pools"
              isMobile={true}
              on:click={() => isMenuOpen = false}
            >
              My Pools
            </NavLink>
            <NavLink
              href="/analytics"
              isMobile={true}
              on:click={() => isMenuOpen = false}
            >
              Analytics
            </NavLink>
            <NavLink
              href="/discover"
              isMobile={true}
              on:click={() => isMenuOpen = false}
            >
              Discover
            </NavLink>
          </div>
        </div>
      {/if}
    </div>
  </header>
  
  <!-- Main Content -->
  <main class="flex-1 py-6">
    <div class="app-container animate-fade-in">
      <slot />
    </div>
  </main>
  
  <!-- Footer -->
  <footer class="border-t border-neutral-100 py-6 mt-12">
    <div class="app-container">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="mb-4 md:mb-0 flex items-center">
          <span class="text-sm text-neutral-500">© 2025 Fluctra. All rights reserved.</span>
        </div>
        <div class="flex space-x-6">
          <button class="text-sm text-neutral-500 hover:text-neutral-700">Terms</button>
          <button class="text-sm text-neutral-500 hover:text-neutral-700">Privacy</button>
          <button class="text-sm text-neutral-500 hover:text-neutral-700">Docs</button>
          <button class="text-sm text-neutral-500 hover:text-neutral-700">Contact</button>
        </div>
      </div>
    </div>
  </footer>
</div>

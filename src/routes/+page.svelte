<script lang="ts">
  import { goto } from '$app/navigation';
  import Button from '$lib/components/Button.svelte';
  // Removed Card, Badge, StatCard, etc. - simplify for MVP
  // We don't need fancy components distracting from the core message.

  // Define icon PATH DATA strings as single-line strings with escaped quotes
  // Corrected: Avoid multi-line backtick strings that confused the TS parser
  const rocketIconPaths = '<path d="M12 2L10 4H14L12 2Z"></path><path d="M5 10l-3 2 3 2"></path><path d="M19 10l3 2-3 2"></path><path d="M12 15V22"></path><path d="M10 20H14"></path>';
  const liquidityIcon = '<circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path>';
  const holdersIcon = '<path d="M4 13.5V16a2 2 0 002 2h12a2 2 0 002-2v-2.5"></path><path d="M15 11l-3 3-3-3"></path><path d="M12 14V4"></path>';
  const zeroCodeIcon = '<circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line>'; // Adjusted to close the SVG tag correctly if needed

  // Mock data for featured pools
  const tokens = [
    { 
      id: 1, 
      name: 'Solana DeFi', 
      description: 'High-yield decentralized finance platform on Solana.', 
      discount: 35 
    },
    { 
      id: 2, 
      name: 'GameFi Pro', 
      description: 'Play-to-earn gaming ecosystem with NFT integration.', 
      discount: 40 
    },
    { 
      id: 3, 
      name: 'AI Compute', 
      description: 'Decentralized AI computing platform for machine learning.', 
      discount: 25 
    }
  ];

</script>

<div class="relative -mt-4 z-10 min-h-[calc(100vh-theme(space.16))-\
 /* Adjust 16 as needed based on actual footer height */
]">
  <section class="relative overflow-hidden py-16 md:py-24">
    <div class="absolute inset-0 bg-gradient-to-b from-[oklch(var(--color-primary-500)/0.1)] via-transparent to-transparent"></div>
    <div class="absolute top-[30%] -left-[10%] w-[500px] h-[500px] rounded-full bg-[oklch(var(--color-primary-300)/0.3)] blur-[120px] -z-10 opacity-70"></div>
    <div class="absolute top-[20%] -right-[15%] w-[600px] h-[600px] rounded-full bg-[oklch(var(--color-secondary-300)/0.2)] blur-[150px] -z-10 opacity-60"></div>

    <div class="app-container pt-10 lg:pt-14 relative z-20 text-center">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-foreground)]">
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-secondary-500)]">Launch</span> Your Token. Instantly. With Massive Discount Power.
        </h1>

        <p class="mt-4 text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
          Cut through the noise. Attract dedicated holders with strategic, AI-assisted token discounts. No code, no delays.
        </p>

        <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button on:click={() => goto('/create-discount')} size="lg" className="px-8 py-4">
            Launch Your Token Now
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 ml-2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
          </Button>
          <Button on:click={() => goto('/discover')} variant="secondary" size="lg" className="px-8 py-4">
            Get Discounted Tokens
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 ml-2"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
          </Button>
        </div>

        <!-- Featured Pools Gallery -->
        <div class="mt-16">
          <h2 class="text-2xl font-bold text-[var(--color-foreground)] mb-6">Featured Token Pools</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each tokens.slice(0, 3) as token (token.id)}
              <div class="bg-[var(--color-background-elevated)] rounded-xl p-4 border border-[var(--color-border-default)] hover:shadow-lg transition-shadow">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold text-white" 
                       style:background="var(--color-{['primary','secondary','success'][Math.floor(Math.random() * 3)]}-500)">
                    {token.name.charAt(0)}
                  </div>
                  <h3 class="text-base font-semibold text-[var(--color-text-primary)] truncate">
                    {token.name}
                  </h3>
                </div>
                <p class="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-3">
                  {token.description}
                </p>
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-[var(--color-text-primary)]">
                    {token.discount}% Discount
                  </span>
                  <Button size="sm" on:click={() => goto('/discover')}>
                    View Pool
                  </Button>
                </div>
              </div>
            {/each}
          </div>
          <div class="mt-6 text-center">
            <Button on:click={() => goto('/discover')} variant="secondary">
              View All Pools
            </Button>
          </div>
        </div>

         <div class="mt-12 flex justify-center">
            <div class="w-16 h-16 rounded-full bg-[var(--color-primary-600)] text-[var(--color-interactive-text)] flex items-center justify-center shadow-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8">
                    {@html rocketIconPaths}
                 </svg>
            </div>
         </div>

      </div>
    </div>
  </section>

  <section class="py-16 bg-[var(--color-background-subtle)]">
      <div class="app-container text-center">
          <h2 class="text-3xl font-bold text-[var(--color-foreground)] mb-4">Why Use Fluctra for Your Launch?</h2>
          <p class="text-lg text-[var(--color-text-secondary)] max-w-3xl mx-auto mb-10">
              Stop waiting on exchanges. Go direct to your community, optimized for impact.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div>
                  <div class="flex items-center justify-center md:justify-start text-[var(--color-primary-600)] mb-3">
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8">{@html liquidityIcon}</svg>
                       <span class="ml-2 text-xl font-semibold">Instant Liquidity</span>
                  </div>
                  <p class="text-[var(--color-text-secondary)]">Launch a token sale in minutes, not days or weeks. Direct from creator to holder.</p>
              </div>
               <div>
                   <div class="flex items-center justify-center md:justify-start text-[var(--color-secondary-500)] mb-3">
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8">{@html holdersIcon}</svg>
                       <span class="ml-2 text-xl font-semibold">Attract Quality Holders</span>
                  </div>
                  <p class="text-[var(--color-text-secondary)]">Incentivize real community members and reduce initial selling pressure with smart discounts.</p>
              </div>
               <div>
                   <div class="flex items-center justify-center md:justify-start text-[var(--color-success-700)] mb-3">
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8">{@html zeroCodeIcon}</svg>
                       <span class="ml-2 text-xl font-semibold">Zero Code Needed</span>
                  </div>
                  <p class="text-[var(--color-text-secondary)]">Easily set up and manage your discount pool through our simple, intuitive interface.</p>
              </div>
          </div>
      </div>
  </section>

  <section class="py-16 relative overflow-hidden">
     <div class="absolute inset-0 bg-gradient-to-r from-[oklch(var(--color-primary-600)/0.05)] to-[oklch(var(--color-secondary-500)/0.05)]"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[oklch(var(--color-primary-500)/0.1)] blur-[100px] -z-10"></div>

    <div class="app-container relative z-20 text-center">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold text-[var(--color-foreground)]">Stop Waiting. Start Launching.</h2>
        <p class="mt-3 text-lg text-[var(--color-text-secondary)]">
          Get your token into the hands of motivated buyers today. It takes minutes to set up.
        </p>

        <div class="mt-8">
          <Button size="lg" on:click={() => goto('/create-discount')} className="px-8 py-4">
            Launch Your Discount Pool Now!
          </Button>
        </div>
      </div>
    </div>
  </section>

   </div>

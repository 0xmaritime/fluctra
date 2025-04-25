<script lang="ts">
  import { goto } from '$app/navigation'
  import Button from '../components/Button.svelte'
  import Card from '../components/Card.svelte'
  import Badge from '../components/Badge.svelte'
  import { onMount } from 'svelte'
  
  // Featured pools for display
  const featuredPools = [
    {
      id: 1,
      name: 'TokenA Finance',
      discount: 35,
      chain: 'Ethereum',
      endTime: '2d 4h',
      category: 'DeFi'
    },
    {
      id: 2,
      name: 'GameFi Pro',
      discount: 25,
      chain: 'Base',
      endTime: '5h 30m',
      category: 'Gaming'
    },
    {
      id: 3,
      name: 'AIToken',
      discount: 40,
      chain: 'Solana',
      endTime: '1d 12h',
      category: 'AI/Data'
    }
  ]
  
  // Testimonials
  const testimonials = [
    {
      quote: "Fluctra helped us distribute our token to high-quality holders that are still with us months later.",
      author: "Alex Chen",
      role: "Founder, TokenA Finance",
      image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      quote: "We ran our entire token sale through Fluctra and the AI insights helped us optimize our discount strategy perfectly.",
      author: "Sophia Wang",
      role: "CEO, AIToken",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
  ]
  
  // Stats
  const stats = [
    { label: 'Total Liquidity', value: '$2.4M+' },
    { label: 'Unique Buyers', value: '5,400+' },
    { label: 'Token Projects', value: '120+' },
    { label: 'Chains Supported', value: '4' }
  ]
  
  // Features
  const features = [
    {
      title: 'AI-Optimized Discounts',
      description: 'Let our AI suggest the optimal discount rates based on market conditions and your token metrics.',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />'
    },
    {
      title: 'Multi-Chain Support',
      description: 'Create discount pools across Ethereum, Solana, BNB Chain, and Base from a single dashboard.',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />'
    },
    {
      title: 'Detailed Analytics',
      description: 'Track performance with detailed analytics on buyer behavior, pool health, and token distribution.',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />'
    },
    {
      title: 'Holder Quality Analysis',
      description: 'Identify quality token holders vs. flippers with our advanced wallet analysis tools.',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.773 4.773zM2.25 18h13.5M5.25 4.5a3 3 0 116 0 3 3 0 01-6 0zm9 0a3 3 0 116 0 3 3 0 01-6 0z" />'
    }
  ]
  
  // Animation
  let scrollY = 0
  
  onMount(() => {
    window.addEventListener('scroll', () => {
      scrollY = window.scrollY
    })
    
    return () => {
      window.removeEventListener('scroll', () => {})
    }
  })
</script>

<div class="relative -mt-8 z-10">
  <!-- Hero Section -->
  <section class="relative overflow-hidden pb-16">
    <!-- Background gradient effects -->
    <div class="absolute inset-0 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent"></div>
    <div class="absolute top-[30%] -left-[10%] w-[500px] h-[500px] rounded-full bg-primary-400/30 blur-[120px] -z-10 opacity-70"></div>
    <div class="absolute top-[20%] -right-[15%] w-[600px] h-[600px] rounded-full bg-secondary-400/20 blur-[150px] -z-10 opacity-60"></div>
    
    <div class="app-container pt-20 lg:pt-28 relative">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-950">
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-500">Optimize</span> token distribution with AI-powered discounts
        </h1>
        
        <p class="mt-6 text-lg md:text-xl text-neutral-700 max-w-2xl mx-auto">
          The intelligent platform for crypto token creators to set up strategic discount sales and attract quality holders without coding knowledge.
        </p>
        
        <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button on:click={() => goto('/create-discount')} size="lg">
            For Token Creators
          </Button>
          <Button on:click={() => goto('/discover')} variant="secondary" size="lg">
            For Token Buyers
          </Button>
        </div>
        
        <div class="mt-16 flex justify-center gap-x-8 md:gap-x-12">
          {#each stats as stat}
            <div class="text-center">
              <p class="text-2xl md:text-3xl font-bold text-primary-600">{stat.value}</p>
              <p class="mt-1 text-sm text-neutral-500">{stat.label}</p>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </section>
  
  <!-- Featured Pools Section -->
  <section class="py-16">
    <div class="app-container">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-neutral-900">Featured Discount Pools</h2>
        <p class="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
          Explore active token discount pools with the best rates and highest quality metrics.
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each featuredPools as pool}
          <div class="card p-6 hover:shadow-md transition-shadow duration-200">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-semibold text-lg text-neutral-900">{pool.name}</h3>
                <div class="flex items-center mt-1 space-x-1">
                  <Badge variant={pool.category === 'DeFi' ? 'primary' : pool.category === 'Gaming' ? 'secondary' : 'success'}>
                    {pool.category}
                  </Badge>
                  <span class="text-xs text-neutral-500">•</span>
                  <span class="text-sm text-neutral-600">{pool.chain}</span>
                </div>
              </div>
              <Badge variant={pool.discount >= 30 ? 'success' : 'secondary'}>
                {pool.discount}% Discount
              </Badge>
            </div>
            
            <div class="mt-4 flex justify-between items-center">
              <span class="text-sm text-neutral-600">Ends in {pool.endTime}</span>
              <Button variant="ghost" size="sm" on:click={() => goto('/discover')}>
                View Details
              </Button>
            </div>
          </div>
        {/each}
      </div>
      
      <div class="mt-10 text-center">
        <Button variant="secondary" on:click={() => goto('/discover')}>
          View All Pools
        </Button>
      </div>
    </div>
  </section>
  
  <!-- Features Section -->
  <section class="py-16 bg-neutral-50">
    <div class="app-container">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-neutral-900">Powered by AI</h2>
        <p class="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
          Our platform uses advanced AI to optimize your token distribution strategy and maximize holder quality.
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        {#each features as feature, i}
          <div class="card p-6 flex items-start space-x-4" style="transition-delay: {i * 100}ms">
            <div class="shrink-0">
              <div class="bg-primary-100 p-3 rounded-lg text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  {@html feature.icon}
                </svg>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-neutral-900">{feature.title}</h3>
              <p class="mt-2 text-neutral-600">{feature.description}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>
  
  <!-- Testimonials Section -->
  <section class="py-16">
    <div class="app-container">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-neutral-900">What Creators Say</h2>
        <p class="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
          Hear from projects that have successfully used Fluctra for their token distribution strategy.
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        {#each testimonials as testimonial}
          <div class="card p-8">
            <div class="flex justify-between items-start">
              <svg class="text-primary-300 w-10 h-10" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <img src={testimonial.image} alt={testimonial.author} class="w-12 h-12 rounded-full object-cover" />
            </div>
            
            <p class="mt-6 text-lg text-neutral-700">{testimonial.quote}</p>
            
            <div class="mt-6">
              <p class="font-medium text-neutral-900">{testimonial.author}</p>
              <p class="text-sm text-neutral-500">{testimonial.role}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>
  
  <!-- CTA Section -->
  <section class="py-16 relative overflow-hidden">
    <div class="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-500 opacity-10"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary-500/20 blur-[100px] -z-10"></div>
    
    <div class="app-container relative">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-neutral-900">Ready to optimize your token distribution?</h2>
        <p class="mt-4 text-lg text-neutral-600">
          Join the platform that's helping projects create strategic token discount pools with AI-powered insights.
        </p>
        
        <div class="mt-10">
          <Button size="lg" on:click={() => goto('/create-discount')}>Get Started Now</Button>
        </div>
      </div>
    </div>
  </section>
</div>

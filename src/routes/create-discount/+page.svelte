<script lang="ts">
  import { goto } from '$app/navigation'
  import Button from '../../components/Button.svelte'
  import ProgressBar from '../../components/ProgressBar.svelte'
  import { discountFormData } from './formStore'
  
  // Track current step
  let currentStep = 1
</script>

<div class="animate-slide-up">
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-neutral-900">Create New Discount Pool</h1>
    <p class="text-neutral-600 mt-2">Set up a new token discount pool with AI-optimized settings.</p>
  </div>
  
  <!-- Progress Tracker -->
  <div class="mb-8">
    <ProgressBar progress={currentStep * 33.33} color="primary" className="mb-2" />
    <div class="flex justify-between text-sm text-neutral-500">
      <span class={currentStep >= 1 ? 'text-primary-600 font-medium' : ''}>Token Selection</span>
      <span class={currentStep >= 2 ? 'text-primary-600 font-medium' : ''}>Discount Strategy</span>
      <span class={currentStep >= 3 ? 'text-primary-600 font-medium' : ''}>Review & Deploy</span>
    </div>
  </div>
  
  <!-- Step content will be loaded via nested routes -->
  <slot />
  
  <!-- Navigation buttons -->
  <div class="flex justify-between mt-8">
    {#if currentStep > 1}
      <Button variant="ghost" on:click={() => goto(`/create-discount/step${currentStep - 1}`)}>
        Back
      </Button>
    {:else}
      <div></div> <!-- Spacer -->
    {/if}
    
    {#if currentStep < 3}
      <Button on:click={() => goto(`/create-discount/step${currentStep + 1}`)}>
        Continue
      </Button>
    {:else}
      <Button on:click={() => alert('Pool created!')}>
        Deploy Pool
      </Button>
    {/if}
  </div>
</div>

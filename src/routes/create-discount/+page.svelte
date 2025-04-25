<script lang="ts">
  import { goto } from '$app/navigation';
  import Button from '../../components/Button.svelte';
  import ProgressBar from '../../components/ProgressBar.svelte';
  import { discountFormData } from './formStore';
  import { page } from '$app/stores'; // Import page store to get current step route

  // Determine current step from the route
  $: currentStep = (() => {
    const path = $page.url.pathname;
    if (path.endsWith('/step1')) return 1;
    if (path.endsWith('/step2')) return 2;
    if (path.endsWith('/step3')) return 3;
    // Default to step 1 if on the base route or unknown step
    // Consider redirecting from base '/create-discount' to '/create-discount/step1' in a +layout.server.ts or +page.server.ts
    return 1;
  })();

  // Progress calculation
  $: progressValue = (currentStep / 3) * 100;

  // Function to handle pool deployment (example)
  function deployPool() {
      // Add actual deployment logic here (e.g., smart contract interaction)
      alert('Pool created!');
      // Potentially reset form store:
      // discountFormData.set({ /* initial state */ });
      goto('/dashboard'); // Redirect after deployment
  }

</script>

<div class="animate-slide-up">
  <div class="mb-[calc(var(--spacing)*3)]"> <!-- mb-6 -> 24px -->
    <h1 class="text-2xl font-bold text-[var(--color-foreground)]">Create New Discount Pool</h1>
    <p class="text-[var(--color-text-secondary)] mt-[calc(var(--spacing))]">Set up a new token discount pool with AI-optimized settings.</p> <!-- mt-2 -> 8px -->
  </div>

  <!-- Progress Tracker -->
  <div class="mb-[calc(var(--spacing)*4)]"> <!-- mb-8 -> 32px -->
    <ProgressBar progress={progressValue} color="primary" className="mb-[calc(var(--spacing))]" /> <!-- mb-2 -> 8px -->
    <div class="flex justify-between text-sm text-[var(--color-text-secondary)]">
      <span class:font-medium={currentStep >= 1} class:text-[var(--color-interactive)]={currentStep >= 1}>Token Selection</span>
      <span class:font-medium={currentStep >= 2} class:text-[var(--color-interactive)]={currentStep >= 2}>Discount Strategy</span>
      <span class:font-medium={currentStep >= 3} class:text-[var(--color-interactive)]={currentStep >= 3}>Review & Deploy</span>
    </div>
  </div>

  <!-- Step content will be loaded via nested routes -->
  <div class="min-h-[300px]"> <!-- Add min height to prevent layout jumps -->
    <slot />
  </div>

  <!-- Navigation buttons -->
  <div class="flex justify-between mt-[calc(var(--spacing)*4)]"> <!-- mt-8 -> 32px -->
    {#if currentStep > 1}
      <Button variant="ghost" on:click={() => goto(`/create-discount/step${currentStep - 1}`)}>
        Back
      </Button>
    {:else}
      <div></div> <!-- Spacer to keep the right button aligned -->
    {/if}

    {#if currentStep < 3}
      <Button on:click={() => goto(`/create-discount/step${currentStep + 1}`)}>
        Continue
      </Button>
    {:else if currentStep === 3}
       <!-- The deploy action is now handled within step3 page for verification check -->
       <!-- This button might be removed if step3 handles final action -->
       <!-- Keeping a disabled placeholder for structure review -->
       <Button disabled={true}>Deploy Pool (Action in Review Step)</Button>
    {/if}
  </div>
</div>
<script lang="ts">
  import Card from '../../components/Card.svelte';
  import Select from '../../components/Select.svelte';
  import Badge from '../../components/Badge.svelte';
  // ProgressBar is not used directly on this page in the original code
  import AIInsightCard from '../../components/AIInsightCard.svelte';
  import { onMount, onDestroy } from 'svelte'; // Import onDestroy
  import {
    Chart,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
    ArcElement,
    type ChartItem,
    type TooltipItem,
    type Tick,
    type InteractionMode
  } from 'chart.js/auto';
  import { get } from 'svelte/store'; // To get CSS variables
  import { writable } from 'svelte/store'; // For storing resolved colors

  // Helper function to get computed style
  function getCssVar(variableName: string): string {
    if (typeof window !== 'undefined') {
      return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
    }
    return '#000'; // Default fallback
  }

  // Stores for resolved colors to handle potential timing issues with CSS vars
  const resolvedColors = writable({
    primary: '#000',
    secondary: '#000',
    accent: '#000',
    textColor: '#000',
    gridColor: '#ccc'
  });


  let lineChart: Chart<'line'> | null = null;
  let doughnutChart: Chart<'doughnut'> | null = null;

  // Pool selection options
  const poolOptions = [
    { value: 'presale', label: 'MyToken Presale' },
    { value: 'phase2', label: 'MyToken Phase 2' },
    { value: 'all', label: 'All Pools' }
  ];

  // Selected pool
  let selectedPool = 'presale';

  // Chart data (will use resolved colors)
  const salesChartData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Sales Volume',
        data: [2500, 4800, 5600, 9200, 12800, 14500, 15200],
        fill: true,
        backgroundColor: 'rgba(var(--chart-primary-rgb), 0.1)', // Placeholder
        borderColor: 'rgba(var(--chart-primary-rgb), 0.8)', // Placeholder
        tension: 0.4,
        pointBackgroundColor: 'rgba(var(--chart-primary-rgb), 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(var(--chart-primary-rgb), 1)',
      }
    ]
  };

  const buyerChartData = {
    labels: ['New Wallets', 'Previous Holders', 'Whale Wallets'],
    datasets: [
      {
        data: [62, 24, 14],
        backgroundColor: [
          'rgba(var(--chart-secondary-rgb), 0.8)', // Placeholder
          'rgba(var(--chart-primary-rgb), 0.8)', // Placeholder
          'rgba(var(--chart-accent-rgb), 0.8)' // Placeholder for a third color
        ],
        borderColor: [ // Use slightly darker/opaque versions or card background
           'rgba(var(--chart-secondary-rgb), 1)',
           'rgba(var(--chart-primary-rgb), 1)',
           'rgba(var(--chart-accent-rgb), 1)'
        ],
        borderWidth: 1,
        hoverOffset: 4
      }
    ]
  };

  // AI insights
  const aiInsights = [
    'Your pool is attracting higher quality holders than 80% of similar tokens',
    'Sales acceleration is 2.3x faster than market average',
    'Recommended post-sale strategy: Implement a 7-day lockup for price stability'
  ];

  // Top buyers data
  const topBuyers = [
    { wallet: '0x78...e45d', amount: 2450, time: '12 hours ago', type: 'Long-term', typeClass: 'success' as const },
    { wallet: '0x32...87ac', amount: 1875, time: '1 day ago', type: 'Whale', typeClass: 'primary' as const },
    { wallet: '0x91...f23b', amount: 1200, time: '8 hours ago', type: 'New', typeClass: 'warning' as const }
  ];

  // Format currency
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  }


  function createChartOptions(colors: { textColor: string, gridColor: string }) {
      // Chart options dependent on resolved colors
      const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index' as const,
            intersect: false,
            backgroundColor: getCssVar('--color-gray-900'), // Use dark background for tooltip
            titleColor: getCssVar('--color-gray-100'),
            bodyColor: getCssVar('--color-gray-200'),
            padding: 10,
            cornerRadius: 4,
            callbacks: {
              label: function(context: TooltipItem<'line'>) {
                let label = context.dataset.label || '';
                if (label) { label += ': '; }
                if (context.parsed.y !== null) {
                  label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: colors.textColor }
          },
          y: {
            beginAtZero: true,
            grid: { color: colors.gridColor, borderDash: [3, 3] },
            ticks: {
              color: colors.textColor,
              callback: function(value: string | number) {
                if (typeof value === 'number') { return '$' + value.toLocaleString(); }
                return value;
              }
            }
          }
        }
      };

      const doughnutChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false },
           tooltip: {
             backgroundColor: getCssVar('--color-gray-900'),
             titleColor: getCssVar('--color-gray-100'),
             bodyColor: getCssVar('--color-gray-200'),
             padding: 10,
             cornerRadius: 4,
             callbacks: {
              label: function(context: TooltipItem<'doughnut'>) {
                return context.label + ': ' + context.parsed + '%';
              }
            }
          }
        }
      };
      return { lineChartOptions, doughnutChartOptions };
  }


  // Helper to convert OKLCH to RGB string for Chart.js RGBA
  // Basic conversion, might need refinement for accuracy/edge cases
  function oklchToRgbString(oklchString: string): string {
        // This is a placeholder. A real implementation needs a proper color conversion library.
        // Example: Convert oklch(60% 0.21 250) -> "37, 99, 235"
        // For now, returning fallback values.
        if (oklchString.includes('250')) return '37, 99, 235'; // Primary guess
        if (oklchString.includes('190')) return '0, 150, 170'; // Secondary guess (approx)
        if (oklchString.includes('290')) return '123, 97, 255'; // Accent guess
        return '100, 116, 139'; // Default guess (gray)
  }


  onMount(() => {
     // Resolve CSS variables after mount
    const primaryColor = getCssVar('--color-interactive'); // e.g., oklch(60% 0.21 250)
    const secondaryColor = getCssVar('--color-secondary-500'); // e.g., oklch(78% 0.1 190)
    // Define an accent color if needed for charts, e.g., purple
    const accentColor = 'oklch(70% 0.15 290)'; // Example accent
    const textColor = getCssVar('--color-text-secondary');
    const gridColor = getCssVar('--color-border-subtle');

    // Store resolved RGB values for Chart.js
    resolvedColors.set({
        primary: oklchToRgbString(primaryColor),
        secondary: oklchToRgbString(secondaryColor),
        accent: oklchToRgbString(accentColor), // Use a defined accent color
        textColor: textColor,
        gridColor: gridColor
    });

    // Update chart data with resolved RGBs (simple replacement for demo)
    const rgb = get(resolvedColors);
    salesChartData.datasets[0].backgroundColor = `rgba(${rgb.primary}, 0.1)`;
    salesChartData.datasets[0].borderColor = `rgba(${rgb.primary}, 0.8)`;
    salesChartData.datasets[0].pointBackgroundColor = `rgba(${rgb.primary}, 1)`;
    salesChartData.datasets[0].pointHoverBorderColor = `rgba(${rgb.primary}, 1)`;

    buyerChartData.datasets[0].backgroundColor = [
       `rgba(${rgb.secondary}, 0.8)`,
       `rgba(${rgb.primary}, 0.8)`,
       `rgba(${rgb.accent}, 0.8)`
    ];
     buyerChartData.datasets[0].borderColor = [
       `rgba(${rgb.secondary}, 1)`,
       `rgba(${rgb.primary}, 1)`,
       `rgba(${rgb.accent}, 1)`
    ];


    const { lineChartOptions, doughnutChartOptions } = createChartOptions(get(resolvedColors));

    const lineCtx = document.getElementById('lineChart') as ChartItem | null;
    if (lineCtx) {
      lineChart = new Chart(lineCtx, { type: 'line', data: salesChartData, options: lineChartOptions });
    }

    const doughnutCtx = document.getElementById('doughnutChart') as ChartItem | null;
    if (doughnutCtx) {
      doughnutChart = new Chart(doughnutCtx, { type: 'doughnut', data: buyerChartData, options: doughnutChartOptions });
    }

    // Optional: Add listener for color scheme changes to update chart colors
    // const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    // const handleChange = () => { /* update colors and charts */ };
    // mediaQuery.addEventListener('change', handleChange);

    return () => {
      lineChart?.destroy();
      doughnutChart?.destroy();
      // mediaQuery?.removeEventListener('change', handleChange);
    };
  });


</script>

<div class="animate-slide-up space-y-6"> <!-- Added spacing -->
  <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
    <h1 class="text-2xl font-bold text-[var(--color-foreground)]">Pool Analytics</h1>
    <Select
      options={poolOptions}
      bind:value={selectedPool}
      className="md:w-64"
    />
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Sales Progress Chart -->
    <div class="lg:col-span-2">
      <Card title="Sale Progress" className="h-full">
        <div class="h-64 relative"> 
          <canvas id="lineChart"></canvas>
        </div>

        <div class="grid grid-cols-3 gap-[calc(var(--spacing)*2)] mt-[calc(var(--spacing)*3)]"> <!-- gap-4, mt-6 -->
          <div>
            <div class="text-sm text-[var(--color-text-secondary)]">Total Sales</div>
            <div class="font-semibold text-lg text-[var(--color-text-primary)]">{formatCurrency(15200)}</div>
          </div>
          <div>
            <div class="text-sm text-[var(--color-text-secondary)]">Completion</div>
            <div class="font-semibold text-lg text-[var(--color-text-primary)]">76%</div>
          </div>
          <div>
            <div class="text-sm text-[var(--color-text-secondary)]">Remaining</div>
            <div class="font-semibold text-lg text-[var(--color-text-primary)]">12h 45m</div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Buyer Analytics & Pool Health -->
    <div class="lg:col-span-1 space-y-6">
      <Card title="Buyer Analytics">
        <div class="h-40 relative"> 
          <canvas id="doughnutChart"></canvas>
        </div>

        <div class="mt-4 space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-[var(--color-text-secondary)]">New Wallets:</span>
            <span class="font-medium text-[var(--color-text-primary)]">62%</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[var(--color-text-secondary)]">Previous Holders:</span>
            <span class="font-medium text-[var(--color-text-primary)]">24%</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[var(--color-text-secondary)]">Whale Wallets:</span>
            <span class="font-medium text-[var(--color-text-primary)]">14%</span>
          </div>
        </div>
      </Card>

      <Card title="Pool Health">
        <div class="flex items-center mt-2">
          <div class="w-14 h-14 rounded-full bg-[var(--color-success-500)] text-[var(--color-gray-0)] flex items-center justify-center font-bold text-xl">
            85
          </div>
          <div class="ml-4">
            <div class="font-medium text-[var(--color-text-primary)]">Excellent</div>
            <div class="text-sm text-[var(--color-text-secondary)]">Higher than average buyer quality</div>
          </div>
        </div>
      </Card>
    </div>
  </div>

  <!-- AI Insights -->
  <AIInsightCard
    title="AI Insights"
    insights={aiInsights}
    actionText="View Detailed Analysis"
    onAction={() => console.log('Navigate to detailed analysis')}
  />

  <!-- Top Buyers -->
  <h2 class="text-xl font-semibold text-[var(--color-foreground)]">Top Buyers</h2>

  <Card className="p-0 overflow-hidden"> 
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-[var(--color-border-default)]">
        <thead class="bg-[var(--color-background-subtle)]">
          <tr>
             <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
              Wallet
            </th>
             <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
              Amount
            </th>
             <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
              Transaction
            </th>
             <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
              Buyer Type
            </th>
          </tr>
        </thead>
        <tbody class="bg-[var(--color-card-background)] divide-y divide-[var(--color-border-default)]">
          {#each topBuyers as buyer}
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-primary)] font-mono">
                {buyer.wallet}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                {formatCurrency(buyer.amount)}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                {buyer.time}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                 <Badge variant={buyer.typeClass}>
                  {buyer.type}
                </Badge>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </Card>
</div>
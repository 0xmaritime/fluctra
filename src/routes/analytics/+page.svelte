<script lang="ts">
  import Card from '../../components/Card.svelte'
  import Select from '../../components/Select.svelte'
  import Badge from '../../components/Badge.svelte'
  import ProgressBar from '../../components/ProgressBar.svelte'
  import AIInsightCard from '../../components/AIInsightCard.svelte'
  import { onMount } from 'svelte'
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
    type InteractionMode // Import the specific type for tooltip mode
  } from 'chart.js/auto'
  
  let lineChart: Chart<'line'> | null = null;
  let doughnutChart: Chart<'doughnut'> | null = null;
  
  // Pool selection options
  const poolOptions = [
    { value: 'presale', label: 'MyToken Presale' },
    { value: 'phase2', label: 'MyToken Phase 2' },
    { value: 'all', label: 'All Pools' }
  ]
  
  // Selected pool
  let selectedPool = 'presale'
  
  // Chart data
  const salesChartData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Sales Volume',
        data: [2500, 4800, 5600, 9200, 12800, 14500, 15200],
        fill: true,
        backgroundColor: 'rgba(0, 87, 183, 0.1)',
        borderColor: 'rgba(0, 87, 183, 0.8)',
        tension: 0.4
      }
    ]
  }
  
  const buyerChartData = {
    labels: ['New Wallets', 'Previous Holders', 'Whale Wallets'],
    datasets: [
      {
        data: [62, 24, 14],
        backgroundColor: [
          'rgba(0, 194, 255, 0.8)',
          'rgba(0, 87, 183, 0.8)',
          'rgba(123, 97, 255, 0.8)'
        ],
        borderColor: [
          'rgba(0, 194, 255, 1)',
          'rgba(0, 87, 183, 1)',
          'rgba(123, 97, 255, 1)'
        ],
        borderWidth: 1
      }
    ]
  }
  
  // AI insights
  const aiInsights = [
    'Your pool is attracting higher quality holders than 80% of similar tokens',
    'Sales acceleration is 2.3x faster than market average',
    'Recommended post-sale strategy: Implement a 7-day lockup for price stability'
  ]
  
  // Top buyers data
  const topBuyers = [
    {
      wallet: '0x78...e45d',
      amount: 2450,
      time: '12 hours ago',
      type: 'Long-term',
      typeClass: 'success'
    },
    {
      wallet: '0x32...87ac',
      amount: 1875,
      time: '1 day ago',
      type: 'Whale',
      typeClass: 'primary'
    },
    {
      wallet: '0x91...f23b',
      amount: 1200,
      time: '8 hours ago',
      type: 'New',
      typeClass: 'warning'
    }
  ]
  
  // Format currency
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }
  
  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index' as InteractionMode, // Explicitly cast the mode
        intersect: false,
        callbacks: {
          label: function(context: TooltipItem<'line'>) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: string | number, index: number, ticks: Tick[]) {
            // Check if value is a number before formatting
            if (typeof value === 'number') {
              return '$' + value.toLocaleString();
            }
            return value; // Return as is if not a number
          }
        }
      }
    }
  }
  
  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'doughnut'>) {
            return context.label + ': ' + context.parsed + '%';
          }
        }
      }
    }
  }
  
  onMount(() => {
    // Initialize line chart
    const lineCtx = document.getElementById('lineChart') as ChartItem | null;
    if (lineCtx) {
      lineChart = new Chart(lineCtx, {
        type: 'line',
        data: salesChartData,
        options: lineChartOptions
      });
    } else {
      console.error("Could not find canvas element with id 'lineChart'");
    }

    // Initialize doughnut chart
    const doughnutCtx = document.getElementById('doughnutChart') as ChartItem | null;
     if (doughnutCtx) {
      doughnutChart = new Chart(doughnutCtx, {
        type: 'doughnut',
        data: buyerChartData,
        options: doughnutChartOptions
      });
    } else {
       console.error("Could not find canvas element with id 'doughnutChart'");
    }

    return () => {
      // Cleanup charts
      lineChart?.destroy();
      doughnutChart?.destroy();
    };
  })
</script>

<div class="animate-slide-up">
  <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
    <h1 class="text-2xl font-bold text-neutral-900">Pool Analytics</h1>
    <Select
      options={poolOptions}
      bind:value={selectedPool}
      className="md:w-64"
    />
  </div>
  
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
    <!-- Sales Progress Chart -->
    <div class="lg:col-span-2">
      <Card title="Sale Progress" className="h-full">
        <div class="h-64">
          <canvas id="lineChart"></canvas>
        </div>
        
        <div class="grid grid-cols-3 gap-4 mt-6">
          <div>
            <div class="text-sm text-neutral-500">Total Sales</div>
            <div class="font-semibold text-lg text-neutral-900">{formatCurrency(15200)}</div>
          </div>
          <div>
            <div class="text-sm text-neutral-500">Completion</div>
            <div class="font-semibold text-lg text-neutral-900">76%</div>
          </div>
          <div>
            <div class="text-sm text-neutral-500">Remaining</div>
            <div class="font-semibold text-lg text-neutral-900">12h 45m</div>
          </div>
        </div>
      </Card>
    </div>
    
    <!-- Buyer Analytics & Pool Health -->
    <div class="lg:col-span-1 space-y-6">
      <Card title="Buyer Analytics">
        <div class="h-40">
          <canvas id="doughnutChart"></canvas>
        </div>
        
        <div class="mt-4 space-y-2 text-sm">
          <div class="flex justify-between">
            <div class="text-neutral-600">New Wallets:</div>
            <div class="font-semibold text-neutral-900">62%</div>
          </div>
          <div class="flex justify-between">
            <div class="text-neutral-600">Previous Holders:</div>
            <div class="font-semibold text-neutral-900">24%</div>
          </div>
          <div class="flex justify-between">
            <div class="text-neutral-600">Whale Wallets:</div>
            <div class="font-semibold text-neutral-900">14%</div>
          </div>
        </div>
      </Card>
      
      <Card title="Pool Health">
        <div class="flex items-center mt-2">
          <div class="w-14 h-14 rounded-full bg-success-500 text-white flex items-center justify-center font-bold text-xl">
            85
          </div>
          <div class="ml-4">
            <div class="font-medium text-neutral-900">Excellent</div>
            <div class="text-sm text-neutral-500">Higher than average buyer quality</div>
          </div>
        </div>
      </Card>
    </div>
  </div>
  
  <!-- AI Insights -->
  <div class="mb-6">
    <AIInsightCard
      title="AI Insights"
      insights={aiInsights}
      actionText="View Detailed Analysis"
    />
  </div>
  
  <!-- Top Buyers -->
  <h2 class="text-xl font-semibold text-neutral-900 mb-4">Top Buyers</h2>
  
  <Card padding="p-0">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-neutral-200">
        <thead>
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Wallet
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Amount
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Transaction
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Buyer Type
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-neutral-200">
          {#each topBuyers as buyer}
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                {buyer.wallet}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                {formatCurrency(buyer.amount)}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                {buyer.time}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge variant={buyer.typeClass as ('success' | 'primary' | 'warning' | 'error' | 'secondary' | 'neutral')}>
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

<script setup lang="ts">
const { data: farms } = await useFetch('/api/farms')
const { data: crops } = await useFetch('/api/crops')
const { data: orders } = await useFetch('/api/market/orders')
const { data: finance } = await useFetch('/api/finance')
const { data: forecasts } = await useFetch('/api/finance/forecast')

const totalAcres = computed(() => farms.value?.reduce((acc: number, f: any) => acc + f.areaAcres, 0) || 0)
const totalCrops = computed(() => crops.value?.length || 0)
const activeOrders = computed(() => orders.value?.filter((o: any) => o.status !== 'Delivered').length || 0)
const netProfit = computed(() => finance.value?.summary?.netProfit || 0)

const statusBadgeColor = (status: string) => {
  switch (status) {
    case 'Growing': return 'info'
    case 'Ready for Harvest': return 'success'
    case 'Harvested': return 'neutral'
    case 'Germinating': return 'warning'
    default: return 'neutral'
  }
}

const orderStatusColor = (status: string) => {
  switch (status) {
    case 'Delivered': return 'success'
    case 'Dispatched in Transit': return 'primary'
    case 'Processing at Hub': return 'warning'
    default: return 'neutral'
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header & Action Controls -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Farm Command Center</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time agronomy telemetry, crop cycles, and trade operations.</p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink to="/farms/crops">
          <UButton size="sm" color="neutral" variant="outline" icon="i-lucide-sprout">
            Field Manager
          </UButton>
        </NuxtLink>
        <NuxtLink to="/market">
          <UButton size="sm" color="primary" variant="solid" icon="i-lucide-shopping-cart">
            Mandi Trade
          </UButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Core KPI Metric Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Acreage -->
      <div class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span class="text-xs font-semibold uppercase tracking-wider">Registered Acreage</span>
          <UIcon name="i-lucide-map" class="w-4 h-4 text-emerald-600" />
        </div>
        <div class="mt-2 flex items-baseline gap-2">
          <span class="text-2xl font-bold text-slate-900 dark:text-white">{{ totalAcres }}</span>
          <span class="text-xs text-slate-500">Acres (3 Farms)</span>
        </div>
        <div class="mt-2 text-xs text-emerald-600 flex items-center gap-1 font-medium">
          <UIcon name="i-lucide-check-circle-2" class="w-3.5 h-3.5" />
          <span>100% Soil Tested</span>
        </div>
      </div>

      <!-- Sown Crops -->
      <div class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span class="text-xs font-semibold uppercase tracking-wider">Active Sown Crops</span>
          <UIcon name="i-lucide-wheat" class="w-4 h-4 text-emerald-600" />
        </div>
        <div class="mt-2 flex items-baseline gap-2">
          <span class="text-2xl font-bold text-slate-900 dark:text-white">{{ totalCrops }}</span>
          <span class="text-xs text-slate-500">Parcels</span>
        </div>
        <div class="mt-2 text-xs text-emerald-600 flex items-center gap-1 font-medium">
          <UIcon name="i-lucide-trending-up" class="w-3.5 h-3.5" />
          <span>Rabi Cycle Active</span>
        </div>
      </div>

      <!-- Active Shipments -->
      <div class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span class="text-xs font-semibold uppercase tracking-wider">Active Shipments</span>
          <UIcon name="i-lucide-truck" class="w-4 h-4 text-amber-600" />
        </div>
        <div class="mt-2 flex items-baseline gap-2">
          <span class="text-2xl font-bold text-slate-900 dark:text-white">{{ activeOrders }}</span>
          <span class="text-xs text-slate-500">Consignments</span>
        </div>
        <div class="mt-2 text-xs text-amber-600 flex items-center gap-1 font-medium">
          <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
          <span>QR Batches Verified</span>
        </div>
      </div>

      <!-- Net Farm Margin -->
      <div class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div class="flex items-center justify-between text-slate-500 dark:text-slate-400">
          <span class="text-xs font-semibold uppercase tracking-wider">Net Farm Surplus</span>
          <UIcon name="i-lucide-wallet" class="w-4 h-4 text-emerald-600" />
        </div>
        <div class="mt-2 flex items-baseline gap-2">
          <span class="text-2xl font-bold text-emerald-700 dark:text-emerald-400">₹{{ Number(netProfit).toLocaleString('en-IN') }}</span>
          <span class="text-xs text-slate-500">INR</span>
        </div>
        <div class="mt-2 text-xs text-emerald-600 flex items-center gap-1 font-medium">
          <UIcon name="i-lucide-arrow-up-right" class="w-3.5 h-3.5" />
          <span>{{ finance?.summary?.marginPercent }}% Profit Margin</span>
        </div>
      </div>
    </div>

    <!-- Agronomy & Weather Advisory Banner -->
    <div class="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-start gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
          <UIcon name="i-lucide-cloud-sun-rain" class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-sm font-semibold text-emerald-900 dark:text-emerald-100">Weather & Agronomy Advisory (Gujarat Agro-Climatic Zone)</h2>
          <p class="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
            Favorable morning dew levels observed. Recommended window for second Jeevamrutha spray for Sharbati Wheat over next 48 hours before temperature rise.
          </p>
        </div>
      </div>
      <NuxtLink to="/community" class="shrink-0">
        <UButton size="xs" color="primary" variant="subtle" icon="i-lucide-arrow-right">
          Read Field Guide
        </UButton>
      </NuxtLink>
    </div>

    <!-- Two Column Operational Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left 2 Cols: Crop Lifecycles & Field Status -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Crops Section -->
        <div class="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-base font-bold text-slate-900 dark:text-white">Active Crop Sowing Cycles</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">Current stages, acreage allocation, and projected yields</p>
            </div>
            <NuxtLink to="/farms/crops">
              <UButton size="xs" color="neutral" variant="ghost" trailing-icon="i-lucide-chevron-right">
                View All
              </UButton>
            </NuxtLink>
          </div>

          <div class="divide-y divide-slate-100 dark:divide-slate-800">
            <div
              v-for="crop in crops"
              :key="crop.id"
              class="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm shrink-0">
                  <UIcon name="i-lucide-sprout" class="w-5 h-5" />
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-semibold text-slate-900 dark:text-white">{{ crop.name }}</span>
                    <UBadge :color="statusBadgeColor(crop.status)" variant="subtle" size="xs">
                      {{ crop.status }}
                    </UBadge>
                  </div>
                  <span class="text-xs text-slate-500 dark:text-slate-400">
                    {{ crop.season }} Season • {{ crop.areaSown }} Acres • Sown: {{ crop.sowDate }}
                  </span>
                </div>
              </div>

              <div class="flex items-center gap-4 text-right">
                <div>
                  <span class="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                    {{ Number(crop.targetYieldKg).toLocaleString() }} kg
                  </span>
                  <span class="text-[11px] text-slate-400">Expected Harvest: {{ crop.expectedHarvestDate }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Market Shipments -->
        <div class="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-base font-bold text-slate-900 dark:text-white">Recent Consignments & QR Batches</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">Traceable batch orders with delivery verification</p>
            </div>
            <NuxtLink to="/market/orders">
              <UButton size="xs" color="neutral" variant="ghost" trailing-icon="i-lucide-chevron-right">
                All Orders
              </UButton>
            </NuxtLink>
          </div>

          <div class="space-y-3">
            <div
              v-for="order in orders"
              :key="order.id"
              class="p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <NuxtLink
                    :to="`/market/trace?batch=${order.batchCode}`"
                    class="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <UIcon name="i-lucide-qr-code" class="w-3.5 h-3.5" />
                    {{ order.batchCode }}
                  </NuxtLink>
                  <UBadge :color="orderStatusColor(order.status)" variant="subtle" size="xs">
                    {{ order.status }}
                  </UBadge>
                </div>
                <p class="text-xs text-slate-600 dark:text-slate-300">
                  <strong>{{ order.cropName }}</strong> ({{ order.quantity }} {{ order.unit }}) • Sold to {{ order.buyerName }}
                </p>
                <p class="text-[11px] text-slate-400">
                  {{ order.currentLocation }}
                </p>
              </div>

              <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                <span class="text-sm font-bold text-slate-900 dark:text-white">
                  ₹{{ Number(order.totalPrice).toLocaleString('en-IN') }}
                </span>
                <NuxtLink :to="`/market/trace?batch=${order.batchCode}`">
                  <UButton size="xs" color="neutral" variant="ghost" class="text-xs">
                    Trace Route
                  </UButton>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right 1 Col: Mandi Intelligence & Fast Shortcuts -->
      <div class="space-y-6">
        <!-- Mandi Price Forecast Card -->
        <div class="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-base font-bold text-slate-900 dark:text-white">Mandi Price Signals</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">Forecast models & APMC benchmarks</p>
            </div>
            <NuxtLink to="/finance/forecast">
              <UButton size="xs" color="primary" variant="subtle">Forecasts</UButton>
            </NuxtLink>
          </div>

          <div class="space-y-3">
            <div
              v-for="item in forecasts?.slice(0, 4)"
              :key="item.crop"
              class="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between"
            >
              <div>
                <span class="text-xs font-semibold text-slate-900 dark:text-white block">{{ item.crop }}</span>
                <span class="text-[11px] text-slate-400">{{ item.mandi }}</span>
              </div>
              <div class="text-right">
                <span class="text-xs font-bold text-slate-900 dark:text-white block">₹{{ item.currentPrice.toFixed(2) }}/kg</span>
                <span
                  :class="[
                    'text-[10px] font-semibold flex items-center justify-end gap-0.5',
                    item.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                  ]"
                >
                  <UIcon :name="item.trend === 'up' ? 'i-lucide-arrow-up-right' : 'i-lucide-arrow-down-right'" class="w-3 h-3" />
                  {{ item.changePercent }} ({{ item.recommendation }})
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Access Shortcuts -->
        <div class="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h2 class="text-sm font-bold text-slate-900 dark:text-white">Quick Shortcuts</h2>
          <div class="grid grid-cols-2 gap-2">
            <NuxtLink to="/farms" class="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-center block">
              <UIcon name="i-lucide-map-pin" class="w-5 h-5 mx-auto text-emerald-600 mb-1" />
              <span class="text-xs font-medium text-slate-700 dark:text-slate-300 block">Manage Farms</span>
            </NuxtLink>
            <NuxtLink to="/farms/inventory" class="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-center block">
              <UIcon name="i-lucide-package" class="w-5 h-5 mx-auto text-emerald-600 mb-1" />
              <span class="text-xs font-medium text-slate-700 dark:text-slate-300 block">Warehouse</span>
            </NuxtLink>
            <NuxtLink to="/finance" class="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-center block">
              <UIcon name="i-lucide-receipt" class="w-5 h-5 mx-auto text-emerald-600 mb-1" />
              <span class="text-xs font-medium text-slate-700 dark:text-slate-300 block">Farm Ledger</span>
            </NuxtLink>
            <NuxtLink to="/finance/subsidies" class="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-center block">
              <UIcon name="i-lucide-landmark" class="w-5 h-5 mx-auto text-emerald-600 mb-1" />
              <span class="text-xs font-medium text-slate-700 dark:text-slate-300 block">Govt Schemes</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: forecasts } = await useFetch('/api/finance/forecast')
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Mandi Commodity Price Intelligence</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Predictive seasonal price signals, APMC wholesale rates, and recommended sell windows.</p>
      </div>

      <NuxtLink to="/finance">
        <UButton color="neutral" variant="outline" icon="i-lucide-arrow-left">
          Back to Ledger
        </UButton>
      </NuxtLink>
    </div>

    <!-- Forecast Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="item in forecasts"
        :key="item.crop"
        class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-slate-400 flex items-center gap-1">
              <UIcon name="i-lucide-building" class="w-3.5 h-3.5" />
              {{ item.mandi }}
            </span>
            <span
              :class="[
                'text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1',
                item.recommendation === 'Hold for Gain'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : item.recommendation === 'Strong Sell'
                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
              ]"
            >
              {{ item.recommendation }}
            </span>
          </div>

          <h2 class="text-base font-bold text-slate-900 dark:text-white mt-1">{{ item.crop }}</h2>

          <div class="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-3">
            <div>
              <span class="text-[11px] text-slate-400 block">Current Spot Rate</span>
              <span class="text-lg font-bold text-slate-900 dark:text-white">₹{{ item.currentPrice.toFixed(2) }}</span>
              <span class="text-[11px] text-slate-500">/ kg</span>
            </div>
            <div>
              <span class="text-[11px] text-slate-400 block">30-Day Projected</span>
              <span class="text-lg font-bold text-emerald-700 dark:text-emerald-400">₹{{ item.forecastPrice.toFixed(2) }}</span>
              <span class="text-[11px] text-slate-500">/ kg</span>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div class="flex items-center gap-1 text-slate-500">
            <UIcon name="i-lucide-shield-check" class="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Confidence: <strong>{{ item.confidence }}%</strong></span>
          </div>

          <span
            :class="[
              'font-semibold flex items-center gap-0.5',
              item.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
            ]"
          >
            <UIcon :name="item.trend === 'up' ? 'i-lucide-trending-up' : 'i-lucide-trending-down'" class="w-4 h-4" />
            {{ item.changePercent }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

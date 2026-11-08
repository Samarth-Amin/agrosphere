<script setup lang="ts">
const { data: subsidies } = await useFetch('/api/finance/subsidies')
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Government Schemes &amp; Subsidies Navigator</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Direct state and central subsidy opportunities for solar pumps, organic clusters, and insurance.</p>
      </div>

      <NuxtLink to="/finance">
        <UButton color="neutral" variant="outline" icon="i-lucide-arrow-left">
          Back to Ledger
        </UButton>
      </NuxtLink>
    </div>

    <!-- Subsidies List -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div
        v-for="scheme in subsidies"
        :key="scheme.id"
        class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between"
      >
        <div class="space-y-3">
          <div class="flex items-start justify-between gap-2">
            <UBadge color="primary" variant="subtle" size="xs">{{ scheme.category }}</UBadge>
            <span
              :class="[
                'text-[11px] font-semibold px-2 py-0.5 rounded-full',
                scheme.status === 'Expiring Soon'
                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
              ]"
            >
              {{ scheme.status }}
            </span>
          </div>

          <div>
            <h2 class="text-base font-bold text-slate-900 dark:text-white">{{ scheme.title }}</h2>
            <p class="text-xs text-slate-400 mt-0.5">Authority: {{ scheme.authority }}</p>
          </div>

          <div class="p-3 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 text-xs">
            <span class="text-emerald-900 dark:text-emerald-200 font-semibold block">Maximum Grant Benefit:</span>
            <span class="text-emerald-800 dark:text-emerald-300 font-bold text-sm">{{ scheme.maxBenefit }}</span>
          </div>

          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {{ scheme.summary }}
          </p>

          <div class="pt-2">
            <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">Required Documents</span>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="doc in scheme.documentsNeeded"
                :key="doc"
                class="text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300"
              >
                {{ doc }}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span class="text-slate-400">Application Deadline: <strong>{{ scheme.deadline }}</strong></span>
          <UButton size="xs" color="primary" variant="solid" icon="i-lucide-external-link">
            Apply via Portal
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

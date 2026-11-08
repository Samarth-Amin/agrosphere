<script setup lang="ts">
const route = useRoute()
const searchInput = ref((route.query.batch as string) || 'AGRO-20261105-9421')
const activeBatch = ref(searchInput.value)

const { data: traceData, error, refresh } = await useFetch(() => `/api/market/trace/${activeBatch.value}`)

const handleSearch = () => {
  if (!searchInput.value.trim()) return
  activeBatch.value = searchInput.value.trim()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Batch Provenance &amp; QR Traceability</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Immutable farm-to-shelf provenance verification for organic commodities.</p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink to="/market/orders">
          <UButton color="neutral" variant="outline" icon="i-lucide-list">
            View All Batches
          </UButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Batch Search Box -->
    <div class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
      <form @submit.prevent="handleSearch" class="flex gap-2">
        <UInput
          v-model="searchInput"
          placeholder="Enter Batch Code (e.g. AGRO-20261105-9421)..."
          icon="i-lucide-search"
          class="flex-1 font-mono text-sm"
        />
        <UButton type="submit" color="primary" variant="solid" icon="i-lucide-check">
          Verify Provenance
        </UButton>
      </form>
    </div>

    <!-- Error State -->
    <div v-if="error" class="p-6 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 text-center space-y-2">
      <UIcon name="i-lucide-alert-circle" class="w-8 h-8 text-rose-500 mx-auto" />
      <h3 class="text-sm font-bold text-rose-900 dark:text-rose-100">Batch Not Found in Agri-Registry</h3>
      <p class="text-xs text-rose-600 dark:text-rose-400">
        No record exists for code "{{ activeBatch }}". Please check the QR code or select an active order from the orders tab.
      </p>
    </div>

    <!-- Trace Details View -->
    <div v-else-if="traceData" class="space-y-6">
      <!-- Certificate Header Banner -->
      <div class="p-6 rounded-xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-md relative overflow-hidden">
        <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-700/80 text-emerald-200">
                VERIFIED BATCH
              </span>
              <span class="text-xs text-emerald-200">{{ traceData.origin.certification }}</span>
            </div>
            <h2 class="text-2xl font-bold tracking-tight text-white">{{ traceData.cropName }}</h2>
            <p class="text-sm text-emerald-100 font-mono">Batch Identification: {{ traceData.batchCode }}</p>
          </div>

          <div class="p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-right shrink-0">
            <span class="text-[11px] text-emerald-200 uppercase tracking-wider block">Consignment Volume</span>
            <span class="text-xl font-bold text-white">{{ Number(traceData.quantity).toLocaleString() }} {{ traceData.unit }}</span>
          </div>
        </div>
      </div>

      <!-- Farm Origin & Logistics Information Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Farm Origin Card -->
        <div class="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div class="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <UIcon name="i-lucide-home" class="w-4 h-4 text-emerald-600" />
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Farm Origin Telemetry</h3>
          </div>

          <div class="space-y-2 text-xs">
            <div class="flex justify-between">
              <span class="text-slate-400">Registered Farm:</span>
              <strong class="text-slate-800 dark:text-slate-200">{{ traceData.origin.farmName }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Location:</span>
              <strong class="text-slate-800 dark:text-slate-200">{{ traceData.origin.location }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Cultivation Method:</span>
              <strong class="text-slate-800 dark:text-slate-200">{{ traceData.origin.farmType }} Permaculture</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Farmer / Agro Lead:</span>
              <strong class="text-slate-800 dark:text-slate-200">{{ traceData.origin.farmer }}</strong>
            </div>
          </div>
        </div>

        <!-- Logistics Partner Card -->
        <div class="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div class="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <UIcon name="i-lucide-truck" class="w-4 h-4 text-emerald-600" />
            <h3 class="text-sm font-bold text-slate-900 dark:text-white">Supply Chain &amp; Dispatch</h3>
          </div>

          <div class="space-y-2 text-xs">
            <div class="flex justify-between">
              <span class="text-slate-400">Logistics Partner:</span>
              <strong class="text-slate-800 dark:text-slate-200">{{ traceData.deliveryPartner }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Current Checkpoint:</span>
              <strong class="text-emerald-600 font-semibold">{{ traceData.currentLocation }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Destination:</span>
              <strong class="text-slate-800 dark:text-slate-200">{{ traceData.deliveryAddress }}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Target Delivery:</span>
              <strong class="text-slate-800 dark:text-slate-200">{{ traceData.estimatedDelivery }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Provenance Timeline Steps -->
      <div class="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UIcon name="i-lucide-git-commit" class="w-4 h-4 text-emerald-600" />
            End-to-End Chain of Custody Milestones
          </h3>
          <UBadge color="primary" variant="subtle" size="xs">Digital Signature Verified</UBadge>
        </div>

        <div class="space-y-4">
          <div
            v-for="(milestone, idx) in traceData.milestones"
            :key="idx"
            class="flex items-start gap-4"
          >
            <!-- Timeline Pin -->
            <div class="flex flex-col items-center">
              <div
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                  milestone.status === 'Completed'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                ]"
              >
                <UIcon
                  :name="milestone.status === 'Completed' ? 'i-lucide-check' : 'i-lucide-clock'"
                  class="w-4 h-4"
                />
              </div>
              <div v-if="idx < traceData.milestones.length - 1" class="w-0.5 h-12 bg-slate-200 dark:bg-slate-800 my-1"></div>
            </div>

            <!-- Milestone Details -->
            <div class="flex-1 pt-1 space-y-0.5">
              <div class="flex items-center justify-between">
                <span class="text-sm font-bold text-slate-900 dark:text-white">{{ milestone.step }}</span>
                <span class="text-xs text-slate-400">{{ milestone.timestamp }}</span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Location: <strong>{{ milestone.location }}</strong>
              </p>
              <p class="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30 p-2 rounded border border-emerald-100 dark:border-emerald-900/40 mt-1">
                {{ milestone.notes }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

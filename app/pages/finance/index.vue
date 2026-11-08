<script setup lang="ts">
const { data: finance, refresh } = await useFetch('/api/finance')

const isAddModalOpen = ref(false)
const form = reactive({
  type: 'Expense',
  description: '',
  amount: 5000,
  category: 'Input Purchase',
  date: new Date().toISOString().split('T')[0]
})

const submitting = ref(false)
const typeFilter = ref('All')

const filteredTransactions = computed(() => {
  if (!finance.value?.transactions) return []
  if (typeFilter.value === 'All') return finance.value.transactions
  return finance.value.transactions.filter((t: any) => t.type === typeFilter.value)
})

const handleAddTransaction = async () => {
  if (!form.description || !form.amount) return
  submitting.value = true
  try {
    await $fetch('/api/finance', {
      method: 'POST',
      body: form
    })
    isAddModalOpen.value = false
    form.description = ''
    refresh()
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Farm Cash Flow &amp; Financial Ledger</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Audit-ready double entry records for crop sales, input expenses, and subsidies.</p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink to="/finance/forecast">
          <UButton color="neutral" variant="outline" icon="i-lucide-trending-up">
            Mandi Forecasts
          </UButton>
        </NuxtLink>
        <UButton color="primary" variant="solid" icon="i-lucide-plus" @click="isAddModalOpen = true">
          Record Transaction
        </UButton>
      </div>
    </div>

    <!-- Summary KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <!-- Income Card -->
      <div class="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div class="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider">Gross Produce Revenue</span>
          <UIcon name="i-lucide-arrow-down-left" class="w-4 h-4 text-emerald-600" />
        </div>
        <div class="text-2xl font-bold text-slate-900 dark:text-white">
          ₹{{ Number(finance?.summary?.income || 0).toLocaleString('en-IN') }}
        </div>
        <span class="text-xs text-emerald-600 font-medium block mt-1">Crop consignments &amp; DBT transfers</span>
      </div>

      <!-- Expense Card -->
      <div class="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div class="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider">Operational Expenditure</span>
          <UIcon name="i-lucide-arrow-up-right" class="w-4 h-4 text-rose-600" />
        </div>
        <div class="text-2xl font-bold text-slate-900 dark:text-white">
          ₹{{ Number(finance?.summary?.expense || 0).toLocaleString('en-IN') }}
        </div>
        <span class="text-xs text-rose-600 font-medium block mt-1">Seeds, bio-nutrients &amp; field labor</span>
      </div>

      <!-- Net Surplus Card -->
      <div class="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 shadow-xs">
        <div class="flex items-center justify-between text-emerald-800 dark:text-emerald-200 mb-2">
          <span class="text-xs font-semibold uppercase tracking-wider">Net Farm Surplus</span>
          <UIcon name="i-lucide-wallet" class="w-4 h-4 text-emerald-600" />
        </div>
        <div class="text-2xl font-bold text-emerald-800 dark:text-emerald-200">
          ₹{{ Number(finance?.summary?.netProfit || 0).toLocaleString('en-IN') }}
        </div>
        <span class="text-xs text-emerald-700 dark:text-emerald-300 font-medium block mt-1">
          {{ finance?.summary?.marginPercent }}% Operating Margin
        </span>
      </div>
    </div>

    <!-- Filter Tabs & Ledger Table -->
    <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
      <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
        <h2 class="text-base font-bold text-slate-900 dark:text-white">Transaction Journal</h2>
        <div class="flex items-center gap-1.5">
          <UButton
            v-for="t in ['All', 'Income', 'Expense']"
            :key="t"
            size="xs"
            :color="typeFilter === t ? 'primary' : 'neutral'"
            :variant="typeFilter === t ? 'solid' : 'ghost'"
            @click="typeFilter = t"
          >
            {{ t }}
          </UButton>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <th class="px-5 py-3.5">Date</th>
              <th class="px-4 py-3.5">Reference / TXN</th>
              <th class="px-4 py-3.5">Description</th>
              <th class="px-4 py-3.5">Category</th>
              <th class="px-4 py-3.5">Type</th>
              <th class="px-4 py-3.5 text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            <tr v-for="txn in filteredTransactions" :key="txn.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td class="px-5 py-3.5 text-xs text-slate-500">{{ txn.date }}</td>
              <td class="px-4 py-3.5 font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                {{ txn.referenceId }}
              </td>
              <td class="px-4 py-3.5 font-medium text-slate-900 dark:text-white">
                {{ txn.description }}
              </td>
              <td class="px-4 py-3.5 text-xs">
                <UBadge color="neutral" variant="subtle" size="xs">{{ txn.category }}</UBadge>
              </td>
              <td class="px-4 py-3.5">
                <span
                  :class="[
                    'text-xs font-semibold px-2 py-0.5 rounded-full inline-block',
                    txn.type === 'Income' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                  ]"
                >
                  {{ txn.type }}
                </span>
              </td>
              <td
                :class="[
                  'px-4 py-3.5 text-right font-bold',
                  txn.type === 'Income' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                ]"
              >
                {{ txn.type === 'Income' ? '+' : '-' }}₹{{ Number(txn.amount).toLocaleString('en-IN') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Record Transaction Modal -->
    <UModal v-model:open="isAddModalOpen" title="Record Ledger Transaction">
      <template #body>
        <form @submit.prevent="handleAddTransaction" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Transaction Type</label>
              <select
                v-model="form.type"
                class="w-full text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-slate-900 dark:text-white"
              >
                <option value="Expense">Expense / Input Cost</option>
                <option value="Income">Income / Produce Sale</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
              <UInput v-model.number="form.amount" type="number" required class="w-full" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <UInput v-model="form.description" placeholder="e.g. Sowing Seed Purchase from APMC" required class="w-full" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                v-model="form.category"
                class="w-full text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-slate-900 dark:text-white"
              >
                <option value="Crop Sales">Crop Sales</option>
                <option value="Input Purchase">Input Purchase (Seeds/Fertilizer)</option>
                <option value="Labor">Field Labor</option>
                <option value="Equipment">Drip &amp; Equipment</option>
                <option value="Logistics">Logistics &amp; Transport</option>
                <option value="Subsidies">Government Subsidy / DBT</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Date</label>
              <UInput v-model="form.date" type="date" required class="w-full" />
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3">
            <UButton color="neutral" variant="subtle" @click="isAddModalOpen = false">Cancel</UButton>
            <UButton color="primary" type="submit" :loading="submitting">Save Entry</UButton>
          </div>
        </form>
      </template>
    </UModal>
  </div>
</template>

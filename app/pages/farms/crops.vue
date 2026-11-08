<script setup lang="ts">
const route = useRoute()
const farmIdFilter = computed(() => route.query.farmId ? Number(route.query.farmId) : undefined)

const { data: crops, refresh: refreshCrops } = await useFetch('/api/crops', {
  query: { farmId: farmIdFilter }
})
const { data: farms } = await useFetch('/api/farms')

const isAddModalOpen = ref(false)
const form = reactive({
  farmId: farmIdFilter.value || 1,
  name: '',
  season: 'Rabi',
  areaSown: 10,
  sowDate: new Date().toISOString().split('T')[0],
  expectedHarvestDate: new Date(Date.now() + 110 * 86400000).toISOString().split('T')[0],
  targetYieldKg: 8000,
  status: 'Growing'
})

const submitting = ref(false)

const handleAddCrop = async () => {
  if (!form.name) return
  submitting.value = true
  try {
    await $fetch('/api/crops', {
      method: 'POST',
      body: form
    })
    isAddModalOpen.value = false
    form.name = ''
    refreshCrops()
  } finally {
    submitting.value = false
  }
}

const handleDeleteCrop = async (id: number) => {
  if (!confirm('Are you sure you want to remove this crop log?')) return
  await $fetch(`/api/crops/${id}`, { method: 'DELETE' })
  refreshCrops()
}

const getFarmName = (farmId: number) => {
  return farms.value?.find((f: any) => f.id === farmId)?.name || `Farm #${farmId}`
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Field &amp; Crop Lifecycle Tracking</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Sowing timelines, expected yield weights, and seasonal harvest schedules.</p>
      </div>

      <UButton
        color="primary"
        variant="solid"
        icon="i-lucide-plus"
        @click="isAddModalOpen = true"
      >
        Log Sown Crop
      </UButton>
    </div>

    <!-- Crops Table Container -->
    <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <th class="px-5 py-3.5">Crop Name</th>
              <th class="px-4 py-3.5">Farm Parcel</th>
              <th class="px-4 py-3.5">Season</th>
              <th class="px-4 py-3.5">Area Sown</th>
              <th class="px-4 py-3.5">Sowing Date</th>
              <th class="px-4 py-3.5">Target Yield</th>
              <th class="px-4 py-3.5">Status</th>
              <th class="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            <tr v-for="crop in crops" :key="crop.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td class="px-5 py-3.5 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <UIcon name="i-lucide-sprout" class="w-4 h-4 text-emerald-600" />
                {{ crop.name }}
              </td>
              <td class="px-4 py-3.5 text-xs text-slate-500">
                {{ getFarmName(crop.farmId) }}
              </td>
              <td class="px-4 py-3.5">
                <UBadge color="neutral" variant="subtle" size="xs">{{ crop.season }}</UBadge>
              </td>
              <td class="px-4 py-3.5 font-medium">{{ crop.areaSown }} Acres</td>
              <td class="px-4 py-3.5 text-xs text-slate-500">{{ crop.sowDate }}</td>
              <td class="px-4 py-3.5 font-medium">{{ Number(crop.targetYieldKg).toLocaleString() }} kg</td>
              <td class="px-4 py-3.5">
                <UBadge
                  :color="crop.status === 'Ready for Harvest' ? 'success' : crop.status === 'Growing' ? 'info' : 'neutral'"
                  variant="subtle"
                  size="xs"
                >
                  {{ crop.status }}
                </UBadge>
              </td>
              <td class="px-4 py-3.5 text-right">
                <UButton
                  size="xs"
                  color="error"
                  variant="ghost"
                  icon="i-lucide-trash-2"
                  @click="handleDeleteCrop(crop.id)"
                />
              </td>
            </tr>
            <tr v-if="!crops?.length">
              <td colspan="8" class="text-center py-8 text-sm text-slate-400">
                No crops logged for this farm yet. Click "Log Sown Crop" to begin.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <UModal v-model:open="isAddModalOpen" title="Log Sown Crop">
      <template #body>
        <form @submit.prevent="handleAddCrop" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Farm</label>
            <select
              v-model="form.farmId"
              class="w-full text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-slate-900 dark:text-white"
            >
              <option v-for="f in farms" :key="f.id" :value="f.id">{{ f.name }} ({{ f.location }})</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Crop Variety</label>
            <UInput v-model="form.name" placeholder="e.g. Sharbati Wheat (HD-2967)" required class="w-full" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Season</label>
              <select
                v-model="form.season"
                class="w-full text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-slate-900 dark:text-white"
              >
                <option value="Rabi">Rabi (Winter)</option>
                <option value="Kharif">Kharif (Monsoon)</option>
                <option value="Zaid">Zaid (Summer)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Area Sown (Acres)</label>
              <UInput v-model.number="form.areaSown" type="number" step="0.5" required class="w-full" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Sowing Date</label>
              <UInput v-model="form.sowDate" type="date" required class="w-full" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Yield (kg)</label>
              <UInput v-model.number="form.targetYieldKg" type="number" required class="w-full" />
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-4">
            <UButton color="neutral" variant="subtle" @click="isAddModalOpen = false">Cancel</UButton>
            <UButton color="primary" type="submit" :loading="submitting">Save Crop Log</UButton>
          </div>
        </form>
      </template>
    </UModal>
  </div>
</template>

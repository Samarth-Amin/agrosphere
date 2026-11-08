<script setup lang="ts">
const { data: farms, refresh } = await useFetch('/api/farms')

const isAddModalOpen = ref(false)
const form = reactive({
  name: '',
  location: '',
  areaAcres: 15,
  farmType: 'Organic',
  establishedYear: 2022
})

const submitting = ref(false)

const handleAddFarm = async () => {
  if (!form.name || !form.location) return
  submitting.value = true
  try {
    await $fetch('/api/farms', {
      method: 'POST',
      body: form
    })
    isAddModalOpen.value = false
    form.name = ''
    form.location = ''
    refresh()
  } finally {
    submitting.value = false
  }
}

const handleDeleteFarm = async (id: number) => {
  if (!confirm('Are you sure you want to delete this farm parcel?')) return
  await $fetch(`/api/farms/${id}`, { method: 'DELETE' })
  refresh()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Registered Farms &amp; Parcels</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage agricultural holdings, GPS coordinates, and soil certification.</p>
      </div>

      <UButton
        color="primary"
        variant="solid"
        icon="i-lucide-plus"
        @click="isAddModalOpen = true"
      >
        Register New Farm
      </UButton>
    </div>

    <!-- Farm Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="farm in farms"
        :key="farm.id"
        class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between"
      >
        <div>
          <div class="flex items-start justify-between gap-2 mb-3">
            <div class="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <UIcon name="i-lucide-map-pin" class="w-5 h-5" />
            </div>
            <UBadge :color="farm.status === 'Active' ? 'success' : 'neutral'" variant="subtle" size="xs">
              {{ farm.status }}
            </UBadge>
          </div>

          <h2 class="text-base font-bold text-slate-900 dark:text-white">{{ farm.name }}</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
            <UIcon name="i-lucide-navigation" class="w-3 h-3 text-slate-400" />
            {{ farm.location }}
          </p>

          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span class="text-slate-400 block text-[11px]">Total Area</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ farm.areaAcres }} Acres</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[11px]">Cultivation</span>
              <span class="font-semibold text-slate-800 dark:text-slate-200">{{ farm.farmType }}</span>
            </div>
          </div>
        </div>

        <div class="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <NuxtLink :to="`/farms/crops?farmId=${farm.id}`">
              <UButton size="xs" color="neutral" variant="subtle" icon="i-lucide-sprout">
                Crops
              </UButton>
            </NuxtLink>
            <NuxtLink :to="`/farms/inventory?farmId=${farm.id}`">
              <UButton size="xs" color="neutral" variant="subtle" icon="i-lucide-boxes">
                Inputs
              </UButton>
            </NuxtLink>
          </div>

          <UButton
            size="xs"
            color="error"
            variant="ghost"
            icon="i-lucide-trash-2"
            aria-label="Delete Farm"
            @click="handleDeleteFarm(farm.id)"
          />
        </div>
      </div>
    </div>

    <!-- Add Farm Modal Dialog -->
    <UModal v-model:open="isAddModalOpen" title="Register New Farm Parcel">
      <template #body>
        <form @submit.prevent="handleAddFarm" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Farm Name</label>
            <UInput v-model="form.name" placeholder="e.g. Narmada Valley Agrofields" required class="w-full" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location / District</label>
            <UInput v-model="form.location" placeholder="e.g. Bharuch, Gujarat" required class="w-full" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Acreage (Acres)</label>
              <UInput v-model.number="form.areaAcres" type="number" step="0.5" required class="w-full" />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Farm Type</label>
              <select
                v-model="form.farmType"
                class="w-full text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-slate-900 dark:text-white"
              >
                <option value="Organic">Organic</option>
                <option value="Mixed">Mixed Farming</option>
                <option value="Commercial">Commercial</option>
                <option value="Hydroponic">Hydroponic</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-4">
            <UButton color="neutral" variant="subtle" @click="isAddModalOpen = false">Cancel</UButton>
            <UButton color="primary" type="submit" :loading="submitting">Register Parcel</UButton>
          </div>
        </form>
      </template>
    </UModal>
  </div>
</template>

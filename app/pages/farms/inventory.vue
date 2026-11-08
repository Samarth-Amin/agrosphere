<script setup lang="ts">
const route = useRoute()
const farmIdFilter = computed(() => route.query.farmId ? Number(route.query.farmId) : undefined)

const { data: inventory, refresh } = await useFetch('/api/inventory', {
  query: { farmId: farmIdFilter }
})
const { data: farms } = await useFetch('/api/farms')

const isAddModalOpen = ref(false)
const form = reactive({
  farmId: farmIdFilter.value || 1,
  itemName: '',
  category: 'Fertilizer',
  quantity: 250,
  unit: 'kg',
  reorderLevel: 50,
  supplier: ''
})

const submitting = ref(false)

const handleAddItem = async () => {
  if (!form.itemName) return
  submitting.value = true
  try {
    await $fetch('/api/inventory', {
      method: 'POST',
      body: form
    })
    isAddModalOpen.value = false
    form.itemName = ''
    refresh()
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Warehouse &amp; Input Telemetry</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Stock levels for certified seeds, bio-nutrients, drip equipment, and bags.</p>
      </div>

      <UButton
        color="primary"
        variant="solid"
        icon="i-lucide-plus"
        @click="isAddModalOpen = true"
      >
        Receive Stock
      </UButton>
    </div>

    <!-- Inventory Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="item in inventory"
        :key="item.id"
        class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs"
      >
        <div class="flex items-start justify-between gap-2 mb-2">
          <UBadge color="neutral" variant="subtle" size="xs">{{ item.category }}</UBadge>
          <span
            v-if="item.quantity <= item.reorderLevel"
            class="text-[11px] font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-full flex items-center gap-1"
          >
            <UIcon name="i-lucide-alert-triangle" class="w-3 h-3" />
            Low Stock
          </span>
        </div>

        <h2 class="text-sm font-bold text-slate-900 dark:text-white mt-1">{{ item.itemName }}</h2>
        <p class="text-xs text-slate-400 mt-0.5">Supplier: {{ item.supplier }}</p>

        <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
          <div>
            <span class="text-2xl font-bold text-slate-900 dark:text-white">{{ item.quantity }}</span>
            <span class="text-xs text-slate-500 ml-1">{{ item.unit }}</span>
          </div>
          <span class="text-xs text-slate-400">Reorder at {{ item.reorderLevel }} {{ item.unit }}</span>
        </div>
      </div>
    </div>

    <!-- Receive Stock Modal -->
    <UModal v-model:open="isAddModalOpen" title="Receive Input Stock">
      <template #body>
        <form @submit.prevent="handleAddItem" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Farm Storage</label>
            <select
              v-model="form.farmId"
              class="w-full text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-slate-900 dark:text-white"
            >
              <option v-for="f in farms" :key="f.id" :value="f.id">{{ f.name }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Item Name</label>
            <UInput v-model="form.itemName" placeholder="e.g. Bio-Potash Granules" required class="w-full" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                v-model="form.category"
                class="w-full text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-slate-900 dark:text-white"
              >
                <option value="Seed">Seed</option>
                <option value="Fertilizer">Fertilizer / Compost</option>
                <option value="Pesticide">Bio Pesticide</option>
                <option value="Equipment">Drip &amp; Equipment</option>
                <option value="Packaging">Jute / Packaging</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Supplier</label>
              <UInput v-model="form.supplier" placeholder="e.g. State Bio Center" required class="w-full" />
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Quantity</label>
              <UInput v-model.number="form.quantity" type="number" required class="w-full" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Unit</label>
              <UInput v-model="form.unit" placeholder="kg / litres" required class="w-full" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Min Alert</label>
              <UInput v-model.number="form.reorderLevel" type="number" required class="w-full" />
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-4">
            <UButton color="neutral" variant="subtle" @click="isAddModalOpen = false">Cancel</UButton>
            <UButton color="primary" type="submit" :loading="submitting">Record Stock</UButton>
          </div>
        </form>
      </template>
    </UModal>
  </div>
</template>

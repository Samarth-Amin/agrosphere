<script setup lang="ts">
const searchQuery = ref('')
const { data: listings, refresh: refreshListings } = await useFetch('/api/market/listings')
const { data: farms } = await useFetch('/api/farms')

const filteredListings = computed(() => {
  if (!listings.value) return []
  if (!searchQuery.value) return listings.value
  return listings.value.filter((l: any) =>
    l.cropName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    l.location.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    l.grade.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Sell Produce Modal
const isSellModalOpen = ref(false)
const sellForm = reactive({
  cropName: '',
  quantity: 1000,
  unit: 'kg',
  pricePerUnit: 35,
  farmName: '',
  location: 'Ahmedabad APMC Hub',
  grade: 'Organic Certified'
})
const selling = ref(false)

const handleCreateListing = async () => {
  if (!sellForm.cropName) return
  selling.value = true
  try {
    await $fetch('/api/market/listings', {
      method: 'POST',
      body: sellForm
    })
    isSellModalOpen.value = false
    sellForm.cropName = ''
    refreshListings()
  } finally {
    selling.value = false
  }
}

// Buy Modal
const isBuyModalOpen = ref(false)
const selectedListing = ref<any>(null)
const buyQuantity = ref(100)
const deliveryAddress = ref('Gujarat Wholesale Hub, Sector 4')
const buying = ref(false)
const orderSuccess = ref<any>(null)

const openBuyModal = (item: any) => {
  selectedListing.value = item
  buyQuantity.value = Math.min(250, item.quantity)
  orderSuccess.value = null
  isBuyModalOpen.value = true
}

const handleBuyProduce = async () => {
  if (!selectedListing.value) return
  buying.value = true
  try {
    const res = await $fetch('/api/market/buy', {
      method: 'POST',
      body: {
        listingId: selectedListing.value.id,
        quantity: buyQuantity.value,
        deliveryAddress: deliveryAddress.value
      }
    })
    orderSuccess.value = res.order
    refreshListings()
  } finally {
    buying.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Produce Marketplace &amp; Direct Trade</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Direct farmer-to-buyer grain trade with verifiable batch certifications.</p>
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink to="/market/orders">
          <UButton color="neutral" variant="outline" icon="i-lucide-truck">
            My Orders &amp; Shipments
          </UButton>
        </NuxtLink>
        <UButton color="primary" variant="solid" icon="i-lucide-plus" @click="isSellModalOpen = true">
          List Crop for Sale
        </UButton>
      </div>
    </div>

    <!-- Filter & Search Bar -->
    <div class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3">
      <div class="flex-1">
        <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Search crop variety, mandi terminal, or grade..."
          class="w-full"
        />
      </div>
    </div>

    <!-- Marketplace Listings Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="item in filteredListings"
        :key="item.id"
        class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs flex flex-col justify-between"
      >
        <div>
          <div class="flex items-start justify-between gap-2 mb-2">
            <UBadge
              :color="item.grade.includes('Organic') ? 'success' : 'primary'"
              variant="subtle"
              size="xs"
            >
              {{ item.grade }}
            </UBadge>
            <span class="text-[11px] text-slate-400">Posted: {{ item.postedOn }}</span>
          </div>

          <h2 class="text-base font-bold text-slate-900 dark:text-white">{{ item.cropName }}</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
            <UIcon name="i-lucide-map-pin" class="w-3.5 h-3.5 text-emerald-600" />
            {{ item.farmName }} • {{ item.location }}
          </p>

          <div class="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 flex items-baseline justify-between">
            <div>
              <span class="text-2xl font-bold text-slate-900 dark:text-white">₹{{ item.pricePerUnit.toFixed(2) }}</span>
              <span class="text-xs text-slate-500 ml-1">/ {{ item.unit }}</span>
            </div>
            <div class="text-right">
              <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                {{ Number(item.quantity).toLocaleString() }} {{ item.unit }}
              </span>
              <span class="text-[10px] text-slate-400 uppercase tracking-wider">Available Lot</span>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span class="text-xs text-slate-500">Seller: <strong>{{ item.sellerName }}</strong></span>
          <UButton
            size="sm"
            color="primary"
            variant="solid"
            :disabled="item.quantity <= 0"
            @click="openBuyModal(item)"
          >
            {{ item.quantity > 0 ? 'Buy Lot' : 'Sold Out' }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- Buy Produce Modal Dialog -->
    <UModal v-model:open="isBuyModalOpen" :title="orderSuccess ? 'Purchase Confirmed' : `Buy ${selectedListing?.cropName}`">
      <template #body>
        <div v-if="orderSuccess" class="space-y-4 text-center py-2">
          <div class="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
            <UIcon name="i-lucide-check-circle" class="w-7 h-7" />
          </div>
          <h3 class="text-base font-bold text-slate-900 dark:text-white">Batch Generated &amp; Order Dispatched</h3>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">
            Your lot of <strong>{{ orderSuccess.quantity }} {{ orderSuccess.unit }}</strong> of {{ orderSuccess.cropName }} has been assigned batch code:
          </p>
          <div class="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 font-mono text-sm font-bold text-emerald-800 dark:text-emerald-200">
            {{ orderSuccess.batchCode }}
          </div>
          <div class="flex justify-center gap-3 pt-2">
            <NuxtLink :to="`/market/trace?batch=${orderSuccess.batchCode}`">
              <UButton color="primary" variant="solid" icon="i-lucide-qr-code">
                View Batch Traceability
              </UButton>
            </NuxtLink>
            <UButton color="neutral" variant="subtle" @click="isBuyModalOpen = false">Done</UButton>
          </div>
        </div>

        <form v-else @submit.prevent="handleBuyProduce" class="space-y-4">
          <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <div class="flex justify-between">
              <span>Unit Price:</span>
              <strong class="text-slate-900 dark:text-white">₹{{ selectedListing?.pricePerUnit.toFixed(2) }} / {{ selectedListing?.unit }}</strong>
            </div>
            <div class="flex justify-between">
              <span>Origin Farm:</span>
              <strong class="text-slate-900 dark:text-white">{{ selectedListing?.farmName }}</strong>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Quantity to Buy (Max {{ selectedListing?.quantity }} {{ selectedListing?.unit }})
            </label>
            <UInput
              v-model.number="buyQuantity"
              type="number"
              min="1"
              :max="selectedListing?.quantity"
              required
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Delivery Destination</label>
            <UInput v-model="deliveryAddress" required class="w-full" />
          </div>

          <div class="p-3 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-between">
            <span class="text-xs font-semibold text-emerald-900 dark:text-emerald-100">Total Purchase Value:</span>
            <span class="text-lg font-bold text-emerald-800 dark:text-emerald-200">
              ₹{{ (buyQuantity * (selectedListing?.pricePerUnit || 0)).toLocaleString('en-IN') }}
            </span>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <UButton color="neutral" variant="subtle" @click="isBuyModalOpen = false">Cancel</UButton>
            <UButton color="primary" type="submit" :loading="buying">Confirm Purchase</UButton>
          </div>
        </form>
      </template>
    </UModal>

    <!-- Create Listing Modal -->
    <UModal v-model:open="isSellModalOpen" title="List Crop for Sale">
      <template #body>
        <form @submit.prevent="handleCreateListing" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Crop Name &amp; Variety</label>
            <UInput v-model="sellForm.cropName" placeholder="e.g. Organic Sharbati Wheat" required class="w-full" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Origin Farm</label>
            <select
              v-model="sellForm.farmName"
              class="w-full text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-slate-900 dark:text-white"
            >
              <option v-for="f in farms" :key="f.id" :value="f.name">{{ f.name }} ({{ f.location }})</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Quantity</label>
              <UInput v-model.number="sellForm.quantity" type="number" required class="w-full" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Price per kg (₹)</label>
              <UInput v-model.number="sellForm.pricePerUnit" type="number" step="0.5" required class="w-full" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Quality Grade / Certification</label>
            <select
              v-model="sellForm.grade"
              class="w-full text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-slate-900 dark:text-white"
            >
              <option value="Organic Certified">Organic Certified (PGS-India)</option>
              <option value="A+ Premium">A+ Premium Export Grade</option>
              <option value="A Standard">A Standard Commercial</option>
            </select>
          </div>

          <div class="flex justify-end gap-2 pt-3">
            <UButton color="neutral" variant="subtle" @click="isSellModalOpen = false">Cancel</UButton>
            <UButton color="primary" type="submit" :loading="selling">Publish to Mandi</UButton>
          </div>
        </form>
      </template>
    </UModal>
  </div>
</template>

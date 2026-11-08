<script setup lang="ts">
const { data: orders } = await useFetch('/api/market/orders')

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
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Orders &amp; Consignment Dispatch</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time status of wholesale grain purchases and logistics transit.</p>
      </div>

      <NuxtLink to="/market">
        <UButton color="neutral" variant="outline" icon="i-lucide-arrow-left">
          Back to Marketplace
        </UButton>
      </NuxtLink>
    </div>

    <!-- Orders Table Container -->
    <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-sm">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/40 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <th class="px-5 py-3.5">Order / Batch Code</th>
              <th class="px-4 py-3.5">Crop Lot</th>
              <th class="px-4 py-3.5">Buyer</th>
              <th class="px-4 py-3.5">Total Value</th>
              <th class="px-4 py-3.5">Logistics Partner</th>
              <th class="px-4 py-3.5">Status</th>
              <th class="px-4 py-3.5 text-right">Traceability</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            <tr v-for="order in orders" :key="order.id" class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td class="px-5 py-3.5">
                <NuxtLink
                  :to="`/market/trace?batch=${order.batchCode}`"
                  class="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
                >
                  <UIcon name="i-lucide-qr-code" class="w-3.5 h-3.5" />
                  {{ order.batchCode }}
                </NuxtLink>
                <span class="text-[11px] text-slate-400 block mt-0.5">Ordered: {{ order.orderDate }}</span>
              </td>
              <td class="px-4 py-3.5">
                <span class="font-semibold text-slate-900 dark:text-white block">{{ order.cropName }}</span>
                <span class="text-xs text-slate-500">{{ order.quantity }} {{ order.unit }}</span>
              </td>
              <td class="px-4 py-3.5 text-xs">
                <span class="font-medium text-slate-800 dark:text-slate-200">{{ order.buyerName }}</span>
                <span class="text-slate-400 block text-[11px] truncate max-w-xs">{{ order.deliveryAddress }}</span>
              </td>
              <td class="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                ₹{{ Number(order.totalPrice).toLocaleString('en-IN') }}
              </td>
              <td class="px-4 py-3.5 text-xs">
                <span class="text-slate-800 dark:text-slate-200 block font-medium">{{ order.deliveryPartner }}</span>
                <span class="text-[11px] text-slate-400">Est. {{ order.estimatedDelivery }}</span>
              </td>
              <td class="px-4 py-3.5">
                <UBadge :color="orderStatusColor(order.status)" variant="subtle" size="xs">
                  {{ order.status }}
                </UBadge>
              </td>
              <td class="px-4 py-3.5 text-right">
                <NuxtLink :to="`/market/trace?batch=${order.batchCode}`">
                  <UButton size="xs" color="primary" variant="subtle" icon="i-lucide-shield-check">
                    Trace
                  </UButton>
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

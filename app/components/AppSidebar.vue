<script setup lang="ts">
const route = useRoute()

interface NavItem {
  label: string
  to: string
  icon: string
  badge?: string
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Executive Dashboard', to: '/', icon: 'i-lucide-layout-dashboard' }
    ]
  },
  {
    title: 'Farm Operations',
    items: [
      { label: 'Farms & Parcels', to: '/farms', icon: 'i-lucide-map-pin' },
      { label: 'Crops & Sowing', to: '/farms/crops', icon: 'i-lucide-sprout' },
      { label: 'Inputs & Warehouse', to: '/farms/inventory', icon: 'i-lucide-boxes' }
    ]
  },
  {
    title: 'Commerce & Trace',
    items: [
      { label: 'Produce Market', to: '/market', icon: 'i-lucide-shopping-bag' },
      { label: 'Orders & Dispatch', to: '/market/orders', icon: 'i-lucide-truck', badge: '3' },
      { label: 'Batch QR Trace', to: '/market/trace', icon: 'i-lucide-qr-code' }
    ]
  },
  {
    title: 'Financials & Policy',
    items: [
      { label: 'Farm Ledger & P&L', to: '/finance', icon: 'i-lucide-wallet' },
      { label: 'Mandi Price Forecast', to: '/finance/forecast', icon: 'i-lucide-trending-up', badge: 'Live' },
      { label: 'Govt Subsidies', to: '/finance/subsidies', icon: 'i-lucide-landmark' }
    ]
  },
  {
    title: 'Knowledge Network',
    items: [
      { label: 'Community Forum', to: '/community', icon: 'i-lucide-messages-square' }
    ]
  }
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <aside class="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 flex flex-col h-screen sticky top-0 shrink-0 z-30 select-none">
    <!-- Brand Header -->
    <div class="h-16 px-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2.5 focus:outline-none">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-sm shadow-emerald-700/20">
          <UIcon name="i-lucide-leaf" class="w-5 h-5" />
        </div>
        <div>
          <span class="font-bold text-base tracking-tight text-slate-900 dark:text-white block leading-tight">AgroSphere</span>
          <span class="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">Pro Enterprise</span>
        </div>
      </NuxtLink>
      <UBadge color="primary" variant="subtle" size="xs" class="font-mono text-[10px]">v2.4</UBadge>
    </div>

    <!-- Navigation Scroll Area -->
    <div class="flex-1 overflow-y-auto px-3 py-4 space-y-6">
      <div v-for="section in navSections" :key="section.title" class="space-y-1">
        <p class="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {{ section.title }}
        </p>
        <div class="space-y-0.5 pt-1">
          <NuxtLink
            v-for="item in section.items"
            :key="item.to"
            :to="item.to"
            :class="[
              'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
              isActive(item.to)
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60'
            ]"
          >
            <div class="flex items-center gap-2.5">
              <UIcon
                :name="item.icon"
                :class="[
                  'w-4 h-4 shrink-0 transition-colors',
                  isActive(item.to) ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                ]"
              />
              <span>{{ item.label }}</span>
            </div>
            <UBadge
              v-if="item.badge"
              :color="item.badge === 'Live' ? 'warning' : 'primary'"
              variant="subtle"
              size="xs"
              class="text-[10px] px-1.5 py-0"
            >
              {{ item.badge }}
            </UBadge>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Active Farmer Profile Card -->
    <div class="p-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40">
      <div class="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
        <div class="w-9 h-9 rounded-lg bg-emerald-700 text-white font-semibold flex items-center justify-center text-xs">
          SA
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">Samarth Amin</span>
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
          </div>
          <span class="text-[11px] text-slate-500 dark:text-slate-400 truncate block">Green Valley Farm • Lead</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: () => colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
})
</script>

<template>
  <header class="h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
    <!-- Left: Weather & Mandi Status Bar -->
    <div class="flex items-center gap-3">
      <div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-200">
        <UIcon name="i-lucide-sun" class="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
        <span class="font-medium">Ahmedabad Hub: 31°C • Kharif Season Optimal</span>
      </div>

      <div class="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
        <UIcon name="i-lucide-activity" class="w-3.5 h-3.5 text-emerald-600" />
        <span>AgriCommodity Mandi Index: <strong class="text-emerald-600 font-semibold">+3.8%</strong></span>
      </div>
    </div>

    <!-- Right Controls: Quick Add, Theme Toggle, Notification Badge -->
    <div class="flex items-center gap-2.5">
      <NuxtLink to="/market" class="inline-flex">
        <UButton
          size="sm"
          color="primary"
          variant="solid"
          icon="i-lucide-plus"
          class="font-medium"
        >
          Sell Produce
        </UButton>
      </NuxtLink>

      <NuxtLink to="/market/trace">
        <UButton
          size="sm"
          color="neutral"
          variant="subtle"
          icon="i-lucide-scan-line"
          class="font-medium hidden sm:inline-flex"
        >
          Verify Batch
        </UButton>
      </NuxtLink>

      <!-- Theme Switcher -->
      <UButton
        :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
        color="neutral"
        variant="ghost"
        size="sm"
        aria-label="Toggle Theme"
        @click="isDark = !isDark"
      />
    </div>
  </header>
</template>

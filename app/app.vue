<script setup lang="ts">
useHead({
  titleTemplate: '%s · AgroSphere Pro',
  title: 'Smart Agricultural Ecosystem',
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'Enterprise Agricultural Management, Crop Lifecycle, Mandi Marketplace & Batch Traceability' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;500;600;700;800&family=Public+Sans:wght@300;400;500;600;700&display=swap' }
  ]
})
</script>

<template>
  <UApp>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row antialiased font-sans">
      <!-- Left Persistent Sidebar -->
      <AppSidebar class="hidden md:flex" />

      <!-- Main Content Column -->
      <div class="flex-1 flex flex-col min-w-0 min-h-screen">
        <AppHeader />

        <!-- Router View Container -->
        <main class="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <NuxtPage />
        </main>
      </div>
    </div>
  </UApp>
</template>

<style>
body {
  font-family: 'Public Sans', system-ui, sans-serif;
}
h1, h2, h3, h4, .font-heading {
  font-family: 'Fira Sans', system-ui, sans-serif;
}
</style>

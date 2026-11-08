<script setup lang="ts">
const categoryFilter = ref('All')
const { data: posts, refresh } = await useFetch('/api/community/posts', {
  query: { category: computed(() => categoryFilter.value === 'All' ? undefined : categoryFilter.value) }
})

const categories = ['All', 'Organic Farming', 'Pest Control', 'Market Trends', 'AgTech', 'Crop Advisory']

// New Post Modal
const isAddPostModalOpen = ref(false)
const postForm = reactive({
  title: '',
  category: 'Organic Farming',
  content: '',
  authorName: 'Samarth Amin',
  role: 'Organic Agro Lead'
})
const posting = ref(false)

const handleCreatePost = async () => {
  if (!postForm.title || !postForm.content) return
  posting.value = true
  try {
    await $fetch('/api/community/posts', {
      method: 'POST',
      body: postForm
    })
    isAddPostModalOpen.value = false
    postForm.title = ''
    postForm.content = ''
    refresh()
  } finally {
    posting.value = false
  }
}

// Like Post
const handleLike = async (postId: number) => {
  await $fetch('/api/community/like', {
    method: 'POST',
    body: { postId }
  })
  refresh()
}

// Reply state
const activeReplyPostId = ref<number | null>(null)
const replyContent = ref('')
const replying = ref(false)

const handleAddReply = async (postId: number) => {
  if (!replyContent.value.trim()) return
  replying.value = true
  try {
    await $fetch('/api/community/reply', {
      method: 'POST',
      body: {
        postId,
        content: replyContent.value,
        authorName: 'Samarth Amin',
        role: 'Organic Agro Lead'
      }
    })
    replyContent.value = ''
    activeReplyPostId.value = null
    refresh()
  } finally {
    replying.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Agronomy Forum &amp; Peer Knowledge Hub</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Verified agricultural practitioners sharing field trials, organic regimens, and pest protocols.</p>
      </div>

      <UButton
        color="primary"
        variant="solid"
        icon="i-lucide-message-square-plus"
        @click="isAddPostModalOpen = true"
      >
        Start Discussion
      </UButton>
    </div>

    <!-- Category Pill Filter -->
    <div class="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <UButton
        v-for="cat in categories"
        :key="cat"
        size="xs"
        :color="categoryFilter === cat ? 'primary' : 'neutral'"
        :variant="categoryFilter === cat ? 'solid' : 'ghost'"
        class="rounded-lg"
        @click="categoryFilter = cat"
      >
        {{ cat }}
      </UButton>
    </div>

    <!-- Forum Thread Posts -->
    <div class="space-y-4">
      <div
        v-for="post in posts"
        :key="post.id"
        class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-bold flex items-center justify-center text-sm shrink-0">
              {{ post.authorName.charAt(0) }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-slate-900 dark:text-white">{{ post.authorName }}</span>
                <UBadge color="primary" variant="subtle" size="xs">{{ post.role }}</UBadge>
              </div>
              <span class="text-xs text-slate-400">{{ post.postedOn }}</span>
            </div>
          </div>

          <UBadge color="neutral" variant="subtle" size="xs">{{ post.category }}</UBadge>
        </div>

        <div>
          <h2 class="text-base font-bold text-slate-900 dark:text-white">{{ post.title }}</h2>
          <p class="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            {{ post.content }}
          </p>
        </div>

        <!-- Likes & Reply Actions -->
        <div class="flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <button
            class="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-emerald-600 font-semibold transition-colors cursor-pointer"
            @click="handleLike(post.id)"
          >
            <UIcon name="i-lucide-thumbs-up" class="w-4 h-4 text-emerald-600" />
            <span>{{ post.likes }} Helpful</span>
          </button>

          <button
            class="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-emerald-600 font-semibold transition-colors cursor-pointer"
            @click="activeReplyPostId = activeReplyPostId === post.id ? null : post.id"
          >
            <UIcon name="i-lucide-message-circle" class="w-4 h-4 text-slate-400" />
            <span>{{ post.replies?.length || 0 }} Answers</span>
          </button>
        </div>

        <!-- Replies List -->
        <div v-if="post.replies?.length" class="space-y-3 pt-2 pl-4 border-l-2 border-emerald-200 dark:border-emerald-900/60">
          <div
            v-for="reply in post.replies"
            :key="reply.id"
            class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 space-y-1 text-xs"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800 dark:text-slate-200">{{ reply.authorName }} ({{ reply.role }})</span>
              <span class="text-[11px] text-slate-400">{{ reply.repliedOn }}</span>
            </div>
            <p class="text-slate-600 dark:text-slate-300">{{ reply.content }}</p>
          </div>
        </div>

        <!-- Add Reply Form -->
        <div v-if="activeReplyPostId === post.id" class="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div class="flex gap-2">
            <UInput
              v-model="replyContent"
              placeholder="Write your agricultural answer or advice..."
              class="flex-1 text-xs"
            />
            <UButton
              size="sm"
              color="primary"
              variant="solid"
              :loading="replying"
              @click="handleAddReply(post.id)"
            >
              Post Answer
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Discussion Modal -->
    <UModal v-model:open="isAddPostModalOpen" title="Start Agronomy Discussion">
      <template #body>
        <form @submit.prevent="handleCreatePost" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Topic Title</label>
            <UInput v-model="postForm.title" placeholder="e.g. Drip fertilization schedule for Kasturi Basmati" required class="w-full" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <select
              v-model="postForm.category"
              class="w-full text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-slate-900 dark:text-white"
            >
              <option value="Organic Farming">Organic Farming</option>
              <option value="Crop Advisory">Crop Advisory</option>
              <option value="Pest Control">Pest Control</option>
              <option value="Market Trends">Market Trends</option>
              <option value="AgTech">AgTech &amp; Equipment</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Detailed Findings / Question</label>
            <textarea
              v-model="postForm.content"
              rows="4"
              placeholder="Share dosage, sowing days, observation notes, or questions for fellow farmers..."
              required
              class="w-full text-sm rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            ></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <UButton color="neutral" variant="subtle" @click="isAddPostModalOpen = false">Cancel</UButton>
            <UButton color="primary" type="submit" :loading="posting">Publish Thread</UButton>
          </div>
        </form>
      </template>
    </UModal>
  </div>
</template>

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const postId = Number(body.postId)
  const post = db.forumPosts.find(p => p.id === postId)

  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  }

  post.likes += 1
  return { success: true, likes: post.likes }
})

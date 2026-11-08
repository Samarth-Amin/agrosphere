export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const postId = Number(body.postId)
  const post = db.forumPosts.find(p => p.id === postId)

  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  }
  if (!body.content) {
    throw createError({ statusCode: 400, statusMessage: 'Reply content cannot be empty' })
  }

  const allReplies = db.forumPosts.flatMap(p => p.replies)
  const newReply = {
    id: allReplies.length ? Math.max(...allReplies.map(r => r.id)) + 1 : 1,
    postId,
    userId: body.userId ? Number(body.userId) : 1,
    authorName: body.authorName || 'Samarth Amin',
    role: body.role || 'Farmer',
    content: body.content,
    repliedOn: new Date().toISOString().replace('T', ' ').slice(0, 16)
  }

  post.replies.push(newReply)
  return newReply
})

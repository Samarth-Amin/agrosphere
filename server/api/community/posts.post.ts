export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.title || !body.content) {
    throw createError({ statusCode: 400, statusMessage: 'Title and content are required' })
  }

  const newPost = {
    id: db.forumPosts.length ? Math.max(...db.forumPosts.map(p => p.id)) + 1 : 1,
    userId: body.userId ? Number(body.userId) : 1,
    authorName: body.authorName || 'Samarth Amin',
    role: body.role || 'Organic Agro Lead',
    title: body.title,
    content: body.content,
    category: (body.category || 'Organic Farming') as any,
    likes: 0,
    postedOn: new Date().toISOString().replace('T', ' ').slice(0, 16),
    replies: []
  }

  db.forumPosts.push(newPost)
  return newPost
})

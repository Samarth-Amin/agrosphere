export default defineEventHandler((event) => {
  const query = getQuery(event)
  let posts = [...db.forumPosts]
  if (query.category) {
    posts = posts.filter(p => p.category === query.category)
  }
  return posts.reverse()
})

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const userId = query.userId ? Number(query.userId) : 1
  return db.farms.filter(f => f.userId === userId)
})

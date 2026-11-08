export default defineEventHandler((event) => {
  const query = getQuery(event)
  if (query.category) {
    return db.subsidies.filter(s => s.category.toLowerCase().includes(String(query.category).toLowerCase()))
  }
  return db.subsidies
})

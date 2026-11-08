export default defineEventHandler((event) => {
  const query = getQuery(event)
  if (query.farmId) {
    return db.crops.filter(c => c.farmId === Number(query.farmId))
  }
  return db.crops
})

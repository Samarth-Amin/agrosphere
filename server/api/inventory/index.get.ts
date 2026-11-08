export default defineEventHandler((event) => {
  const query = getQuery(event)
  if (query.farmId) {
    return db.inventory.filter(i => i.farmId === Number(query.farmId))
  }
  return db.inventory
})

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  const index = db.farms.findIndex(f => f.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Farm not found' })
  }
  const removed = db.farms.splice(index, 1)[0]
  // Also cleanup related crops and inventory
  db.crops = db.crops.filter(c => c.farmId !== id)
  db.inventory = db.inventory.filter(i => i.farmId !== id)
  return { success: true, removed }
})

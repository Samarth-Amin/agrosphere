export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  const index = db.crops.findIndex(c => c.id === id)
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Crop not found' })
  }
  const removed = db.crops.splice(index, 1)[0]
  return { success: true, removed }
})

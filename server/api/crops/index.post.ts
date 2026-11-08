export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.name || !body.farmId) {
    throw createError({ statusCode: 400, statusMessage: 'Crop name and farmId are required' })
  }

  const newCrop = {
    id: db.crops.length ? Math.max(...db.crops.map(c => c.id)) + 1 : 1,
    farmId: Number(body.farmId),
    name: body.name,
    season: (body.season || 'Rabi') as any,
    areaSown: Number(body.areaSown) || 5,
    sowDate: body.sowDate || new Date().toISOString().split('T')[0],
    expectedHarvestDate: body.expectedHarvestDate || new Date(Date.now() + 120 * 86400000).toISOString().split('T')[0],
    status: (body.status || 'Growing') as any,
    targetYieldKg: Number(body.targetYieldKg) || 5000
  }

  db.crops.push(newCrop)
  return newCrop
})

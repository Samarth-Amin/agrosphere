export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.name || !body.location) {
    throw createError({ statusCode: 400, statusMessage: 'Name and location are required' })
  }

  const newFarm = {
    id: db.farms.length ? Math.max(...db.farms.map(f => f.id)) + 1 : 1,
    userId: body.userId ? Number(body.userId) : 1,
    name: body.name,
    location: body.location,
    areaAcres: Number(body.areaAcres) || 10,
    farmType: body.farmType || 'Mixed',
    status: (body.status || 'Active') as any,
    establishedYear: Number(body.establishedYear) || new Date().getFullYear()
  }

  db.farms.push(newFarm)
  return newFarm
})

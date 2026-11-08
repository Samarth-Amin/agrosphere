export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.itemName || !body.farmId) {
    throw createError({ statusCode: 400, statusMessage: 'Item name and farmId are required' })
  }

  const newItem = {
    id: db.inventory.length ? Math.max(...db.inventory.map(i => i.id)) + 1 : 1,
    farmId: Number(body.farmId),
    itemName: body.itemName,
    category: (body.category || 'Seed') as any,
    quantity: Number(body.quantity) || 0,
    unit: body.unit || 'kg',
    reorderLevel: Number(body.reorderLevel) || 50,
    supplier: body.supplier || 'Agro Inputs Cooperative'
  }

  db.inventory.push(newItem)
  return newItem
})

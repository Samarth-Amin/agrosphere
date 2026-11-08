export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.cropName || !body.pricePerUnit || !body.quantity) {
    throw createError({ statusCode: 400, statusMessage: 'Crop name, quantity, and price are required' })
  }

  const newListing = {
    id: db.listings.length ? Math.max(...db.listings.map(l => l.id)) + 1 : 1,
    userId: body.userId ? Number(body.userId) : 1,
    sellerName: body.sellerName || 'Samarth Amin',
    cropName: body.cropName,
    farmName: body.farmName || 'Green Valley Organic Estate',
    location: body.location || 'Ahmedabad APMC Hub',
    quantity: Number(body.quantity),
    unit: body.unit || 'kg',
    pricePerUnit: Number(body.pricePerUnit),
    status: 'Available' as const,
    grade: (body.grade || 'Organic Certified') as any,
    postedOn: new Date().toISOString().split('T')[0]
  }

  db.listings.push(newListing)
  return newListing
})

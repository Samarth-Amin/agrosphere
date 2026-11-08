export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const listingId = Number(body.listingId)
  const qty = Number(body.quantity) || 10
  const listing = db.listings.find(l => l.id === listingId)

  if (!listing) {
    throw createError({ statusCode: 404, statusMessage: 'Listing not found' })
  }
  if (listing.quantity < qty) {
    throw createError({ statusCode: 400, statusMessage: `Only ${listing.quantity} ${listing.unit} available` })
  }

  // Deduct inventory
  listing.quantity -= qty
  if (listing.quantity <= 0) {
    listing.status = 'Sold Out'
  }

  const randomSuffix = Math.floor(1000 + Math.random() * 9000)
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const batchCode = `AGRO-${dateStr}-${randomSuffix}`

  const totalAmount = qty * listing.pricePerUnit

  const newOrder = {
    id: db.orders.length ? Math.max(...db.orders.map(o => o.id)) + 1 : 101,
    listingId,
    buyerId: body.buyerId ? Number(body.buyerId) : 3,
    buyerName: body.buyerName || 'Anita Patel (Verified Buyer)',
    cropName: listing.cropName,
    quantity: qty,
    unit: listing.unit,
    totalPrice: totalAmount,
    batchCode,
    status: 'Confirmed' as const,
    orderDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
    estimatedDelivery: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    deliveryPartner: 'AgroExpress Smart Logistics Fleet',
    deliveryAddress: body.deliveryAddress || 'Gujarat Agro District Hub, Sector 4',
    currentLocation: `${listing.farmName} Grading & Packaging Shed`
  }

  db.orders.push(newOrder)

  // Record seller transaction
  db.transactions.push({
    id: db.transactions.length ? Math.max(...db.transactions.map(t => t.id)) + 1 : 1,
    userId: listing.userId,
    type: 'Income',
    description: `Marketplace Order #${newOrder.id} (${listing.cropName} - ${qty}${listing.unit})`,
    amount: totalAmount,
    category: 'Crop Sales',
    date: new Date().toISOString().split('T')[0],
    referenceId: batchCode
  })

  return { success: true, order: newOrder }
})

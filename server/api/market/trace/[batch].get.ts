export default defineEventHandler((event) => {
  const batchCode = getRouterParam(event, 'batch')
  const order = db.orders.find(o => o.batchCode.toLowerCase() === batchCode?.toLowerCase())

  if (!order) {
    throw createError({ statusCode: 404, statusMessage: `Batch #${batchCode} not found in blockchain registry` })
  }

  const listing = db.listings.find(l => l.id === order.listingId)
  const farm = db.farms.find(f => f.userId === listing?.userId)

  return {
    batchCode: order.batchCode,
    cropName: order.cropName,
    quantity: order.quantity,
    unit: order.unit,
    status: order.status,
    orderDate: order.orderDate,
    estimatedDelivery: order.estimatedDelivery,
    deliveryPartner: order.deliveryPartner,
    deliveryAddress: order.deliveryAddress,
    currentLocation: order.currentLocation,
    origin: {
      farmName: listing?.farmName || farm?.name || 'Green Valley Organic Estate',
      location: farm?.location || 'Ahmedabad, Gujarat',
      farmType: farm?.farmType || 'Organic',
      farmer: listing?.sellerName || 'Samarth Amin',
      certification: listing?.grade || 'Organic Certified - PGS-India ID: IN-GJ-2024-8841'
    },
    milestones: [
      { step: 'Harvest & Field Grading', timestamp: '2026-11-04 07:30', location: farm?.name || 'Green Valley Farm', status: 'Completed', notes: 'Moisture content tested: 11.2%, Quality Grade: Premium A+' },
      { step: 'Batch Packaging & Tamper-Sealing', timestamp: '2026-11-05 11:00', location: 'Ahmedabad APMC Hub', status: 'Completed', notes: 'Packed in eco-friendly 50kg jute containers with QR tag' },
      { step: 'Transit Dispatch', timestamp: '2026-11-06 08:45', location: 'Gujarat Agro Corridor', status: order.status === 'Processing at Hub' ? 'Pending' : 'Completed', notes: order.deliveryPartner },
      { step: 'Final Hub Arrival & Distribution', timestamp: '2026-11-09 16:00 (Est)', location: order.deliveryAddress, status: order.status === 'Delivered' ? 'Completed' : 'In Progress', notes: order.currentLocation }
    ]
  }
})

export default defineEventHandler((event) => {
  const query = getQuery(event)
  let orders = [...db.orders]
  if (query.status) {
    orders = orders.filter(o => o.status === query.status)
  }
  return orders.reverse()
})

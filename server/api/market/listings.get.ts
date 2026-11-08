export default defineEventHandler((event) => {
  const query = getQuery(event)
  let items = [...db.listings]
  if (query.crop) {
    items = items.filter(l => l.cropName.toLowerCase().includes(String(query.crop).toLowerCase()))
  }
  if (query.status) {
    items = items.filter(l => l.status === query.status)
  }
  return items.reverse()
})

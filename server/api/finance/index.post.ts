export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body.description || !body.amount) {
    throw createError({ statusCode: 400, statusMessage: 'Description and amount are required' })
  }

  const newTxn = {
    id: db.transactions.length ? Math.max(...db.transactions.map(t => t.id)) + 1 : 1,
    userId: body.userId ? Number(body.userId) : 1,
    type: (body.type || 'Expense') as 'Income' | 'Expense',
    description: body.description,
    amount: Number(body.amount),
    category: (body.category || 'Input Purchase') as any,
    date: body.date || new Date().toISOString().split('T')[0],
    referenceId: `TXN-${Math.floor(1000 + Math.random() * 9000)}`
  }

  db.transactions.push(newTxn)
  return newTxn
})

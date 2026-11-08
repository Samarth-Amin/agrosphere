export default defineEventHandler((event) => {
  const query = getQuery(event)
  const userId = query.userId ? Number(query.userId) : 1
  const txns = db.transactions.filter(t => t.userId === userId)

  const income = txns.filter(t => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0)
  const expense = txns.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0)
  const netProfit = income - expense

  return {
    transactions: [...txns].reverse(),
    summary: {
      income,
      expense,
      netProfit,
      marginPercent: income > 0 ? ((netProfit / income) * 100).toFixed(1) : 0
    }
  }
})

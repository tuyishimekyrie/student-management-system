import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([])

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const result = await window.api.ipcRenderer.invoke('get-expenses')
        if (result.success) {
          setExpenses(result.expenses)
        } else {
          toast.error('Failed to fetch expenses.')
        }
      } catch (error) {
        toast.error('An error occurred while fetching expenses.')
      }
    }

    fetchExpenses()
  }, [])

  const downloadPDF = () => {
    const doc = new jsPDF()
    const tableColumn = ['ID', 'Description', 'Amount', 'Person', 'Created Date']
    const tableRows = expenses.map((expense) => [
      expense.id,
      expense.description,
      `$${expense.amount.toFixed(2)}`,
      expense.person,
      new Date(expense.created_date).toLocaleString()
    ])

    doc.autoTable(tableColumn, tableRows, { startY: 20 })
    doc.text('Expense Report', 14, 15)
    doc.save('expenses-report.pdf')
  }

  return (
    <div className="p-4 text-black overflow-auto">
      <Toaster />
      <div className="flex justify-between py-4">
        <h2 className="text-2xl mb-4">Expense List</h2>
        <button onClick={downloadPDF} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
          Download PDF Report
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-cyan-500 border-b">
            <th className="py-2 px-4 border-r">ID</th>
            <th className="py-2 px-4 border-r">Description</th>
            <th className="py-2 px-4 border-r">Amount</th>
            <th className="py-2 px-4 border-r">Person</th>
            <th className="py-2 px-4 border-r">Created Date</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <tr key={expense.id} className="border-b">
                <td className="py-2 px-4 border-r">{expense.id}</td>
                <td className="py-2 px-4 border-r">{expense.description}</td>
                <td className="py-2 px-4 border-r">${expense.amount.toFixed(2)}</td>
                <td className="py-2 px-4 border-r">{expense.person}</td>
                <td className="py-2 px-4 border-r">
                  {new Date(expense.created_date).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-2 px-4 text-center">
                No expenses available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ExpenseList

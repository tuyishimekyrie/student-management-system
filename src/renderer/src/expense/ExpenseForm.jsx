import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

const ExpenseForm = () => {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [person, setPerson] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    window.api.ipcRenderer.invoke('add-expense', { description, amount, person }).then((result) => {
      if (result.success) {
        toast.success('Expense added successfully!')
        setDescription('')
        setAmount('')
        setPerson('')
      } else {
        toast.error('Failed to add expense.')
      }
    })
  }

  return (
    <div className="p-4 text-black">
      <Toaster />
      <h2 className="text-2xl mb-4">Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-2 border w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 p-2 border w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Person:</label>
          <input
            type="text"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            className="mt-1 p-2 border w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Expense
        </button>
      </form>
    </div>
  )
}

export default ExpenseForm

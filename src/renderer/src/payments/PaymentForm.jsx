import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'

const PaymentForm = () => {
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const result = await window.api.ipcRenderer.invoke('get-students-by-name')
        if (result.success) {
          setStudents(result.students)
        } else {
          toast.error('Failed to fetch students.')
        }
      } catch (error) {
        toast.error('An error occurred while fetching students.')
      }
    }

    fetchStudents()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const result = await window.api.ipcRenderer.invoke('add-payment', {
        studentId: selectedStudent,
        amount: parseFloat(amount)
      })
      if (result.success) {
        toast.success('Payment added successfully!')
        setSelectedStudent('')
        setAmount('')
      } else {
        toast.error('Failed to add payment.')
      }
    } catch (error) {
      toast.error('An error occurred while adding payment.')
    }
  }

  return (
    <div className="p-4 text-black">
      <Toaster />
      <h2 className="text-2xl mb-4">Add Payment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Student:</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="mt-1 p-2 border w-full"
            required
          >
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstname} {student.lastname}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Amount:</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 p-2 border w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Payment
        </button>
      </form>
    </div>
  )
}

export default PaymentForm

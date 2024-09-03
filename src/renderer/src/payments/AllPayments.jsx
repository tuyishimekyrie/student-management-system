import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'

const AllPaymentList = () => {
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [payments, setPayments] = useState([])
  const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const result = await window.api.ipcRenderer.invoke('get-students')
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

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const result = showAll
          ? await window.api.ipcRenderer.invoke('get-all-payments')
          : await window.api.ipcRenderer.invoke('get-payments', selectedStudent)

        if (result.success) {
          setPayments(result.payments)
        } else {
          toast.error('Failed to fetch payments.')
        }
      } catch (error) {
        toast.error('An error occurred while fetching payments.')
      }
    }

    fetchPayments()
  }, [selectedStudent, showAll])

  // Function to calculate the total amount
  const calculateTotalAmount = (payments) => {
    return payments.reduce((total, payment) => total + payment.amount, 0).toFixed(2)
  }

  return (
    <div className="p-4 text-black">
      <Toaster />
      <h2 className="text-2xl mb-4">Payments</h2>
      <div className="mb-4">
        <button
          onClick={() => setShowAll(true)}
          className={`px-4 py-2 mr-2 rounded ${showAll ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Show All Payments
        </button>
        <button
          onClick={() => setShowAll(false)}
          className={`px-4 py-2 rounded ${!showAll ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Filter by Student
        </button>
      </div>
      {!showAll && (
        <div className="mb-4">
          <label className="block text-sm font-medium">Select Student:</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="mt-1 p-2 border w-full"
          >
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstname} {student.lastname}
              </option>
            ))}
          </select>
        </div>
      )}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-2 px-4 border-r">ID</th>

            <th className="py-2 px-4 border-r">Student ID</th>
            <th className="py-2 px-4 border-r">Amount</th>
            <th className="py-2 px-4 border-r">Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            <>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b">
                  <td className="py-2 px-4 border-r">{payment.id}</td>
                  <td className="py-2 px-4 border-r">{payment.student_id}</td>
                  <td className="py-2 px-4 border-r">${payment.amount.toFixed(2)}</td>
                  <td className="py-2 px-4 border-r">
                    {new Date(payment.payment_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-300">
                <td colSpan="2" className="py-2 px-4 border-r text-right">
                  Total:
                </td>
                <td className="py-2 px-4 border-r">${calculateTotalAmount(payments)}</td>
                <td className="py-2 px-4 border-r"></td>
              </tr>
            </>
          ) : (
            <tr>
              <td colSpan="4" className="py-2 px-4 text-center">
                No payments available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AllPaymentList

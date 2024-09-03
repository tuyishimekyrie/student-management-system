import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const PaymentList = () => {
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [payments, setPayments] = useState([])

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
    if (selectedStudent) {
      const fetchPayments = async () => {
        try {
          const result = await window.api.ipcRenderer.invoke('get-payments', selectedStudent)
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
    } else {
      setPayments([])
    }
  }, [selectedStudent])

  // Calculate total amount
  const totalAmount = payments.reduce((total, payment) => total + payment.amount, 0)

  const downloadReport = () => {
    try {
      const doc = new jsPDF()
      doc.text('Payment Report', 14, 16)

      // Define table content
      const tableBody = payments.map((payment) => [
        payment.id,
        `$${payment.amount.toFixed(2)}`,
        new Date(payment.payment_date).toLocaleDateString()
      ])

      // Add table to PDF
      doc.autoTable({
        startY: 22,
        head: [['ID', 'Amount', 'Date']],
        body: tableBody,
        theme: 'striped'
      })

      // Add total amount to PDF
      const totalText = `Total: $${totalAmount.toFixed(2)}`
      const pageHeight = doc.internal.pageSize.height
      const textY = pageHeight - 30 // Position for total text

      doc.text(totalText, 14, textY)

      doc.save('payment-report.pdf')
      toast.success('Report saved successfully!')
    } catch (error) {
      toast.error('Failed to save report.')
    }
  }

  return (
    <div className="p-4 text-black overflow-auto">
      <Toaster />
      <h2 className="text-2xl mb-4">Payments</h2>
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
      <button onClick={downloadReport} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded">
        Download Report
      </button>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-2 px-4 border-r">ID</th>
            <th className="py-2 px-4 border-r">Amount</th>
            <th className="py-2 px-4 border-r">Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <tr key={payment.id} className="border-b">
                <td className="py-2 px-4 border-r">{payment.id}</td>
                <td className="py-2 px-4 border-r">${payment.amount.toFixed(2)}</td>
                <td className="py-2 px-4 border-r">
                  {new Date(payment.payment_date).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="py-2 px-4 text-center">
                No payments available
              </td>
            </tr>
          )}
          {/* Summary Row */}
          {payments.length > 0 && (
            <tr className="bg-blue-400 font-bold">
              <td className="py-2 px-4 border-r">Total</td>
              <td className="py-2 px-4 border-r">${totalAmount.toFixed(2)}</td>
              <td className="py-2 px-4"></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default PaymentList

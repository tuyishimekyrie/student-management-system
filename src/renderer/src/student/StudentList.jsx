import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const StudentList = () => {
  const [students, setStudents] = useState([])

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const result = await window.api.ipcRenderer.invoke('get-students')
        if (result.success) {
          setStudents(result.students)
          console.log(students)
          // Log totals to the console
          console.log('Total Tuition Fee:', calculateTotalTuitionFee())
          console.log('Total Amount Paid:', calculateTotalAmountPaid())
          console.log('Total Total Tuition:', calculateTotalTotalTuition())
        } else {
          toast.error('Failed to fetch students.')
        }
      } catch (error) {
        toast.error('An error occurred while fetching students.')
      }
    }

    fetchStudents()
  }, [])

  // Functions to calculate totals
  const calculateTotalTuitionFee = () =>
    students.reduce((total, student) => total + student.tuition_fee, 0).toFixed(2)
  const calculateTotalAmountPaid = () =>
    students.reduce((total, student) => total + student.amount_paid, 0).toFixed(2)
  const calculateTotalTotalTuition = () =>
    students.reduce((total, student) => total + student.total_tuition, 0).toFixed(2)

  const downloadReport = () => {
    try {
      const doc = new jsPDF()

      doc.text('Student List Report', 14, 16)
      doc.autoTable({
        startY: 22,
        head: [
          ['First Name', 'Last Name', 'Contact', 'Email', 'Program', 'Tuition Fee', 'Amount Paid']
        ],
        body: students.map((student) => [
          student.firstname,
          student.lastname,
          student.contact,
          student.email,
          student.program_name,
          `$${student.tuition_fee.toFixed(2)}`
        ]),
        theme: 'striped',
        foot: [['', '', '', '', '', `Total Tuition Fee: $${calculateTotalTuitionFee()}`]]
      })

      doc.save('student-report.pdf')
      setTimeout(() => toast.success('Report saved successfully!'), 5000)
    } catch (error) {
      setTimeout(() => toast.error('Failed to save report.'), 4000)
    }
  }

  return (
    <div className="p-4 text-black overflow-auto">
      <Toaster />
      <div className="flex justify-between py-4">
        <h2 className="text-2xl mb-4">Students</h2>
        <button onClick={downloadReport} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded">
          Download Report
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-green-500 border-b text-sm">
            <th className="py-2 px-4 border-r">First Name</th>
            <th className="py-2 px-4 border-r">Last Name</th>
            <th className="py-2 px-4 border-r">Contact</th>
            <th className="py-2 px-4 border-r">Email</th>
            <th className="py-2 px-4 border-r">Program</th>
            <th className="py-2 px-4 border-r">Tuition Fee</th>
            <th className="py-2 px-4 border-r">Amount Paid</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            <>
              {students.map((student) => (
                <tr key={student.id} className="border-b text-sm bg-slate-300">
                  <td className="py-2 px-4 border-r">{student.firstname}</td>
                  <td className="py-2 px-4 border-r">{student.lastname}</td>
                  <td className="py-2 px-4 border-r">{student.contact}</td>
                  <td className="py-2 px-4 border-r">{student.email}</td>
                  <td className="py-2 px-4 border-r text-xs">{student.program_name}</td>
                  <td className="py-2 px-4 border-r">{student.tuition_fee.toFixed(2)}</td>
                  <td className="py-2 px-4 border-r">{student.amount_paid.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td colSpan="5" className="py-2 px-4 border-r text-right">
                  Total:
                </td>
                <td className="py-2 px-4 border-r">{calculateTotalTuitionFee()}</td>
                <td className="py-2 px-4 border-r">{calculateTotalAmountPaid()}</td>
                {/* <td className="py-2 px-4 border-r">{calculateTotalTotalTuition()}</td> */}
              </tr>
            </>
          ) : (
            <tr>
              <td colSpan="8" className="py-2 px-4 text-center">
                No students available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default StudentList

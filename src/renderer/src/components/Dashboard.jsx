import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Line } from 'react-chartjs-2'
import 'chart.js/auto' // Importing necessary chart.js modules

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalAmountPaid, setTotalAmountPaid] = useState(0)
  const [totalPrograms, setTotalPrograms] = useState(0)
  const [paymentData, setPaymentData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResult = await window.api.ipcRenderer.invoke('get-total-users')
        const amountResult = await window.api.ipcRenderer.invoke('get-total-amount-paid')
        const programsResult = await window.api.ipcRenderer.invoke('get-total-programs')
        const paymentsResult = await window.api.ipcRenderer.invoke('get-all-payments') // Fetch payment history

        if (
          usersResult.success &&
          amountResult.success &&
          programsResult.success &&
          paymentsResult.success
        ) {
          setTotalUsers(usersResult.totalUsers)
          setTotalAmountPaid(amountResult.totalAmountPaid)
          setTotalPrograms(programsResult.totalPrograms)
          setPaymentData(paymentsResult.payments) // Set payment data for chart
        } else {
          toast.error('Failed to fetch dashboard data.')
        }
      } catch (error) {
        toast.error('An error occurred while fetching dashboard data.')
      }
    }

    fetchData()
  }, [])

  // Prepare data for chart
  const chartData = {
    labels: paymentData.map((payment) => new Date(payment.payment_date).toLocaleDateString()),
    datasets: [
      {
        label: 'Amount Paid Over Time',
        data: paymentData.map((payment) => payment.amount),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }
    ]
  }

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        min: Math.min(...paymentData.map((payment) => payment.amount)) * 0.8, // Set min slightly below the minimum value
        max: Math.max(...paymentData.map((payment) => payment.amount)) * 10 // Set max slightly above the maximum value
      }
    }
  }

  return (
    <div className="flex  bg-gray-100 text-black overflow-hidden">
      <Toaster />
      <div className="flex-1 p-8">
        <h1 className="text-xl font-bold mb-2">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-green-400 shadow-md rounded-lg p-6 flex items-center justify-between">
            <h2 className=" font-bold mb-2 text-base">Total Users</h2>
            <p className="text-xl">{totalUsers}</p>
          </div>
          <div className="bg-orange-400 shadow-md rounded-lg p-6 flex items-center justify-between">
            <h2 className="text-base font-bold mb-2">Amount Paid</h2>
            <p className="text-xl">{totalAmountPaid}</p>
          </div>
          <div className="bg-emerald-500 shadow-md rounded-lg p-6 flex items-center justify-between">
            <h2 className="text-base font-bold mb-2">Programs</h2>
            <p className="text-xl">{totalPrograms}</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">Payment History</h2>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

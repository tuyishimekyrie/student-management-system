import { NavLink } from 'react-router-dom'
import { FaHome, FaPlus, FaList, FaDollarSign, FaUser, FaMoneyBillWave } from 'react-icons/fa'

const navItems = [
  { to: '/', label: 'Home', icon: <FaHome /> },
  { to: '/programform', label: 'Add Program', icon: <FaPlus /> },
  { to: '/programlist', label: 'View Programs', icon: <FaList /> },
  { to: '/expenseform', label: 'Add Expense', icon: <FaDollarSign /> },
  { to: '/view-expenses', label: 'View Expenses', icon: <FaDollarSign /> },
  { to: '/studentform', label: 'Add Student', icon: <FaUser /> },
  { to: '/studentslist', label: 'View Students', icon: <FaList /> },
  { to: '/paymentform', label: 'Add Payment', icon: <FaMoneyBillWave /> },
  { to: '/paymentlist', label: 'Payment for Student', icon: <FaMoneyBillWave /> },
  { to: '/allpaymentlist', label: 'All Payments', icon: <FaMoneyBillWave /> }
]

const Sidebar = () => {
  const linkClasses = (isActive) =>
    `w-full block p-4 ${isActive ? 'bg-gray-900 text-blue-400' : 'hover:bg-gray-700'} flex items-center space-x-2`

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <h2 className="text-2xl font-semibold p-4">Dashboard</h2>
      <ul className="flex flex-col space-y-2 pt-8">
        {navItems.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink to={to} className={({ isActive }) => linkClasses(isActive)}>
              {icon}
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar

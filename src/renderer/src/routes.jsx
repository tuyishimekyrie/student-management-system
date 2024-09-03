import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import ProgramForm from './components/ProgramForm'
import ProgramList from './components/ProgramList'
import ExpenseForm from './expense/ExpenseForm'
import ExpenseList from './expense/ExpenseList'
import StudentList from './student/StudentList'
import PaymentForm from './payments/PaymentForm'
import PaymentList from './payments/PaymentList'
import StudentForm from './student/StudentForm'
import { createHashRouter } from 'react-router-dom'
import AllPaymentList from './payments/AllPayments'

export const router = createHashRouter([
  {
    path: '/',
    element: <Layout />, // Use Layout as the parent component
    children: [
      {
        index: true, // This means the default route ("/") will render Dashboard
        element: <Dashboard />
      },
      {
        path: 'programform',
        element: <ProgramForm />
      },
      {
        path: 'programlist',
        element: <ProgramList />
      },
      {
        path: 'expenseform',
        element: <ExpenseForm />
      },
      {
        path: '/view-expenses',
        element: <ExpenseList />
      },
      {
        path: '/studentslist',
        element: <StudentList />
      },
      {
        path: '/studentform',
        element: <StudentForm />
      },
      {
        path: '/paymentform',
        element: <PaymentForm />
      },
      {
        path: '/paymentlist',
        element: <PaymentList />
      },
      {
        path: '/allpaymentlist',
        element: <AllPaymentList />
      }
    ]
  }
])

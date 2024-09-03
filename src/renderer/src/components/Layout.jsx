import { Outlet } from 'react-router-dom'
import Sidebar from './sidebar'

const Layout = () => {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1  bg-gray-100 overflow-scroll">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout

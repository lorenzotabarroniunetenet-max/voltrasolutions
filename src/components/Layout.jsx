import Navbar from './Navbar'
import Sidebar from './Sidebar'

export default function Layout({ children, withSidebar = true }) {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <div className="flex">
        {withSidebar && <Sidebar />}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}

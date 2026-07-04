import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/features/dashboard/components/Sidebar'
import { Navbar } from '@/features/dashboard/components/Navbar'
import { useSidebar } from '@/hooks/useSidebar'
import { cn } from '@/lib/utils'

export function DashboardLayout() {
  const { isOpen, toggle } = useSidebar()

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - fixed position on the left */}
      <Sidebar isOpen={isOpen} onToggle={toggle} />

      {/* Main content area - shifts based on sidebar width */}
      <div
        className={cn(
          'flex flex-col min-h-screen transition-all duration-300',
          isOpen ? 'lg:pl-[280px]' : 'lg:pl-[72px]'
        )}
      >
        <Navbar />
        
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/features/dashboard/components/Sidebar'
import { Navbar } from '@/features/dashboard/components/Navbar'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useSidebar } from '@/hooks/useSidebar'
import { cn } from '@/lib/utils'

export function DashboardLayout() {
  const { isOpen, isMobileOpen, toggle, toggleMobile, closeMobile, setIsMobileOpen } = useSidebar()

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar isOpen={isOpen} onToggle={toggle} />
      </div>

      {/* Mobile Sidebar - Sheet overlay */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <Sidebar isOpen={true} onToggle={closeMobile} />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div
        className={cn(
          'flex flex-col min-h-screen transition-all duration-300',
          'lg:pl-[280px]'
        )}
      >
        <Navbar onMenuClick={toggleMobile} />
        
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
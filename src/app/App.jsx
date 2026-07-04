import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { NotificationProvider } from '@/context/NotificationContext'
import AppRoutes from '@/routes/AppRoutes'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <TooltipProvider delayDuration={300}>
            <div className="min-h-screen bg-background">
              <AppRoutes />
            </div>
          </TooltipProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
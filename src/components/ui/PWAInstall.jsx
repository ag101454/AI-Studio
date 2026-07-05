import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    console.log('Install outcome:', outcome)
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        >
          <div className="bg-white rounded-2xl border border-malt-200 shadow-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-turmeric-500 to-turmeric-600 shrink-0">
                <Smartphone size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground text-sm">Install AI Studio</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Install for quick access and offline use
                </p>
                <div className="flex gap-2 mt-3">
                  <Button onClick={handleInstall} size="sm" className="gap-1.5 rounded-lg text-xs"
                    style={{ background: 'linear-gradient(135deg, #c8870a, #9e6b08)', color: '#fdfaf2' }}>
                    <Download size={13} />
                    Install
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowPrompt(false)} className="text-xs rounded-lg">
                    Not now
                  </Button>
                </div>
              </div>
              <button onClick={() => setShowPrompt(false)} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
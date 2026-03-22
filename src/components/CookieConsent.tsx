import { useState, useEffect } from 'react'
import { Cookie } from 'lucide-react'

const COOKIE_KEY = 'questia_cookies_accepted'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const accepted = localStorage.getItem(COOKIE_KEY)
    if (!accepted) {
      setVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_KEY, 'true')
    setVisible(false)
  }

  const handleReject = (e: React.MouseEvent) => {
    e.preventDefault()
    localStorage.setItem(COOKIE_KEY, 'false')
    setVisible(false)
  }

  if (!mounted || !visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9998] bg-surface/95 backdrop-blur-md border-t border-white/10 p-4 shadow-2xl">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Cookie className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-slate-300">
            <p className="font-medium text-white mb-1">Utilizamos cookies</p>
            <p className="text-xs text-slate-400">
              QuestIA usa cookies para mejorar tu experiencia. 
              <a href="/politica-privacidad" className="text-primary hover:underline ml-1">Más información</a>
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleReject}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Rechazar
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
import { useEffect, useRef, useState } from 'react'
import { Outlet, useRouterState } from '@tanstack/react-router'
import Sidebar from './Sidebar'
import Header from './Header'

export default function MainLayout() {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  // Fermer le tiroir ; le focus reviendra sur le bouton burger (voir effet 4)
  const closeNav = () => {
    restoreFocus.current = true
    setIsNavOpen(false)
  }

  // 1. Changement de page → on ferme le tiroir
  useEffect(() => {
    setIsNavOpen(false)
  }, [pathname])

  // 2. Touche Échap → on ferme le tiroir
  useEffect(() => {
    if (!isNavOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeNav()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isNavOpen])

  // 3. Passage en largeur desktop (≥ 768 px) → on ferme le tiroir
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsNavOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // 4. Tiroir ouvert → le reste de la page devient « inerte » :
  //    ni clic, ni Tab, ni lecteur d'écran. Le focus reste dans le menu.
  //    À la fermeture, on rend le focus au burger APRÈS avoir retiré inert
  //    (on ne peut pas donner le focus à un élément inerte).
  useEffect(() => {
    if (contentRef.current) contentRef.current.inert = isNavOpen
    if (!isNavOpen && restoreFocus.current) {
      restoreFocus.current = false
      menuButtonRef.current?.focus()
    }
  }, [isNavOpen])

  return (
    <div className="flex h-dvh bg-background">
      {/* Lien d'évitement : premier élément atteint au clavier, invisible sinon.
          Retiré quand le tiroir est ouvert, pour que Tab reste dans le menu. */}
      {!isNavOpen && (
        <a
          href="#main-content"
          className="skip-link"
          z
        >
          Aller au contenu principal
        </a>
      )}

      {/* Fond sombre derrière le tiroir (mobile uniquement) — clic = fermer */}
      {isNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/40 md:hidden"
          onClick={closeNav}
          aria-hidden="true"
        />
      )}

      <Sidebar isOpen={isNavOpen} onClose={closeNav} />

      <div ref={contentRef} className="flex flex-col flex-1 min-w-0">
        <Header
          onOpenNav={() => setIsNavOpen(true)}
          isNavOpen={isNavOpen}
          menuButtonRef={menuButtonRef}
        />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto p-4 md:p-6 bg-background focus:outline-none"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
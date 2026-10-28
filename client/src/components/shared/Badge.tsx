import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode   // le texte affiché dans la pastille
  className: string     // les couleurs, fournies par celui qui l'utilise
}


export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  )
}
interface LogoMarkProps {
  className?: string
  alt?: string
}

export function LogoMark({ className = 'size-9', alt = '' }: LogoMarkProps) {
  return (
    <img
      src="/plidea-symbole.svg"
      alt={alt}
      className={className}
    />
  )
}
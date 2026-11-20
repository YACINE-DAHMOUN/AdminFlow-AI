interface BrandNameProps {
  className?: string
  accentClassName?: string
}

export function BrandName({
  className = '',
  accentClassName = 'text-sidebar-primary',
}: BrandNameProps) {
  return (
    <span className={`font-heading ${className}`}>
      Plid<span className={accentClassName}>é</span>a
    </span>
  )
}
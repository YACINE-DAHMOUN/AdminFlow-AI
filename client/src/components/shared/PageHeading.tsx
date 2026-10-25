interface PageHeadingProps {
  eyebrow?: string
  title: string
  description?: string
}

export function PageHeading({ eyebrow, title, description }: PageHeadingProps) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          {eyebrow}
        </p>
      )}
      <h1
        className="text-2xl font-bold text-foreground"
        style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}
      >
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
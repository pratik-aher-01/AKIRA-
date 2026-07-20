import Image from 'next/image'
import Link from 'next/link'

type BrandProps = {
  compact?: boolean
  href?: string
  showTitle?: boolean
}

export function Brand({
  compact = false,
  href = '/',
  showTitle = true,
}: BrandProps) {
  const logoSize = compact ? 32 : 38

  return (
    <Link
      href={href}
      className="flex items-center gap-2.5"
      style={{ textDecoration: 'none' }}
    >
      <div
        className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-[0_8px_24px_rgba(0,0,0,0.22)]"
        style={{ width: logoSize, height: logoSize }}
      >
        <Image
          src="/akira-logo.png"
          alt="Akira logo"
          fill
          sizes={`${logoSize}px`}
          className="object-cover"
          priority
        />
      </div>

      {showTitle && (
        <span className="font-syne text-lg font-bold tracking-tight text-white/95">
          Akira
        </span>
      )}
    </Link>
  )
}

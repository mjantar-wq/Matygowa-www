import Link from 'next/link'

/** Odnośnik do widoku statystyk pod menu panelu. */
export function StatystykiLink() {
  return (
    <div style={{ padding: '0 var(--base)' }}>
      <Link href="/panel/statystyki" style={{ color: 'inherit', textDecoration: 'none' }}>
        Statystyki strony
      </Link>
    </div>
  )
}

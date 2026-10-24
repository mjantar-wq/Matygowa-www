import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="mo-section mo-container">
      <h1 className="mo-h1">Nie ma takiej strony · Page not found</h1>
      <p>
        <Link href="/">Matygowa Osada</Link>
      </p>
    </section>
  )
}

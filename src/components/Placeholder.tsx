/** Wyraźnie oznaczone miejsce na treść, która jeszcze nie jest w panelu. */
export function Placeholder({ label, note }: { label: string; note?: string }) {
  return (
    <div className="mo-placeholder" role="note">
      <div>
        <strong>{label}</strong>
        {note ? <p>{note}</p> : null}
      </div>
    </div>
  )
}

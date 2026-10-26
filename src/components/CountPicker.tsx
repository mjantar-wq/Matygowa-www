'use client'

import { useEffect, useId, useState } from 'react'
import { listLength, parseCount } from '@/lib/count-picker'

/**
 * Liczba osób (Michał, 26.10.2026, jak na stronie rezerwacji IceColdRes): lista podpowiedzi na początku do 14,
 * a przewinięta do końca dokłada kolejne liczby; można też wpisać liczbę ręcznie. Własna lista zamiast natywnego
 * select, bo tego przewijania nie da się śledzić (zwłaszcza na telefonie). Wpisana liczba liczy się po wyjściu z pola
 * albo Enter, wybrana z listy od razu; liczba spoza zakresu zostaje w polu z komunikatem.
 */
export function CountPicker({
  value,
  onChange,
  min,
  max,
  label,
  rangeMessage,
  invalid,
  describedBy,
  inputRef,
}: {
  value: number | null
  onChange: (n: number | null) => void
  min: number
  max: number
  /** nazwa pola (aria-label: bez niej nazwą byłby cały tekst etykiety razem z listą) */
  label: string
  /** komunikat przy liczbie spoza zakresu, z {min} i {max} */
  rangeMessage: string
  invalid?: boolean
  describedBy?: string
  inputRef?: React.Ref<HTMLInputElement>
}) {
  const id = useId()
  const [text, setText] = useState(value === null ? '' : String(value))
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(0)
  const [active, setActive] = useState<number | null>(null)
  // pasek nisko na ekranie (hero): lista otwiera się w górę, żeby była cała widoczna
  const [up, setUp] = useState(false)
  const show = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (!open) {
      const r = e.currentTarget.getBoundingClientRect()
      setUp(window.innerHeight - r.bottom < 260 && r.top > 260)
    }
    setOpen(true)
  }
  // nowa wartość z zewnątrz trafia do pola; liczba spoza zakresu zostaje w polu z komunikatem (wartość jest wtedy pusta)
  const [shownValue, setShownValue] = useState(value)
  if (value !== shownValue) {
    setShownValue(value)
    if (!(value === null && text.trim() !== '' && parseCount(text, min, max) === null)) setText(value === null ? '' : String(value))
  }
  const shown = listLength(min, max, count, Math.max(value ?? min, active ?? min))
  useEffect(() => {
    if (open && active !== null) document.getElementById(`${id}-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active, id])

  const typed = parseCount(text, min, max)
  const wrong = text.trim() !== '' && typed === null
  const commit = (n: number | null) => {
    if (n !== null || !wrong) setText(n === null ? '' : String(n))
    setOpen(false)
    setActive(null)
    if (n !== value) onChange(n)
  }
  const move = (delta: number) => {
    setOpen(true)
    const from = active ?? value ?? min - 1
    setActive(Math.min(max, Math.max(min, from + delta)))
  }

  return (
    <span className="mo-picker">
      <input
        ref={inputRef}
        role="combobox"
        inputMode="numeric"
        autoComplete="off"
        placeholder="--"
        value={text}
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        aria-activedescendant={open && active !== null ? `${id}-${active}` : undefined}
        aria-label={label}
        aria-invalid={invalid || wrong || undefined}
        aria-describedby={[describedBy, wrong ? `${id}-err` : undefined].filter(Boolean).join(' ') || undefined}
        onFocus={show}
        onClick={show}
        onChange={(e) => {
          setText(e.target.value)
          setOpen(true)
          setActive(parseCount(e.target.value, min, max))
        }}
        // jak w natywnym select: podświetlona strzałkami pozycja liczy się też po Tab
        onBlur={() => commit(open && active !== null ? active : typed)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            move(1)
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            move(-1)
          } else if (e.key === 'Escape') setOpen(false)
          else if (e.key === 'Enter') {
            // Enter wybiera liczbę, nie wysyła formularza
            e.preventDefault()
            commit(open && active !== null ? active : typed)
          }
        }}
      />
      {open ? (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          className="mo-picker__list"
          data-up={up || undefined}
          onScroll={(e) => {
            const el = e.currentTarget
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) setCount((c) => Math.max(c, shown) + 10)
          }}
        >
          {Array.from({ length: shown }, (_, i) => i + min).map((n) => (
            <li
              key={n}
              id={`${id}-${n}`}
              role="option"
              aria-selected={n === (active ?? value)}
              // bez utraty fokusu w polu (blur zatwierdziłby wpisany tekst przed wyborem)
              onMouseDown={(e) => e.preventDefault()}
              // preventDefault: bez aktywacji etykiety, która kliknęłaby pole i otworzyła listę ponownie
              onClick={(e) => {
                e.preventDefault()
                commit(n)
              }}
            >
              {n}
            </li>
          ))}
        </ul>
      ) : null}
      {wrong ? (
        <span id={`${id}-err`} className="mo-picker__error">
          {rangeMessage.replace('{min}', String(min)).replace('{max}', String(max))}
        </span>
      ) : null}
    </span>
  )
}

'use client'

import { useEffect } from 'react'
import { captureUtm } from '@/lib/utm'

/** Zapamiętuje utm_* z adresu wejścia, żeby trafiły do silnika rezerwacji z każdej podstrony. */
export function UtmCapture(): null {
  useEffect(() => {
    captureUtm(window.location.search)
  }, [])
  return null
}

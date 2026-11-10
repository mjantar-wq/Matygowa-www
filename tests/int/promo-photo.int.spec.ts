import { describe, expect, it } from 'vitest'
import { promoPhoto } from '@/lib/promo-photo'

const photo = { id: 'p1', src: 'https://cdn.example/photos/p1', width: 3000, height: 2000, widths: [2000, 480, 1200, 828], format: 'webp', focusX: 0.25, focusY: 0.8, placeholder: 'data:image/jpeg;base64,AAAA', alt: 'Zima w Matygowej' }

describe('zdjęcie główne promocji z IceColdRes', () => {
  it('buduje src, srcset i punkt ostrości z pola photo', () => {
    const p = promoPhoto(photo, 'Tytuł promocji')!
    expect(p.src).toBe('https://cdn.example/photos/p1/1200.webp')
    expect(p.srcSet).toBe('https://cdn.example/photos/p1/480.webp 480w, https://cdn.example/photos/p1/828.webp 828w, https://cdn.example/photos/p1/1200.webp 1200w, https://cdn.example/photos/p1/2000.webp 2000w')
    expect(p.position).toBe('25% 80%')
    expect(p.width).toBe(1200)
    expect(p.height).toBe(800)
    expect(p.alt).toBe('Zima w Matygowej')
    expect(p.placeholder).toBe(photo.placeholder)
  })

  it('JPEG dostaje rozszerzenie jpg, brak alt bierze tytuł promocji, brak ostrości to środek', () => {
    const p = promoPhoto({ ...photo, format: 'jpeg', alt: '', focusX: null, focusY: undefined, width: null, height: null }, 'Tytuł promocji')!
    expect(p.src).toBe('https://cdn.example/photos/p1/1200.jpg')
    expect(p.alt).toBe('Tytuł promocji')
    expect(p.position).toBe('50% 50%')
    expect(p.width).toBeUndefined()
  })

  it('bez pola, bez szerokości albo bez adresu zwraca null (karta bierze zdjęcie z galerii)', () => {
    expect(promoPhoto(null, 'x')).toBeNull()
    expect(promoPhoto(undefined, 'x')).toBeNull()
    expect(promoPhoto({ ...photo, widths: [] }, 'x')).toBeNull()
    expect(promoPhoto({ ...photo, widths: undefined }, 'x')).toBeNull()
    expect(promoPhoto({ ...photo, src: '' }, 'x')).toBeNull()
  })

  it('jedyny wariant mniejszy niż 1200 px jest używany bez srcset, a ostrość poza 0–1 jest przycinana', () => {
    const p = promoPhoto({ ...photo, widths: [800], focusX: 4, focusY: -1, placeholder: 'http://zly' }, 'x')!
    expect(p.src).toBe('https://cdn.example/photos/p1/800.webp')
    expect(p.srcSet).toBeUndefined()
    expect(p.position).toBe('100% 0%')
    expect(p.placeholder).toBeNull()
  })
})

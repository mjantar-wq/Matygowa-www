import { SelectField } from '@payloadcms/ui'
import type { TextFieldServerComponent } from 'payload'
import { getAllPromotions } from '@/lib/icecoldres'

/**
 * Wybór promocji z cennika IceColdRes zamiast wpisywania ID (ID nadaje IceColdRes i nie da się go zmienić).
 * Pole zostaje tekstowe, więc zapisane oferty działają bez migracji.
 */
export const PromotionField: TextFieldServerComponent = async ({ clientField, path, value }) => {
  const { promotions } = await getAllPromotions()
  const options = promotions.map((p) => ({
    value: p.id,
    label: `${p.badge}${p.stayFrom || p.stayTo ? ` (${p.stayFrom ?? '…'} – ${p.stayTo ?? '…'})` : ''}${p.bookableNow ? '' : ' · nieaktywna'}`,
  }))
  // promocja usunięta w IceColdRes: zostaje widoczna, żeby było wiadomo, co zmienić
  if (typeof value === 'string' && value && !options.some((o) => o.value === value)) {
    options.unshift({ value, label: `${value} · brak w IceColdRes` })
  }
  const { name, label, required, localized } = clientField
  return (
    <SelectField
      field={{ type: 'select', name, label, required, localized, options, admin: { description: clientField.admin?.description, isClearable: true } }}
      path={path}
    />
  )
}

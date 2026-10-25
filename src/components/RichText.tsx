import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { fillTree, hasMarks, requestLocale, termVars } from '@/lib/terms'

/** Treść z panelu; znaczniki {checkin}, {deposit}… dostają aktualne dane z IceColdRes (src/lib/terms.ts). */
export async function RichText({ data, className = 'mo-prose' }: { data?: SerializedEditorState | null; className?: string }) {
  if (!data?.root?.children?.length) return null
  const filled = hasMarks(JSON.stringify(data)) ? fillTree(data, await termVars(requestLocale().locale)) : data
  return <LexicalRichText data={filled} className={className} />
}

import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export function RichText({ data, className = 'mo-prose' }: { data?: SerializedEditorState | null; className?: string }) {
  if (!data?.root?.children?.length) return null
  return <LexicalRichText data={data} className={className} />
}

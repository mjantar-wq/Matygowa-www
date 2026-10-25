import type { MetadataRoute } from 'next'

/** Ikony do ekranu głównego telefonu: sygnet (parzenica w kole) na jasnym tle strony. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Matygowa Osada',
    short_name: 'Matygowa',
    start_url: '/',
    display: 'browser',
    background_color: '#f1f3f2',
    theme_color: '#f1f3f2',
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/brand/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}

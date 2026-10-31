/**
 * Zgody na pliki cookies (RODO, Google Consent Mode v2). Wybór gościa zapisujemy w ciasteczku
 * `mo_zgody` na 12 miesięcy; z domeną nadrzędną (NEXT_PUBLIC_CONSENT_DOMAIN, np. .matygowaosada.pl)
 * ten sam wybór odczyta silnik rezerwacji, więc gość nie widzi drugiego banera.
 */
export const CONSENT_COOKIE = 'mo_zgody'
/** Zmiana treści banera albo listy narzędzi: podnieś wersję, a gość zostanie zapytany ponownie. */
export const CONSENT_VERSION = 1
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 365
/** Zdarzenie okna otwierające ustawienia zgód (link w stopce). */
export const OPEN_CONSENT_EVENT = 'mo:zgody'

export interface ConsentChoice {
  v: number
  analytics: boolean
  marketing: boolean
}

export function parseConsent(raw: string | undefined | null): ConsentChoice | null {
  if (!raw) return null
  try {
    const c = JSON.parse(decodeURIComponent(raw))
    return c?.v === CONSENT_VERSION ? { v: c.v, analytics: !!c.analytics, marketing: !!c.marketing } : null
  } catch {
    return null
  }
}

/** Sygnały Consent Mode v2 dla wyboru gościa. Niezbędne (bezpieczeństwo) są zawsze dozwolone. */
export function consentSignals(c: Pick<ConsentChoice, 'analytics' | 'marketing'>) {
  const g = (on: boolean) => (on ? 'granted' : 'denied')
  return {
    analytics_storage: g(c.analytics),
    ad_storage: g(c.marketing),
    ad_user_data: g(c.marketing),
    ad_personalization: g(c.marketing),
  }
}

/**
 * Skrypt uruchamiany przed GTM: domyślnie wszystko odrzucone, potem zapisany wybór z ciasteczka.
 * Bez tego GTM wystartowałby przed zgodą (wymóg Consent Mode: „default” przed pierwszym tagiem).
 */
export function consentBootScript() {
  return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
gtag('set','ads_data_redaction',true);gtag('set','url_passthrough',true);
try{var m=document.cookie.match(/(?:^|; )${CONSENT_COOKIE}=([^;]*)/);var c=m&&JSON.parse(decodeURIComponent(m[1]));
if(c&&c.v===${CONSENT_VERSION}){var g=function(b){return b?'granted':'denied'};gtag('consent','update',{analytics_storage:g(c.analytics),ad_storage:g(c.marketing),ad_user_data:g(c.marketing),ad_personalization:g(c.marketing)});dataLayer.push({event:'consent_ready',consent_analytics:!!c.analytics,consent_marketing:!!c.marketing})}}catch(e){}`
}

/**
 * GTM startuje po załadowaniu strony (zdarzenie load + chwila bezczynności, najpóźniej po 3 s), żeby jego ~125 KB
 * i kolejne tagi nie konkurowały z kadrem hero i czcionkami o łącze. Zdarzenia z dataLayer (zgody, kliknięcia)
 * czekają w kolejce i GTM przetwarza je po starcie; 'gtm.start' zapisujemy od razu, więc czas wizyty się nie przesuwa.
 */
export const gtmScript = (id: string) =>
  `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var go=function(){if(go.d)return;go.d=1;var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f)};var idle=function(){w.requestIdleCallback?w.requestIdleCallback(go,{timeout:3000}):setTimeout(go,1500)};d.readyState==='complete'?idle():w.addEventListener('load',idle);setTimeout(go,6000)})(window,document,'script','dataLayer',${JSON.stringify(id)});`

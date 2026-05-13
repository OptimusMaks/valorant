import { Platform } from 'react-native';

const PIXEL_ID = '2176268816474026';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Session flag so React Strict Mode (dev) does not double-fire `Lead` on the same account view. */
export const META_PIXEL_LEAD_SESSION_KEY = `fbq_lead_${PIXEL_ID}`;

export function metaPixelTrackLead(): void {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  window.fbq?.('track', 'Lead');
}

/** SPA: call on each funnel step so Events Manager sees a page view per screen (not only first HTML load). */
export function metaPixelTrackPageView(screen: string): void {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  window.fbq?.('track', 'PageView', { content_name: screen });
}

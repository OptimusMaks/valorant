import { Platform } from 'react-native';

declare const process:
  | {
      env?: Record<string, string | undefined>;
    }
  | undefined;

const CHARGED_PAY_API_BASE_URL = 'https://chargedpay.com/api/v1';

export const chargedPayConfig = {
  apiBaseUrl: readEnv('EXPO_PUBLIC_CHARGEDPAY_API_BASE_URL') ?? CHARGED_PAY_API_BASE_URL,
  paymentBoxIds: ['62c92239-4b79-47a3-9356-9b4626f9e7af'],
  projectId: '4b147c71-791a-4f99-a28a-938488cb3cc1',
} as const;

export function getPaymentRedirectUrls() {
  const siteOrigin = readEnv('EXPO_PUBLIC_PAYMENT_SITE_ORIGIN') ?? getWebOrigin();

  if (!siteOrigin) {
    throw new Error('Payment site origin is not configured');
  }

  const cleanOrigin = siteOrigin.replace(/\/+$/, '');

  return {
    failureUrl: readEnv('EXPO_PUBLIC_PAYMENT_FAILURE_URL') ?? `${cleanOrigin}/#payment=failure`,
    returnUrl: readEnv('EXPO_PUBLIC_PAYMENT_RETURN_URL') ?? `${cleanOrigin}/`,
    successUrl: readEnv('EXPO_PUBLIC_PAYMENT_SUCCESS_URL') ?? `${cleanOrigin}/#payment=success`,
  };
}

export function getPaymentSurface() {
  return Platform.OS === 'web' ? 'web' : 'mobile';
}

function getWebOrigin() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return undefined;
  return window.location.origin;
}

function readEnv(name: string) {
  return typeof process !== 'undefined' ? process.env?.[name] : undefined;
}

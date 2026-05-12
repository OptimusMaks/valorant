import { chargedPayConfig, getPaymentRedirectUrls, getPaymentSurface } from '../config/payment';

type ChargedPayProduct = {
  fullPrice: string;
  fullPriceText: string;
  id: string;
  promoPrice: string;
  promoPriceText: string;
  sortOrder: number;
  title: string;
  token: string;
  url: string;
};

type ChargedPayPaymentBox = {
  id: string;
  products: ChargedPayProduct[];
};

type ChargedPayPaymentBoxesResponse = {
  payment_boxes: ChargedPayPaymentBox[];
};

export type CheckoutProduct = ChargedPayProduct;

export async function createChargedPayCheckout(email?: string): Promise<CheckoutProduct> {
  const redirectUrls = getPaymentRedirectUrls();
  const trimmedEmail = email?.trim();
  const response = await fetch(`${chargedPayConfig.apiBaseUrl}/checkout/payment-boxes`, {
    body: JSON.stringify({
      ...(trimmedEmail ? { email: trimmedEmail } : null),
      failure_url: redirectUrls.failureUrl,
      page: 'pw',
      payment_box_ids: chargedPayConfig.paymentBoxIds,
      project_id: chargedPayConfig.projectId,
      return_url: redirectUrls.returnUrl,
      success_url: redirectUrls.successUrl,
      surface: getPaymentSurface(),
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`ChargedPay checkout request failed with ${response.status}`);
  }

  const data = (await response.json()) as Partial<ChargedPayPaymentBoxesResponse>;
  const products = data.payment_boxes?.flatMap((box) => box.products) ?? [];
  const product = products.sort((a, b) => a.sortOrder - b.sortOrder)[0];

  if (!product?.url) {
    throw new Error('ChargedPay checkout did not return an active product URL');
  }

  return product;
}

import Stripe from "stripe";

const stripeOptions: Stripe.StripeConfig = {
  apiVersion: "2024-06-20",
  appInfo: {
    name: "TaranVault",
    version: "0.1.0",
  },
  typescript: true,
};

/**
 * Create the Stripe client only when a Stripe-backed operation is requested.
 * This keeps unrelated routes (including authentication) usable when Stripe
 * credentials have not been configured in a development environment.
 */
export const stripeInstance = (account: boolean = false): Stripe => {
  const apiKey = account
    ? process.env.STRIPE_SECRET_KEY_LIVE_OLD ??
      process.env.STRIPE_SECRET_KEY_OLD
    : process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY;

  if (!apiKey) {
    throw new Error(
      `Stripe is not configured. Set the ${account ? "STRIPE_SECRET_KEY_OLD or STRIPE_SECRET_KEY_LIVE_OLD" : "STRIPE_SECRET_KEY or STRIPE_SECRET_KEY_LIVE"} environment variable before using billing features.`,
    );
  }

  return new Stripe(apiKey, stripeOptions);
};

export async function cancelSubscription(
  customer?: string,
  isOldAccount: boolean = false,
) {
  if (!customer) return;

  try {
    const stripe = stripeInstance(isOldAccount);
    const subscriptionId = await stripe.subscriptions
      .list({
        customer,
      })
      .then((res) => res.data[0]?.id);

    if (!subscriptionId) return;

    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
      cancellation_details: {
        comment: "Customer deleted their TaranVault instance.",
      },
    });
  } catch (error) {
    return;
  }
}

// services/subscription.services.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const subscriptionService = {
  // Crear sesión de Stripe
  async createCheckout(plan: 'MONTHLY' | 'YEARLY', token: string) {
    const response = await fetch(`${BASE_URL}/subscriptions/create-checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        plan,
        successUrl: `${window.location.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/subscription/cancel`,
      }),
    });
    return response.json();
  },

  // Obtener estado actual (Para el perfil o configuración)
  async getActiveSubscription(token: string) {
    const response = await fetch(`${BASE_URL}/subscriptions/active`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (response.status === 404) return null;
    return response.json();
  },

  // Cancelar
  async cancel(token: string) {
    const response = await fetch(`${BASE_URL}/subscriptions/cancel`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response.json();
  }
};
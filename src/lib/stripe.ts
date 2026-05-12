import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

// Lazy-initialized — only created on first request, not at build time
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
	if (!_stripe) {
		if (!env.STRIPE_SECRET_KEY) {
			throw new Error('STRIPE_SECRET_KEY is not set');
		}
		_stripe = new Stripe(env.STRIPE_SECRET_KEY, {
			apiVersion: '2025-04-30.basil'
		});
	}
	return _stripe;
}

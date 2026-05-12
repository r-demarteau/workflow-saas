import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/stripe';
import {
	STRIPE_PRICE_STARTER,
	STRIPE_PRICE_GROWTH,
	STRIPE_PRICE_PRO
} from '$env/static/private';
import { PUBLIC_BASE_URL } from '$env/static/public';

const PRICE_IDS: Record<string, string> = {
	starter: STRIPE_PRICE_STARTER,
	growth:  STRIPE_PRICE_GROWTH,
	pro:     STRIPE_PRICE_PRO
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json().catch(() => null);

	if (!body || !body.plan || !body.slug || !body.email) {
		return json({ error: 'Missing required fields.' }, { status: 400 });
	}

	const { plan, slug, email } = body as { plan: string; slug: string; email: string };

	const slugPattern = /^[a-z0-9][a-z0-9-]{1,31}$/;
	if (!slugPattern.test(slug)) {
		return json({ error: 'Invalid company name.' }, { status: 400 });
	}

	const priceId = PRICE_IDS[plan];
	if (!priceId) {
		return json({ error: 'Unknown plan.' }, { status: 400 });
	}

	const session = await stripe.checkout.sessions.create({
		mode: 'subscription',
		payment_method_types: ['card'],
		customer_email: email,
		line_items: [{ price: priceId, quantity: 1 }],
		subscription_data: {
			trial_period_days: 14,
			metadata: { slug, plan, email }
		},
		metadata: { slug, plan, email },
		success_url: `${PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url:  `${PUBLIC_BASE_URL}/pricing`
	});

	return json({ url: session.url });
};

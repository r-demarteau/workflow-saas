import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getStripe } from '$lib/stripe';
import { env } from '$env/dynamic/private';
import { env as pubEnv } from '$env/dynamic/public';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json().catch(() => null);

	if (!body || !body.plan || !body.slug || !body.email) {
		return json({ error: 'Missing required fields.' }, { status: 400 });
	}

	const { plan, slug, email, wordpress = false } = body as { plan: string; slug: string; email: string; wordpress?: boolean };

	const slugPattern = /^[a-z0-9][a-z0-9-]{1,31}$/;
	if (!slugPattern.test(slug)) {
		return json({ error: 'Invalid company name.' }, { status: 400 });
	}

	const PRICE_IDS: Record<string, string> = {
		starter: env.STRIPE_PRICE_STARTER ?? '',
		growth:  env.STRIPE_PRICE_GROWTH  ?? '',
		pro:     env.STRIPE_PRICE_PRO     ?? ''
	};

	const priceId = PRICE_IDS[plan];
	if (!priceId) {
		return json({ error: 'Unknown plan.' }, { status: 400 });
	}

	const baseUrl = pubEnv.PUBLIC_BASE_URL ?? 'http://localhost:5174';

	const lineItems: { price: string; quantity: number }[] = [{ price: priceId, quantity: 1 }];
	if (wordpress) {
		const wpPriceId = env.STRIPE_PRICE_WORDPRESS ?? '';
		if (!wpPriceId) return json({ error: 'WordPress add-on not configured.' }, { status: 500 });
		lineItems.push({ price: wpPriceId, quantity: 1 });
	}

	const meta = { slug, plan, email, wordpress: String(wordpress) };

	const session = await getStripe().checkout.sessions.create({
		mode: 'subscription',
		payment_method_types: ['card'],
		customer_email: email,
		line_items: lineItems,
		subscription_data: {
			trial_period_days: 14,
			metadata: meta
		},
		metadata: meta,
		success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url:  `${baseUrl}/pricing`
	});

	return json({ url: session.url });
};

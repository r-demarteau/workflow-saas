import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getStripe } from '$lib/stripe';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
	const body      = await request.text();
	const signature = request.headers.get('stripe-signature') ?? '';

	let event;
	try {
		event = getStripe().webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
	} catch {
		throw error(400, 'Invalid webhook signature');
	}

	if (event.type === 'checkout.session.completed') {
		const session  = event.data.object;
		const { slug, plan, email, wordpress } = session.metadata as Record<string, string>;

		// Fire and forget — respond to Stripe immediately so it doesn't time out
		// while Docker/nginx setup runs (can take 30-60s).
		provisionTenant({ slug, plan, email, wordpress: wordpress === 'true' }).catch((err: unknown) => {
			const msg = String((err as Error).message ?? err);
			if (msg.includes('already exists')) {
				console.log(`[webhook] Tenant ${slug} already provisioned — skipping duplicate event`);
			} else {
				console.error(`[webhook] Provisioning failed for ${slug}:`, err);
			}
		});
	}

	return json({ received: true });
};

async function provisionTenant({
	slug,
	plan,
	email,
	wordpress
}: {
	slug: string;
	plan: string;
	email: string;
	wordpress: boolean;
}) {
	const provisionUrl = env.PROVISION_API_URL;
	if (!provisionUrl) {
		console.error('[webhook] PROVISION_API_URL not set — skipping provisioning');
		return;
	}

	const res = await fetch(provisionUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${env.PROVISION_API_SECRET}`
		},
		body: JSON.stringify({ slug, plan, email, wordpress })
	});

	if (!res.ok) {
		const text = await res.text();
		// Surface the provisioner's error message so the caller can inspect it.
		throw new Error(`Provisioner returned ${res.status}: ${text}`);
	}

	console.log(`[webhook] Tenant provisioned: ${slug}.teamdock.ai (${plan})${wordpress ? ' + WordPress' : ''}`);
}

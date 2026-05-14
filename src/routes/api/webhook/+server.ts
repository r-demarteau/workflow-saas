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
		const { slug, plan, email } = session.metadata as Record<string, string>;

		try {
			await provisionTenant({ slug, plan, email });
		} catch (err) {
			const msg = String((err as Error).message ?? err);
			if (msg.includes('already exists')) {
				// Stripe retried a webhook we already processed — safe to ignore.
				console.log(`[webhook] Tenant ${slug} already provisioned — skipping duplicate event`);
			} else {
				// Real failure: log loudly but still return 200 so Stripe stops retrying.
				// The provisioner logs are the source of truth for manual follow-up.
				console.error(`[webhook] Provisioning failed for ${slug}:`, err);
			}
		}
	}

	return json({ received: true });
};

async function provisionTenant({
	slug,
	plan,
	email
}: {
	slug: string;
	plan: string;
	email: string;
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
		body: JSON.stringify({ slug, plan, email })
	});

	if (!res.ok) {
		const text = await res.text();
		// Surface the provisioner's error message so the caller can inspect it.
		throw new Error(`Provisioner returned ${res.status}: ${text}`);
	}

	console.log(`[webhook] Tenant provisioned: ${slug}.nemofirm.com (${plan})`);
}

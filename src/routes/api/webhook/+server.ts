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

		await provisionTenant({ slug, plan, email });
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
		console.error(`[webhook] Provisioning failed for ${slug}: ${res.status} ${text}`);
	} else {
		console.log(`[webhook] Tenant provisioned: ${slug}.nemofirm.com (${plan})`);
	}
}

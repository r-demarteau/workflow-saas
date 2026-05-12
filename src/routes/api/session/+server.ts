import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { stripe } from '$lib/stripe';

export const GET: RequestHandler = async ({ url }) => {
	const id = url.searchParams.get('id');
	if (!id) throw error(400, 'Missing session id');

	const session = await stripe.checkout.sessions.retrieve(id);

	return json({
		slug:  session.metadata?.slug  ?? '',
		email: session.metadata?.email ?? session.customer_email ?? '',
		plan:  session.metadata?.plan  ?? ''
	});
};

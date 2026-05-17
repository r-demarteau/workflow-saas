import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import fs from 'fs';
import path from 'path';
import { env } from '$env/dynamic/private';

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{1,31}$/;

export const GET: RequestHandler = async ({ url }) => {
	const slug = url.searchParams.get('slug') ?? '';

	if (!SLUG_PATTERN.test(slug)) {
		return json({ available: false, reason: 'invalid' });
	}

	const tenantsDir = env.TENANTS_DIR || '/opt/teamdock/tenants';
	const taken = fs.existsSync(path.join(tenantsDir, slug));

	return json({ available: !taken });
};

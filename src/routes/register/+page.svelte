<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	const planLabels: Record<string, { label: string; price: string }> = {
		starter: { label: 'Starter', price: '€49/mo' },
		growth:  { label: 'Growth',  price: '€99/mo' },
		pro:     { label: 'Pro',     price: '€199/mo' }
	};

	let plan = $derived($page.url.searchParams.get('plan') ?? 'growth');
	let planInfo = $derived(planLabels[plan] ?? planLabels.growth);

	let companyName  = $state('');
	let email        = $state('');
	let loading      = $state(false);
	let error        = $state('');
	let slugChecking = $state(false);
	let slugAvailable: boolean | null = $state(null);

	// Derive subdomain slug from company name
	let slug = $derived(
		companyName
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '')
			.slice(0, 32)
	);

	let checkTimer: ReturnType<typeof setTimeout>;
	$effect(() => {
		slugAvailable = null;
		clearTimeout(checkTimer);
		if (!slug || slug.length < 2) return;
		slugChecking = true;
		checkTimer = setTimeout(async () => {
			try {
				const res = await fetch(`/api/check-slug?slug=${encodeURIComponent(slug)}`);
				const data = await res.json();
				slugAvailable = data.available ?? null;
			} catch {
				slugAvailable = null;
			} finally {
				slugChecking = false;
			}
		}, 400);
	});

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		error = '';

		if (!slug || slug.length < 2) {
			error = 'Company name must be at least 2 characters.';
			return;
		}
		if (slugAvailable === false) {
			error = `${slug}.teamdock.ai is already taken. Please choose a different name.`;
			return;
		}
		if (!email.includes('@')) {
			error = 'Please enter a valid email address.';
			return;
		}

		loading = true;
		try {
			const res = await fetch('/api/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ plan, slug, email })
			});

			const data = await res.json();
			if (!res.ok) {
				error = data.error ?? 'Something went wrong. Please try again.';
				return;
			}

			// Redirect to Stripe Checkout
			window.location.href = data.url;
		} catch {
			error = 'Network error. Please try again.';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Register — Teamdock</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen pt-28 pb-24 bg-gray-50">
	<div class="mx-auto max-w-lg px-6">

		<!-- Plan badge -->
		<div class="mb-8 text-center">
			<a href="/pricing" class="inline-flex items-center gap-1.5 text-sm text-brand-600 font-medium hover:underline">
				← Back to pricing
			</a>
		</div>

		<div class="card">
			<div class="mb-6 flex items-center justify-between">
				<h1 class="text-2xl font-bold text-gray-900">Create your workspace</h1>
				<span class="rounded-full bg-brand-50 border border-brand-200 px-3 py-1 text-sm font-semibold text-brand-700">
					{planInfo.label} · {planInfo.price}
				</span>
			</div>

			<form onsubmit={submit} class="space-y-5">
				<!-- Company name -->
				<div>
					<label for="company" class="block text-sm font-medium text-gray-700 mb-1.5">
						Company name
					</label>
					<input
						id="company"
						type="text"
						bind:value={companyName}
						placeholder="Acme Store"
						maxlength="50"
						required
						class="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 transition"
					/>
					<!-- Subdomain preview -->
					{#if slug}
						<div class="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 border
							{slugAvailable === false ? 'bg-red-50 border-red-200' : slugAvailable === true ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}">
							{#if slugChecking}
								<svg class="animate-spin h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
								</svg>
							{:else if slugAvailable === true}
								<svg class="h-4 w-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
								</svg>
							{:else if slugAvailable === false}
								<svg class="h-4 w-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							{:else}
								<svg class="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
								</svg>
							{/if}
							<span class="text-sm {slugAvailable === false ? 'text-red-700' : slugAvailable === true ? 'text-green-700' : 'text-gray-700'}">
								{#if slugAvailable === false}
									<strong>{slug}.teamdock.ai</strong> is already taken
								{:else}
									Your workspace: <strong class={slugAvailable === true ? 'text-green-700' : 'text-brand-700'}>{slug}.teamdock.ai</strong>
								{/if}
							</span>
						</div>
					{/if}
				</div>

				<!-- Email -->
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">
						Work email
					</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						placeholder="you@company.com"
						required
						class="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 transition"
					/>
					<p class="mt-1.5 text-xs text-gray-400">We'll send your login credentials to this address.</p>
				</div>

				<!-- Legal acceptance -->
				<label class="flex items-start gap-3 cursor-pointer">
					<input
						type="checkbox"
						required
						class="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 flex-shrink-0"
					/>
					<span class="text-xs text-gray-500 leading-relaxed">
						I agree to the
						<a href="/terms" target="_blank" rel="noopener" class="text-brand-600 hover:underline font-medium">Terms of Service</a>,
						<a href="/privacy" target="_blank" rel="noopener" class="text-brand-600 hover:underline font-medium">Privacy Policy</a>,
						and <a href="/dpa" target="_blank" rel="noopener" class="text-brand-600 hover:underline font-medium">Data Processing Agreement</a>.
					</span>
				</label>

				{#if error}
					<div class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
						{error}
					</div>
				{/if}

				<button
					type="submit"
					disabled={loading || slugAvailable === false || slugChecking}
					class="btn-primary w-full py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed"
				>
					{#if loading}
						<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
						</svg>
						Redirecting to payment...
					{:else}
						Continue to payment →
					{/if}
				</button>

				<p class="text-center text-xs text-gray-400">
					Powered by Stripe · 14-day free trial · Cancel any time
				</p>
			</form>
		</div>

		<!-- Trust signals -->
		<div class="mt-8 grid grid-cols-3 gap-4 text-center">
			{#each [
				{ icon: '🔒', label: 'SSL encrypted' },
				{ icon: '🇪🇺', label: 'GDPR compliant' },
				{ icon: '💳', label: 'Stripe payments' }
			] as t}
				<div class="rounded-xl bg-white border border-gray-200 p-4">
					<div class="text-2xl mb-1">{t.icon}</div>
					<p class="text-xs font-medium text-gray-600">{t.label}</p>
				</div>
			{/each}
		</div>
	</div>
</div>

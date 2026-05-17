<script lang="ts">
	const plans = [
		{
			name: 'Starter',
			price: 49,
			priceId: 'STRIPE_PRICE_ID_STARTER',
			description: 'Perfect for solo operators and small shops.',
			features: [
				'1 WooCommerce store',
				'Up to 3 team members',
				'Orders, customers & tickets',
				'Live chat',
				'Email support',
				'E-invoicing (Peppol)',
				'your-brand.teamdock.ai'
			],
			cta: 'Start with Starter',
			highlight: false
		},
		{
			name: 'Growth',
			price: 99,
			priceId: 'STRIPE_PRICE_ID_GROWTH',
			description: 'For growing teams managing multiple stores.',
			features: [
				'Up to 3 WooCommerce stores',
				'Up to 10 team members',
				'Everything in Starter',
				'WhatsApp integration',
				'AI assistant (Claude)',
				'Priority support'
			],
			cta: 'Start with Growth',
			highlight: true
		},
		{
			name: 'Pro',
			price: 199,
			priceId: 'STRIPE_PRICE_ID_PRO',
			description: 'Unlimited power for large operations.',
			features: [
				'Unlimited WooCommerce stores',
				'Unlimited team members',
				'Everything in Growth',
				'Custom integrations',
				'Dedicated onboarding',
				'SLA & phone support'
			],
			cta: 'Start with Pro',
			highlight: false
		}
	];
</script>

<svelte:head>
	<title>Pricing — Teamdock | WooCommerce Operations Platform</title>
	<meta
		name="description"
		content="Simple, transparent pricing for WooCommerce teams. Starter €49/mo, Growth €99/mo, Pro €199/mo. First 14 days free on any plan."
	/>
	<link rel="canonical" href="https://teamdock.ai/pricing" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://teamdock.ai/pricing" />
	<meta property="og:title" content="Pricing — Teamdock | WooCommerce Operations Platform" />
	<meta
		property="og:description"
		content="Starter €49/mo · Growth €99/mo · Pro €199/mo. First 14 days free on any plan. Full isolation, GDPR compliant."
	/>
	<meta name="twitter:title" content="Teamdock Pricing — from €49/mo" />
	<meta
		name="twitter:description"
		content="Start your WooCommerce operations workspace for €49/mo. First 14 days free."
	/>
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"mainEntity": [
			{
				"@type": "Question",
				"name": "Is my data isolated from other customers?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Yes — every workspace runs in its own Docker container with its own database. Your data never touches another tenant's infrastructure."
				}
			},
			{
				"@type": "Question",
				"name": "Can I connect multiple WooCommerce stores?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Growth and Pro plans support multiple stores. Starter is single-store."
				}
			},
			{
				"@type": "Question",
				"name": "What happens after the 14-day trial?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "You'll be asked to enter a payment method. If you don't, your workspace is paused — your data is kept for 30 days."
				}
			},
			{
				"@type": "Question",
				"name": "Can I change plans later?",
				"acceptedAnswer": {
					"@type": "Answer",
					"text": "Yes, upgrades and downgrades take effect at the next billing cycle."
				}
			}
		]
	})}<\/script>`}
</svelte:head>

<div class="pt-28 pb-24">
	<div class="mx-auto max-w-6xl px-6">
		<!-- Header -->
		<div class="text-center mb-16">
			<h1 class="text-4xl md:text-5xl font-extrabold text-gray-900">Simple, transparent pricing</h1>
			<p class="mt-4 text-xl text-gray-500">Your first 14 days are free on any plan.</p>
		</div>

		<!-- Plans -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
			{#each plans as plan}
				<div class="relative flex flex-col rounded-2xl border {plan.highlight ? 'border-brand-500 shadow-xl shadow-brand-100' : 'border-gray-200 shadow-sm'} bg-white overflow-hidden">
					{#if plan.highlight}
						<div class="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-500 to-brand-400"></div>
						<div class="absolute top-4 right-4">
							<span class="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">Most popular</span>
						</div>
					{/if}

					<div class="p-8 flex-1">
						<h2 class="text-xl font-bold text-gray-900">{plan.name}</h2>
						<p class="mt-1 text-sm text-gray-500">{plan.description}</p>

						<div class="mt-6 flex items-end gap-1">
							<span class="text-5xl font-extrabold text-gray-900">€{plan.price}</span>
							<span class="text-gray-400 mb-2">/month</span>
						</div>

						<ul class="mt-8 space-y-3">
							{#each plan.features as feature}
								<li class="flex items-start gap-3">
									<svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
									</svg>
									<span class="text-sm text-gray-600">{feature}</span>
								</li>
							{/each}
						</ul>
					</div>

					<div class="p-8 pt-0">
						<a
							href="/register?plan={plan.name.toLowerCase()}"
							class="{plan.highlight ? 'btn-primary' : 'btn-secondary'} w-full text-center"
						>
							{plan.cta}
						</a>
					</div>
				</div>
			{/each}
		</div>

		<!-- WordPress add-on -->
		<div class="mt-16 max-w-3xl mx-auto">
			<div class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
				<div class="flex flex-col md:flex-row items-start md:items-center gap-6 p-8">
					<div class="flex-shrink-0 w-12 h-12 rounded-xl bg-[#3c434a] flex items-center justify-center">
						<svg viewBox="0 0 122.52 122.52" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 fill-white">
							<path d="M8.71 61.26C8.71 82.11 20.6 100.18 38.03 109.3L13.73 44.9C10.6 49.8 8.71 55.32 8.71 61.26zm88.76-2.66c0-6.55-2.36-11.08-4.38-14.61-2.69-4.37-5.21-8.07-5.21-12.44 0-4.88 3.7-9.41 8.91-9.41.24 0 .46.03.69.04A52.46 52.46 0 0061.26 8.71c-18.97 0-35.65 9.74-45.39 24.47.78.02 1.52.04 2.15.04 3.5 0 8.91-.42 8.91-.42 1.8-.11 2.01 2.54.22 2.75 0 0-1.81.21-3.83.32L42.8 93.31l10.82-32.45-7.7-21.09c-1.8-.11-3.5-.32-3.5-.32-1.8-.1-1.6-2.86.21-2.75 0 0 5.52.42 8.81.42 3.5 0 8.92-.42 8.92-.42 1.8-.11 2.02 2.54.21 2.75 0 0-1.81.21-3.83.32l19.36 57.59 5.35-17.86c2.32-7.41 4.08-12.73 4.08-17.31zM62.24 65.5L46.17 112.2a52.54 52.54 0 0015.09 2.19c6.22 0 12.19-1.08 17.73-3.04-.14-.23-.27-.47-.38-.73zm46.4-30.62c.24 1.76.37 3.65.37 5.69 0 5.62-1.05 11.93-4.2 19.83l-16.88 48.83C103.6 99.75 113.81 81.67 113.81 61.26c0-9.35-2.38-18.14-6.56-25.8l1.39-.58z"/>
						</svg>
					</div>
					<div class="flex-1">
						<div class="flex items-center gap-3 flex-wrap">
							<h3 class="text-lg font-bold text-gray-900">WordPress hosting</h3>
							<span class="rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-600">Add-on · any plan</span>
						</div>
						<p class="mt-1 text-sm text-gray-500">Add a fully isolated WordPress site at <span class="font-mono text-brand-600">your-brand.teamdock.ai/wp</span>. Managed for you — no server setup needed.</p>
						<ul class="mt-3 flex flex-wrap gap-x-6 gap-y-1">
							{#each ['Isolated container', 'Automatic SSL', 'MariaDB included', 'Ready in minutes'] as f}
								<li class="flex items-center gap-1.5 text-xs text-gray-500">
									<svg class="h-3.5 w-3.5 text-brand-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
									</svg>
									{f}
								</li>
							{/each}
						</ul>
					</div>
					<div class="flex-shrink-0 text-right">
						<div class="text-3xl font-extrabold text-gray-900">€19</div>
						<div class="text-sm text-gray-400">/month</div>
						<p class="mt-1 text-xs text-gray-400">Add during checkout</p>
					</div>
				</div>
			</div>
		</div>

		<!-- FAQ -->
		<div class="mt-20 max-w-2xl mx-auto">
			<h2 class="text-2xl font-bold text-gray-900 text-center mb-10">Frequently asked questions</h2>
			<div class="space-y-6">
				{#each [
					{ q: 'Is my data isolated from other customers?', a: 'Yes — every workspace runs in its own Docker container with its own database. Your data never touches another tenant\'s infrastructure.' },
					{ q: 'Can I connect multiple WooCommerce stores?', a: 'Growth and Pro plans support multiple stores. Starter is single-store.' },
					{ q: 'What happens after the 14-day trial?', a: 'You\'ll be asked to enter a payment method. If you don\'t, your workspace is paused — your data is kept for 30 days.' },
					{ q: 'Can I change plans later?', a: 'Yes, upgrades and downgrades take effect at the next billing cycle.' }
				] as item}
					<div class="border-b border-gray-200 pb-6">
						<h3 class="font-semibold text-gray-900 mb-2">{item.q}</h3>
						<p class="text-gray-500 text-sm leading-relaxed">{item.a}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

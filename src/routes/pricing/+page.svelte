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
				'your-brand.nemofirm.com'
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
	<title>Pricing — NemoFirm</title>
</svelte:head>

<div class="pt-28 pb-24">
	<div class="mx-auto max-w-6xl px-6">
		<!-- Header -->
		<div class="text-center mb-16">
			<h1 class="text-4xl md:text-5xl font-extrabold text-gray-900">Simple, transparent pricing</h1>
			<p class="mt-4 text-xl text-gray-500">Start your 14-day free trial. No credit card required.</p>
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

<script lang="ts">
	const features = [
		{
			title: 'Order management',
			desc: 'See every WooCommerce order at a glance. Filter, search, and bulk-update status in seconds. Your team stays on top of fulfilment without touching WooCommerce admin.',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />`
		},
		{
			title: 'Customer CRM',
			desc: 'Full customer profiles with order history, open tickets, and team notes — all in one place. Know every customer before you reply.',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />`
		},
		{
			title: 'Support tickets',
			desc: 'Create and track tickets linked directly to orders. Assign to teammates, add internal notes, and close loops — built for e-commerce support flows.',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z" />`
		},
		{
			title: 'Live chat & WhatsApp',
			desc: 'Chat with customers in real time from your workspace. WhatsApp integration included on Growth and Pro — no third-party tool needed.',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />`
		},
		{
			title: 'AI assistant',
			desc: 'Draft customer replies, summarise order histories, and get smart product suggestions — powered by Claude AI. Cuts reply time by hours every day.',
			icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />`
		},
		{
			title: 'Fully isolated',
			desc: "Your workspace runs in its own container with its own database. Your data never touches another team's infrastructure. GDPR-ready by design.",
			icon: `<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />`
		}
	];

	const stats = [
		{ value: '500+', label: 'WooCommerce stores' },
		{ value: '< 5 min', label: 'Average setup time' },
		{ value: '99.9%', label: 'Uptime SLA' },
		{ value: '€0', label: 'Setup fee' }
	];

	const testimonials = [
		{
			quote: 'We cut average ticket resolution from 3 days to 4 hours. Our whole support team lives in Teamdock now.',
			name: 'Floris van den Berg',
			role: 'Operations Lead',
			company: 'BouwDirect',
			initials: 'FB',
			color: 'bg-brand-100 text-brand-700'
		},
		{
			quote: 'Setup literally took 4 minutes. Having our own isolated workspace — not sharing data with other companies — was the dealbreaker for us.',
			name: 'Lena Meijer',
			role: 'Customer Success Manager',
			company: 'VitaStore',
			initials: 'LM',
			color: 'bg-emerald-100 text-emerald-700'
		},
		{
			quote: 'The AI assistant alone saves us 2 hours a day on customer replies. And the WhatsApp integration just works.',
			name: 'Thomas Richter',
			role: 'Head of E-commerce',
			company: 'Sanctuarium',
			initials: 'TR',
			color: 'bg-violet-100 text-violet-700'
		}
	];

	const steps = [
		{
			number: '01',
			title: 'Pick your plan',
			desc: 'Choose Starter, Growth, or Pro. Your first 14 days are free — cancel any time before your trial ends.'
		},
		{
			number: '02',
			title: 'Enter your company name',
			desc: 'We automatically provision your fully isolated workspace at {your-brand}.teamdock.ai in minutes.'
		},
		{
			number: '03',
			title: 'Your team is live',
			desc: 'Connect your WooCommerce store, invite teammates, and start handling orders and tickets right away.'
		}
	];

	const orders = [
		{ id: '#1042', customer: 'Sarah Johnson', amount: 'EUR 89.99', status: 'Processing' },
		{ id: '#1041', customer: 'Mark de Vries', amount: 'EUR 234.00', status: 'Completed' },
		{ id: '#1040', customer: 'Anna Muller', amount: 'EUR 49.50', status: 'On hold' }
	];

	const jsonLd = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'SoftwareApplication',
				name: 'Teamdock',
				applicationCategory: 'BusinessApplication',
				operatingSystem: 'Web',
				description:
					'WooCommerce operations platform for teams — manage orders, customers, support tickets, live chat and AI in one dedicated workspace.',
				url: 'https://teamdock.ai',
				offers: [
					{ '@type': 'Offer', price: '49', priceCurrency: 'EUR', name: 'Starter' },
					{ '@type': 'Offer', price: '99', priceCurrency: 'EUR', name: 'Growth' },
					{ '@type': 'Offer', price: '199', priceCurrency: 'EUR', name: 'Pro' }
				]
			},
			{
				'@type': 'Organization',
				name: 'Teamdock',
				url: 'https://teamdock.ai',
				logo: 'https://teamdock.ai/favicon-96x96.png',
				sameAs: []
			}
		]
	};
</script>

<svelte:head>
	<title>Teamdock — WooCommerce Operations Platform for Teams</title>
	<meta
		name="description"
		content="Teamdock gives WooCommerce teams a dedicated operations workspace — manage orders, customers, support tickets, live chat and AI in one place. Live on your own subdomain in minutes. 14-day free trial."
	/>
	<meta
		name="keywords"
		content="WooCommerce operations, WooCommerce team management, WooCommerce CRM, WooCommerce order management, ecommerce operations platform, WooCommerce support tickets, WooCommerce help desk"
	/>
	<link rel="canonical" href="https://teamdock.ai/" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://teamdock.ai/" />
	<meta property="og:site_name" content="Teamdock" />
	<meta property="og:title" content="Teamdock — WooCommerce Operations Platform for Teams" />
	<meta
		property="og:description"
		content="Manage WooCommerce orders, customers & support tickets in one team workspace. AI-powered, isolated, live in minutes. 14-day free trial."
	/>
	<meta property="og:image" content="https://teamdock.ai/og-image.svg" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Teamdock — WooCommerce Operations Platform" />
	<meta
		name="twitter:description"
		content="Manage WooCommerce orders, customers & support tickets in one team workspace. Live in minutes."
	/>
	<meta name="twitter:image" content="https://teamdock.ai/og-image.svg" />

	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`}
</svelte:head>

<!-- ─── Hero ─── -->
<section class="motion-hero relative overflow-hidden bg-white pt-20 sm:min-h-screen md:pt-28">
	<div class="hero-grid absolute inset-0"></div>
	<div class="motion-field" aria-hidden="true">
		<div class="motion-ribbon motion-ribbon-a"></div>
		<div class="motion-ribbon motion-ribbon-b"></div>
		<div class="motion-ribbon motion-ribbon-c"></div>
		<div class="motion-ribbon motion-ribbon-d"></div>
		<div class="motion-sheen"></div>
	</div>

	<div
		class="relative z-10 mx-auto flex sm:min-h-[560px] max-w-6xl flex-col items-start justify-center px-6 pb-32 pt-24 sm:pb-24 sm:pt-16"
	>
		<div
			class="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/80 px-4 py-1.5 text-sm font-semibold text-gray-700 shadow-sm shadow-brand-100/60 backdrop-blur"
		>
			<span class="h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
			Trusted by 500+ WooCommerce teams across Europe
		</div>

		<h1
			class="max-w-4xl text-4xl font-extrabold leading-tight text-gray-950 sm:text-5xl md:text-6xl lg:text-7xl"
		>
			WooCommerce operations<br class="hidden sm:inline" />
			for <span class="text-brand-600">high-performing teams</span>
		</h1>

		<p class="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl">
			Teamdock is the dedicated operations portal your whole team needs — orders, customers,
			support tickets, live chat, and AI, all synced with your WooCommerce store. Your own subdomain,
			live in minutes.
		</p>

		<div class="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
			<a
				href="/pricing"
				class="inline-flex items-center justify-center rounded-lg bg-brand-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-transparent transition-colors duration-150"
			>
				Start free trial
			</a>
			<a
				href="/#how-it-works"
				class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white/80 px-8 py-4 text-base font-semibold text-gray-800 shadow-sm backdrop-blur hover:border-brand-200 hover:text-brand-700 transition-colors duration-150"
			>
				See how it works
			</a>
		</div>

		<p class="mt-6 text-sm font-medium text-gray-500">
			First 14 days free · GDPR compliant · Cancel any time
		</p>
	</div>
</section>

<!-- ─── Stats bar ─── -->
<div class="border-y border-gray-100 bg-white py-8">
	<div class="mx-auto max-w-6xl px-6">
		<dl class="grid grid-cols-2 gap-6 md:grid-cols-4">
			{#each stats as stat}
				<div class="text-center">
					<dt class="text-3xl font-extrabold text-brand-600">{stat.value}</dt>
					<dd class="mt-1 text-sm font-medium text-gray-500">{stat.label}</dd>
				</div>
			{/each}
		</dl>
	</div>
</div>

<!-- ─── App mockup ─── -->
<div class="relative z-10 mx-auto my-12 max-w-6xl px-6">
	<div
		class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/80"
	>
		<div class="flex items-center gap-2 border-b border-gray-200 bg-gray-100 px-4 py-3">
			<div class="h-3 w-3 rounded-full bg-red-400"></div>
			<div class="h-3 w-3 rounded-full bg-yellow-400"></div>
			<div class="h-3 w-3 rounded-full bg-green-400"></div>
			<div class="ml-3 flex-1 rounded bg-white px-3 py-1 text-xs text-gray-400">
				acme.teamdock.ai
			</div>
		</div>
		<div class="grid h-72 grid-cols-1 sm:grid-cols-4">
			<div class="hidden sm:flex flex-col gap-3 border-r border-gray-100 bg-gray-50 p-4">
				<div class="flex items-center gap-1.5 px-1 pb-2 border-b border-gray-200 mb-1">
					<svg
						viewBox="116 117 280 280"
						height="16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<rect x="116" y="151" width="140" height="48" rx="10" fill="#0f172a" />
						<rect x="116" y="233" width="220" height="48" rx="10" fill="#2438ec" />
						<rect x="116" y="315" width="280" height="48" rx="10" fill="#0f172a" />
					</svg>
					<span class="text-xs font-bold"
						><span class="text-gray-800">team</span><span class="text-brand-600">dock</span></span
					>
				</div>
				{#each ['Orders', 'Customers', 'Tickets', 'Chat', 'Products', 'Settings'] as item}
					<div
						class="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 {item === 'Orders'
							? 'bg-brand-600 text-white'
							: 'text-gray-500 hover:bg-gray-200'} text-sm transition-colors"
					>
						<div class="h-4 w-4 rounded bg-current opacity-40"></div>
						{item}
					</div>
				{/each}
			</div>
			<div class="col-span-1 sm:col-span-3 p-6">
				<div class="mb-4 flex items-center justify-between">
					<h3 class="font-semibold text-gray-800">Recent orders</h3>
					<div class="h-8 w-24 rounded-lg bg-brand-100"></div>
				</div>
				<div class="space-y-3">
					{#each orders as order}
						<div class="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
							<span class="text-sm font-mono text-gray-500">{order.id}</span>
							<span class="text-sm text-gray-700">{order.customer}</span>
							<span class="text-sm font-semibold text-gray-900">{order.amount}</span>
							<span
								class="rounded-full px-2.5 py-1 text-xs font-medium {order.status === 'Completed'
									? 'bg-green-100 text-green-700'
									: order.status === 'Processing'
										? 'bg-blue-100 text-blue-700'
										: 'bg-yellow-100 text-yellow-700'}">{order.status}</span
							>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<!-- ─── Social proof logos ─── -->
<div class="border-y border-gray-100 bg-gray-50 py-10">
	<div class="mx-auto max-w-6xl px-6">
		<p class="mb-8 text-center text-sm font-medium uppercase tracking-wider text-gray-400">
			Trusted by WooCommerce teams across Europe
		</p>
		<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
			{#each ['Sanctuarium', 'BouwDirect', 'PrintShop NL', 'VitaStore'] as brand}
				<div class="flex items-center justify-center">
					<span class="text-xl font-bold text-gray-300">{brand}</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<!-- ─── How it works ─── -->
<section id="how-it-works" class="py-16 md:py-28">
	<div class="mx-auto max-w-6xl px-6">
		<div class="mb-14 text-center">
			<p class="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-600">
				How it works
			</p>
			<h2 class="text-3xl font-bold text-gray-900 md:text-4xl">
				From sign-up to live in under 5 minutes
			</h2>
			<p class="mx-auto mt-4 max-w-xl text-lg text-gray-500">
				No servers to manage. No devops. Just enter your company name and we handle the rest.
			</p>
		</div>

		<div class="relative grid grid-cols-1 gap-10 md:grid-cols-3">
			<!-- connector line (desktop) -->
			<div
				class="absolute top-8 left-1/3 right-1/3 hidden h-px bg-gradient-to-r from-brand-200 to-brand-200 md:block"
				aria-hidden="true"
			></div>
			<div
				class="absolute top-8 left-2/3 right-0 hidden h-px bg-gradient-to-r from-brand-200 to-transparent md:block"
				aria-hidden="true"
			></div>

			{#each steps as step, i}
				<div class="relative flex flex-col items-start md:items-center md:text-center">
					<div
						class="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-brand-100 bg-white shadow-md shadow-brand-100/50"
					>
						<span class="text-2xl font-extrabold text-brand-600">{step.number}</span>
					</div>
					<h3 class="mt-5 text-xl font-bold text-gray-900">{step.title}</h3>
					<p class="mt-2 text-base leading-relaxed text-gray-500">{step.desc}</p>
				</div>
			{/each}
		</div>

		<div class="mt-12 text-center">
			<a
				href="/pricing"
				class="inline-flex items-center justify-center rounded-lg bg-brand-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-brand-500 transition-colors duration-150"
			>
				Start your free trial →
			</a>
		</div>
	</div>
</section>

<!-- ─── Features ─── -->
<section id="features" class="bg-gray-50 py-16 md:py-28">
	<div class="mx-auto max-w-6xl px-6">
		<div class="mb-14 text-center">
			<p class="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-600">Features</p>
			<h2 class="text-3xl font-bold text-gray-900 md:text-4xl">Everything your team needs</h2>
			<p class="mx-auto mt-4 max-w-xl text-lg text-gray-500">
				One workspace. All your WooCommerce tools. No context switching.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each features as f}
				<div class="group card transition-all hover:shadow-lg hover:border-brand-100">
					<div
						class="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 group-hover:bg-brand-100 transition-colors"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.75"
							stroke="currentColor"
							class="h-5 w-5"
						>
							{@html f.icon}
						</svg>
					</div>
					<h3 class="mb-2 text-lg font-semibold text-gray-900">{f.title}</h3>
					<p class="text-sm leading-relaxed text-gray-500">{f.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ─── Isolation spotlight ─── -->
<section class="py-16 md:py-24">
	<div class="mx-auto max-w-6xl px-6">
		<div
			class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-950 to-brand-800 px-8 py-16 md:px-16 md:py-20"
		>
			<div
				class="absolute inset-0 opacity-10"
				style="background-image: radial-gradient(circle at 70% 50%, white 1px, transparent 1px); background-size: 32px 32px;"
				aria-hidden="true"
			></div>
			<div class="relative z-10 grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
				<div>
					<p class="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-300">
						Security & isolation
					</p>
					<h2 class="text-3xl font-bold text-white md:text-4xl">
						Your data stays yours. Full stop.
					</h2>
					<p class="mt-5 text-lg leading-relaxed text-brand-200">
						Every Teamdock workspace runs in its own Docker container with its own dedicated
						database. No shared infrastructure, no noisy neighbours, and no data leakage between
						tenants — ever.
					</p>
					<ul class="mt-8 space-y-3">
						{#each ['Dedicated database per workspace', 'Isolated container, isolated network', 'GDPR-compliant by design', 'Data stored in EU data centres', 'Nightly encrypted backups'] as item}
							<li class="flex items-center gap-3 text-brand-100">
								<svg
									class="h-5 w-5 flex-shrink-0 text-brand-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									/>
								</svg>
								<span class="text-sm">{item}</span>
							</li>
						{/each}
					</ul>
				</div>
				<div class="flex flex-col gap-4">
					<div class="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
						<div class="mb-2 flex items-center gap-2">
							<div class="h-3 w-3 rounded-full bg-green-400"></div>
							<span class="text-xs font-mono text-brand-300">acme.teamdock.ai</span>
						</div>
						<p class="text-sm text-brand-200">Your isolated workspace</p>
						<div class="mt-3 space-y-1.5">
							<div class="h-2 w-3/4 rounded bg-white/20"></div>
							<div class="h-2 w-1/2 rounded bg-white/10"></div>
						</div>
					</div>
					<div class="flex items-center justify-center gap-2 text-brand-400 text-xs font-semibold">
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
						Completely isolated from other tenants
					</div>
					<div class="rounded-2xl border border-white/5 bg-white/5 p-6">
						<div class="mb-2 flex items-center gap-2">
							<div class="h-3 w-3 rounded-full bg-gray-500"></div>
							<span class="text-xs font-mono text-brand-500">other-company.teamdock.ai</span>
						</div>
						<p class="text-sm text-brand-600">Another customer's workspace</p>
						<div class="mt-3 space-y-1.5">
							<div class="h-2 w-2/3 rounded bg-white/5"></div>
							<div class="h-2 w-1/3 rounded bg-white/5"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ─── Testimonials ─── -->
<section class="bg-gray-50 py-16 md:py-24">
	<div class="mx-auto max-w-6xl px-6">
		<div class="mb-14 text-center">
			<p class="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-600">
				Customer stories
			</p>
			<h2 class="text-3xl font-bold text-gray-900 md:text-4xl">Teams love Teamdock</h2>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			{#each testimonials as t}
				<div class="card flex flex-col justify-between">
					<div>
						<div class="mb-5 flex gap-0.5">
							{#each Array(5) as _}
								<svg class="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
									<path
										d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
									/>
								</svg>
							{/each}
						</div>
						<blockquote class="text-gray-700 leading-relaxed">"{t.quote}"</blockquote>
					</div>
					<div class="mt-6 flex items-center gap-3">
						<div
							class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold {t.color}"
						>
							{t.initials}
						</div>
						<div>
							<p class="text-sm font-semibold text-gray-900">{t.name}</p>
							<p class="text-xs text-gray-500">{t.role} · {t.company}</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ─── Final CTA ─── -->
<section class="py-16 md:py-28">
	<div class="mx-auto max-w-3xl px-6 text-center">
		<h2 class="text-4xl font-extrabold text-gray-900 md:text-5xl">
			Ready to launch your workspace?
		</h2>
		<p class="mt-5 text-xl text-gray-500">
			Pick a plan, enter your company name, and your team portal is live in minutes.
		</p>
		<div class="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
			<a
				href="/pricing"
				class="inline-flex items-center justify-center rounded-lg bg-brand-600 px-10 py-4 text-base font-semibold text-white shadow-lg hover:bg-brand-500 transition-colors duration-150"
			>
				View pricing & start trial
			</a>
			<a
				href="/#features"
				class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-10 py-4 text-base font-semibold text-gray-700 shadow-sm hover:border-brand-200 hover:text-brand-700 transition-colors duration-150"
			>
				Explore features
			</a>
		</div>
		<p class="mt-6 text-sm text-gray-400">First 14 days free · Cancel any time</p>
	</div>
</section>

<style>
	.hero-grid {
		background-image:
			linear-gradient(to right, rgba(36, 56, 236, 0.08) 1px, transparent 1px),
			linear-gradient(to bottom, rgba(36, 56, 236, 0.06) 1px, transparent 1px);
		background-size: 128px 128px;
		mask-image: linear-gradient(to bottom, black 0%, transparent 70%);
	}

	.motion-field {
		position: absolute;
		top: -5%;
		right: -60px;
		width: min(960px, 68vw);
		height: 115vh;
		pointer-events: none;
		filter: saturate(1.2);
		mask-image: linear-gradient(to right, transparent 0%, black 18%),
			linear-gradient(to bottom, black 60%, transparent 100%);
		-webkit-mask-image: linear-gradient(to right, transparent 0%, black 18%);
		overflow: visible;
	}

	.motion-hero::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: 190px;
		background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #fff 78%);
		content: '';
		pointer-events: none;
	}

	.motion-ribbon {
		position: absolute;
		width: 22%;
		height: 160%;
		border-radius: 999px;
		transform-origin: 50% 0%;
		mix-blend-mode: multiply;
		opacity: 0.78;
		filter: blur(0.4px);
		animation: ribbon-flow 10s ease-in-out infinite alternate;
	}

	.motion-ribbon-a {
		right: 34%;
		top: -18%;
		background: linear-gradient(
			158deg,
			rgba(255, 193, 7, 0),
			#ffb13d 22%,
			#ff4f8b 57%,
			rgba(124, 58, 237, 0.9) 100%
		);
		transform: rotate(-39deg) skewX(-10deg);
	}

	.motion-ribbon-b {
		right: 18%;
		top: -14%;
		background: linear-gradient(
			165deg,
			rgba(120, 189, 255, 0),
			#8cc8ff 18%,
			#a855f7 48%,
			#ff7a1a 88%
		);
		transform: rotate(-29deg) skewX(-13deg);
		animation-delay: -2.6s;
	}

	.motion-ribbon-c {
		right: 1%;
		top: -10%;
		background: linear-gradient(
			175deg,
			rgba(255, 255, 255, 0),
			#ffd166 16%,
			#fb7185 48%,
			#4f46e5 92%
		);
		transform: rotate(-18deg) skewX(-7deg);
		animation-delay: -5s;
	}

	.motion-ribbon-d {
		right: 54%;
		top: -24%;
		width: 21%;
		background: linear-gradient(
			170deg,
			rgba(255, 255, 255, 0),
			rgba(96, 165, 250, 0.65),
			rgba(255, 255, 255, 0.2)
		);
		transform: rotate(-48deg) skewX(8deg);
		animation-delay: -7s;
	}

	.motion-sheen {
		position: absolute;
		right: 6%;
		top: 4%;
		width: 82%;
		height: 82%;
		background:
			repeating-linear-gradient(
				105deg,
				rgba(255, 255, 255, 0.24) 0 1px,
				transparent 1px 15px
			),
			radial-gradient(circle at 30% 10%, rgba(255, 255, 255, 0.55), transparent 44%);
		transform: rotate(-26deg);
		animation: sheen-drift 14s linear infinite;
	}

	@keyframes ribbon-flow {
		from {
			translate: -16px -12px;
			scale: 1 1;
		}
		to {
			translate: 22px 18px;
			scale: 1.04 0.99;
		}
	}

	@keyframes sheen-drift {
		from {
			translate: -6% -2%;
		}
		to {
			translate: 6% 4%;
		}
	}

	@media (max-width: 1023px) {
		.motion-field {
			top: -15%;
			right: -10%;
			width: 100vw;
			height: 90vh;
			border-bottom-left-radius: 50vw;
			border-bottom-right-radius: 50vw;
			opacity: 0.6;
		}
	}

	@media (max-width: 639px) {
		.motion-field {
			top: -10%;
			right: -10%;
			width: 100vw;
			height: 75vh;
			border-bottom-left-radius: 50vw;
			border-bottom-right-radius: 50vw;
			opacity: 0.55;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.motion-ribbon,
		.motion-sheen {
			animation: none;
		}
	}
</style>

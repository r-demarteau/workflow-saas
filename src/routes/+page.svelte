<script lang="ts">
	const features = [
		{
			icon: 'OM',
			title: 'Order management',
			desc: 'See every WooCommerce order at a glance. Filter, search, and update status in seconds.'
		},
		{
			icon: 'CRM',
			title: 'Customer CRM',
			desc: 'Full customer profiles with order history, tickets, and notes - all in one place.'
		},
		{
			icon: 'TK',
			title: 'Support tickets',
			desc: 'Create and track tickets linked directly to orders. Never lose a customer conversation.'
		},
		{
			icon: 'WA',
			title: 'Live chat & WhatsApp',
			desc: 'Chat with customers in real time. WhatsApp integration included.'
		},
		{
			icon: 'AI',
			title: 'AI assistant',
			desc: 'Draft replies, summarise orders, and get product suggestions - powered by Claude.'
		},
		{
			icon: 'ISO',
			title: 'Fully isolated',
			desc: 'Your data lives in its own database. No shared infrastructure with other tenants.'
		}
	];

	const orders = [
		{ id: '#1042', customer: 'Sarah Johnson', amount: 'EUR 89.99', status: 'Processing' },
		{ id: '#1041', customer: 'Mark de Vries', amount: 'EUR 234.00', status: 'Completed' },
		{ id: '#1040', customer: 'Anna Muller', amount: 'EUR 49.50', status: 'On hold' }
	];
</script>

<svelte:head>
	<title>Teamdock — ecommerce operations for teams</title>
</svelte:head>

<section class="motion-hero relative overflow-hidden bg-white pt-20 sm:min-h-screen md:pt-28">
	<div class="hero-grid absolute inset-0"></div>
	<div class="motion-field" aria-hidden="true">
		<div class="motion-ribbon motion-ribbon-a"></div>
		<div class="motion-ribbon motion-ribbon-b"></div>
		<div class="motion-ribbon motion-ribbon-c"></div>
		<div class="motion-ribbon motion-ribbon-d"></div>
		<div class="motion-sheen"></div>
	</div>

	<div class="relative z-10 mx-auto flex sm:min-h-[560px] max-w-6xl flex-col items-start justify-center px-6 pb-32 pt-24 sm:pb-24 sm:pt-16">
		<div class="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/80 px-4 py-1.5 text-sm font-semibold text-gray-700 shadow-sm shadow-brand-100/60 backdrop-blur">
			<span class="h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
			Your WooCommerce workspace, live in minutes
		</div>

		<h1 class="max-w-4xl text-4xl font-extrabold leading-tight text-gray-950 sm:text-5xl md:text-6xl lg:text-7xl">
			Run your WooCommerce store<br class="hidden sm:inline" />
			like a <span class="text-brand-600">pro team</span>
		</h1>

		<p class="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl">
			Teamdock gives your team a dedicated portal — orders, customers, tickets, live chat,
			and AI — all synced with your store. Up and running on your own subdomain in minutes.
		</p>

		<div class="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
			<a href="/pricing" class="inline-flex items-center justify-center rounded-lg bg-brand-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-transparent transition-colors duration-150">
				Start free trial
			</a>
			<a href="/#features" class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white/80 px-8 py-4 text-base font-semibold text-gray-800 shadow-sm backdrop-blur hover:border-brand-200 hover:text-brand-700 transition-colors duration-150">
				See features
			</a>
		</div>

		<p class="mt-6 text-sm font-medium text-gray-500">Setup in under 5 min. Cancel any time. GDPR compliant.</p>
	</div>
</section>

<div class="relative z-10 mx-auto -mt-8 mb-8 max-w-6xl px-6">
	<div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/80">
		<div class="flex items-center gap-2 border-b border-gray-200 bg-gray-100 px-4 py-3">
			<div class="h-3 w-3 rounded-full bg-red-400"></div>
			<div class="h-3 w-3 rounded-full bg-yellow-400"></div>
			<div class="h-3 w-3 rounded-full bg-green-400"></div>
			<div class="ml-3 flex-1 rounded bg-white px-3 py-1 text-xs text-gray-400">acme.teamdock.ai</div>
		</div>
		<div class="grid h-72 grid-cols-1 sm:grid-cols-4">
			<div class="hidden sm:flex flex-col gap-3 border-r border-gray-100 bg-gray-50 p-4">
				<div class="flex items-center gap-1.5 px-1 pb-2 border-b border-gray-200 mb-1">
					<svg viewBox="116 117 280 280" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
						<rect x="116" y="151" width="140" height="48" rx="10" fill="#0f172a"/>
						<rect x="116" y="233" width="220" height="48" rx="10" fill="#2438ec"/>
						<rect x="116" y="315" width="280" height="48" rx="10" fill="#0f172a"/>
					</svg>
					<span class="text-xs font-bold"><span class="text-gray-800">team</span><span class="text-brand-600">dock</span></span>
				</div>
				{#each ['Orders', 'Customers', 'Tickets', 'Chat', 'Products', 'Settings'] as item}
					<div class="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 {item === 'Orders' ? 'bg-brand-600 text-white' : 'text-gray-500 hover:bg-gray-200'} text-sm transition-colors">
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
							<span class="rounded-full px-2.5 py-1 text-xs font-medium {order.status === 'Completed' ? 'bg-green-100 text-green-700' : order.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}">{order.status}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<section id="features" class="py-14 md:py-24">
	<div class="mx-auto max-w-6xl px-6">
		<div class="mb-10 md:mb-16 text-center">
			<h2 class="text-3xl font-bold text-gray-900 md:text-4xl">Everything your team needs</h2>
			<p class="mx-auto mt-4 max-w-xl text-lg text-gray-500">
				One workspace. All your WooCommerce tools. No context switching.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each features as f}
				<div class="card transition-shadow hover:shadow-md">
					<div class="mb-4 inline-flex h-10 min-w-10 items-center justify-center rounded-lg bg-brand-50 px-2 text-sm font-bold text-brand-700">{f.icon}</div>
					<h3 class="mb-2 text-lg font-semibold text-gray-900">{f.title}</h3>
					<p class="text-sm leading-relaxed text-gray-500">{f.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="border-y border-gray-200 bg-gray-50 py-10 md:py-16">
	<div class="mx-auto max-w-6xl px-6">
		<p class="mb-10 text-center text-sm font-medium uppercase tracking-wider text-gray-400">Trusted by WooCommerce teams across Europe</p>
		<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
			{#each ['Sanctuarium', 'BouwDirect', 'PrintShop NL', 'VitaStore'] as brand}
				<div class="flex items-center justify-center">
					<span class="text-xl font-bold text-gray-300">{brand}</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="py-14 md:py-24">
	<div class="mx-auto max-w-3xl px-6 text-center">
		<h2 class="text-4xl font-extrabold text-gray-900">Ready to launch your workspace?</h2>
		<p class="mt-4 text-lg text-gray-500">Pick a plan, enter your company name, and your portal is live in minutes.</p>
		<div class="mt-10">
			<a href="/pricing" class="btn-primary px-10 py-4 text-base">View pricing</a>
		</div>
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
		background: linear-gradient(158deg, rgba(255, 193, 7, 0), #ffb13d 22%, #ff4f8b 57%, rgba(124, 58, 237, 0.9) 100%);
		transform: rotate(-39deg) skewX(-10deg);
	}

	.motion-ribbon-b {
		right: 18%;
		top: -14%;
		background: linear-gradient(165deg, rgba(120, 189, 255, 0), #8cc8ff 18%, #a855f7 48%, #ff7a1a 88%);
		transform: rotate(-29deg) skewX(-13deg);
		animation-delay: -2.6s;
	}

	.motion-ribbon-c {
		right: 1%;
		top: -10%;
		background: linear-gradient(175deg, rgba(255, 255, 255, 0), #ffd166 16%, #fb7185 48%, #4f46e5 92%);
		transform: rotate(-18deg) skewX(-7deg);
		animation-delay: -5s;
	}

	.motion-ribbon-d {
		right: 54%;
		top: -24%;
		width: 21%;
		background: linear-gradient(170deg, rgba(255, 255, 255, 0), rgba(96, 165, 250, 0.65), rgba(255, 255, 255, 0.2));
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
			repeating-linear-gradient(105deg, rgba(255, 255, 255, 0.24) 0 1px, transparent 1px 15px),
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

	@keyframes panel-float {
		0%,
		100% {
			translate: 0 0;
		}
		50% {
			translate: 0 -16px;
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

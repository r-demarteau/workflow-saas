<script lang="ts">
	const features = [
		{
			icon: '📦',
			title: 'Order management',
			desc: 'See every WooCommerce order at a glance. Filter, search, and update status in seconds.'
		},
		{
			icon: '🤝',
			title: 'Customer CRM',
			desc: 'Full customer profiles with order history, tickets, and notes — all in one place.'
		},
		{
			icon: '🎫',
			title: 'Support tickets',
			desc: 'Create and track tickets linked directly to orders. Never lose a customer conversation.'
		},
		{
			icon: '💬',
			title: 'Live chat & WhatsApp',
			desc: 'Chat with customers in real time. WhatsApp integration included.'
		},
		{
			icon: '🤖',
			title: 'AI assistant',
			desc: 'Draft replies, summarise orders, and get product suggestions — powered by Claude.'
		},
		{
			icon: '🔒',
			title: 'Fully isolated',
			desc: 'Your data lives in its own database. No shared infrastructure with other tenants.'
		}
	];
</script>

<svelte:head>
	<title>NemoFirm — WooCommerce order management for teams</title>
</svelte:head>

<!-- Hero -->
<section class="relative flex min-h-screen items-center justify-center overflow-hidden bg-white pt-16">

	<!-- Animated gradient mesh -->
	<div class="gradient-mesh" aria-hidden="true">
		<div class="blob blob-1"></div>
		<div class="blob blob-2"></div>
		<div class="blob blob-3"></div>
		<div class="blob blob-4"></div>
		<div class="blob blob-5"></div>
	</div>

	<!-- Noise texture overlay for depth -->
	<div class="absolute inset-0 opacity-[0.03]" style="background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')"></div>

	<!-- Hero content -->
	<div class="relative z-10 mx-auto max-w-5xl px-6 py-32 text-center">
		<div class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-gray-600 mb-8 shadow-sm">
			<span class="h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
			Your WooCommerce workspace, live in minutes
		</div>

		<h1 class="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
			Run your WooCommerce<br />
			store like a <span class="gradient-text">pro team</span>
		</h1>

		<p class="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
			NemoFirm gives your team a dedicated portal — orders, customers, tickets, live chat, and AI
			— all synced with your WooCommerce store. Up and running on your own subdomain in minutes.
		</p>

		<div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
			<a href="/pricing" class="inline-flex items-center justify-center rounded-lg bg-brand-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-brand-500 transition-colors duration-150">
				Start free trial — no card needed
			</a>
			<a href="/#features" class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-150 shadow-sm">
				See features
			</a>
		</div>

		<p class="mt-6 text-sm text-gray-400">Setup in &lt; 5 min · Cancel any time · GDPR compliant</p>
	</div>

</section>

<style>
	/* ── Gradient mesh ───────────────────────────────────────────────── */
	.gradient-mesh {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	.blob {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.55;
		will-change: transform;
	}

	/* Purple */
	.blob-1 {
		width: 600px; height: 600px;
		background: radial-gradient(circle, #7c3aed, #4f46e5);
		top: -10%; right: 5%;
		animation: float1 14s ease-in-out infinite;
	}
	/* Blue */
	.blob-2 {
		width: 500px; height: 500px;
		background: radial-gradient(circle, #3b82f6, #06b6d4);
		top: 20%; right: 30%;
		animation: float2 18s ease-in-out infinite;
	}
	/* Orange */
	.blob-3 {
		width: 450px; height: 450px;
		background: radial-gradient(circle, #f97316, #eab308);
		top: -5%; right: -5%;
		animation: float3 16s ease-in-out infinite;
	}
	/* Pink */
	.blob-4 {
		width: 400px; height: 400px;
		background: radial-gradient(circle, #ec4899, #f43f5e);
		top: 30%; right: 10%;
		animation: float4 20s ease-in-out infinite;
	}
	/* Teal accent */
	.blob-5 {
		width: 300px; height: 300px;
		background: radial-gradient(circle, #14b8a6, #6366f1);
		top: 5%; right: 45%;
		animation: float5 12s ease-in-out infinite;
	}

	@keyframes float1 {
		0%, 100% { transform: translate(0, 0) scale(1); }
		33%       { transform: translate(-40px, 30px) scale(1.05); }
		66%       { transform: translate(20px, -20px) scale(0.97); }
	}
	@keyframes float2 {
		0%, 100% { transform: translate(0, 0) scale(1); }
		40%       { transform: translate(30px, -50px) scale(1.08); }
		70%       { transform: translate(-20px, 30px) scale(0.95); }
	}
	@keyframes float3 {
		0%, 100% { transform: translate(0, 0) scale(1); }
		30%       { transform: translate(-30px, 40px) scale(1.1); }
		60%       { transform: translate(40px, -10px) scale(0.95); }
	}
	@keyframes float4 {
		0%, 100% { transform: translate(0, 0) scale(1); }
		50%       { transform: translate(-50px, -40px) scale(1.06); }
	}
	@keyframes float5 {
		0%, 100% { transform: translate(0, 0) scale(1); }
		45%       { transform: translate(35px, 25px) scale(1.12); }
		80%       { transform: translate(-15px, -30px) scale(0.93); }
	}

	/* ── Gradient text ───────────────────────────────────────────────── */
	.gradient-text {
		background: linear-gradient(135deg, #6d28d9 0%, #3b82f6 40%, #f97316 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}
</style>

<!-- Mock UI — sits cleanly below the hero -->
<div class="relative z-10 mx-auto max-w-5xl px-6 mt-20 mb-8">
	<div class="rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/80 overflow-hidden">
		<div class="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
			<div class="h-3 w-3 rounded-full bg-red-400"></div>
			<div class="h-3 w-3 rounded-full bg-yellow-400"></div>
			<div class="h-3 w-3 rounded-full bg-green-400"></div>
			<div class="ml-3 flex-1 bg-white rounded px-3 py-1 text-xs text-gray-400">acme.nemofirm.com</div>
		</div>
		<div class="grid grid-cols-4 h-72">
			<div class="border-r border-gray-100 bg-gray-50 p-4 flex flex-col gap-3">
				{#each ['Orders', 'Customers', 'Tickets', 'Chat', 'Products', 'Settings'] as item}
					<div class="flex items-center gap-2 rounded-lg px-3 py-2 {item === 'Orders' ? 'bg-brand-600 text-white' : 'text-gray-500 hover:bg-gray-200'} text-sm cursor-pointer transition-colors">
						<div class="h-4 w-4 rounded bg-current opacity-40"></div>
						{item}
					</div>
				{/each}
			</div>
			<div class="col-span-3 p-6">
				<div class="flex items-center justify-between mb-4">
					<h3 class="font-semibold text-gray-800">Recent orders</h3>
					<div class="h-8 w-24 rounded-lg bg-brand-100"></div>
				</div>
				<div class="space-y-3">
					{#each [{ id: '#1042', customer: 'Sarah Johnson', amount: '€89.99', status: 'Processing' }, { id: '#1041', customer: 'Mark de Vries', amount: '€234.00', status: 'Completed' }, { id: '#1040', customer: 'Anna Müller', amount: '€49.50', status: 'On hold' }] as order}
						<div class="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
							<span class="text-sm font-mono text-gray-500">{order.id}</span>
							<span class="text-sm text-gray-700">{order.customer}</span>
							<span class="text-sm font-semibold text-gray-900">{order.amount}</span>
							<span class="text-xs px-2.5 py-1 rounded-full font-medium {order.status === 'Completed' ? 'bg-green-100 text-green-700' : order.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}">{order.status}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Features -->
<section id="features" class="py-24">
	<div class="mx-auto max-w-6xl px-6">
		<div class="text-center mb-16">
			<h2 class="text-3xl md:text-4xl font-bold text-gray-900">Everything your team needs</h2>
			<p class="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
				One workspace. All your WooCommerce tools. No context switching.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each features as f}
				<div class="card hover:shadow-md transition-shadow">
					<div class="text-3xl mb-4">{f.icon}</div>
					<h3 class="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
					<p class="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Social proof -->
<section class="py-16 bg-gray-50 border-y border-gray-200">
	<div class="mx-auto max-w-6xl px-6">
		<p class="text-center text-sm font-medium text-gray-400 uppercase tracking-wider mb-10">Trusted by WooCommerce teams across Europe</p>
		<div class="grid grid-cols-2 md:grid-cols-4 gap-8">
			{#each ['Sanctuarium', 'BouwDirect', 'PrintShop NL', 'VitaStore'] as brand}
				<div class="flex items-center justify-center">
					<span class="text-xl font-bold text-gray-300">{brand}</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA -->
<section class="py-24">
	<div class="mx-auto max-w-3xl px-6 text-center">
		<h2 class="text-4xl font-extrabold text-gray-900">Ready to launch your workspace?</h2>
		<p class="mt-4 text-lg text-gray-500">Pick a plan, enter your company name, and your portal is live in minutes.</p>
		<div class="mt-10">
			<a href="/pricing" class="btn-primary text-base px-10 py-4">View pricing</a>
		</div>
	</div>
</section>

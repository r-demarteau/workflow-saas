<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<nav class="fixed top-0 inset-x-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
	<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
		<a href="/" class="flex items-center gap-2.5">
			<svg viewBox="116 151 280 212" height="28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<rect x="116" y="151" width="140" height="48" rx="10" fill="#0f172a"/>
				<rect x="116" y="233" width="220" height="48" rx="10" fill="#4f46e5"/>
				<rect x="116" y="315" width="280" height="48" rx="10" fill="#0f172a"/>
			</svg>
			<span class="text-lg font-bold tracking-tight"><span class="text-gray-900">team</span><span class="text-brand-600">dock</span></span>
		</a>
		<div class="hidden md:flex items-center gap-8">
			<a href="/#features" class="text-sm font-medium text-gray-600 hover:text-gray-900">Features</a>
			<a href="/pricing" class="text-sm font-medium text-gray-600 hover:text-gray-900">Pricing</a>
		</div>
		<div class="flex items-center gap-3">
			<a href="/pricing" class="btn-primary text-sm px-5 py-2.5">Get started</a>
		</div>
	</div>
</nav>

{@render children()}

<footer class="border-t border-gray-200 bg-gray-50 py-12 mt-24">
	<div class="mx-auto max-w-6xl px-6">
		<div class="flex flex-col md:flex-row items-center justify-between gap-4">
			<div class="flex items-center gap-2">
				<svg viewBox="116 151 280 212" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
					<rect x="116" y="151" width="140" height="48" rx="10" fill="#0f172a"/>
					<rect x="116" y="233" width="220" height="48" rx="10" fill="#4f46e5"/>
					<rect x="116" y="315" width="280" height="48" rx="10" fill="#0f172a"/>
				</svg>
				<span class="font-semibold"><span class="text-gray-900">team</span><span class="text-brand-600">dock</span></span>
			</div>
			<p class="text-sm text-gray-500">© {new Date().getFullYear()} Teamdock. All rights reserved.</p>
			<div class="flex gap-6">
				<a href="/privacy" class="text-sm text-gray-500 hover:text-gray-700">Privacy</a>
				<a href="/terms" class="text-sm text-gray-500 hover:text-gray-700">Terms</a>
			</div>
		</div>
	</div>
</footer>

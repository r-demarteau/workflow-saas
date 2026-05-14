<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<nav class="fixed top-0 inset-x-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
	<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
		<a href="/" class="flex items-center gap-2">
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm">T</div>
			<span class="text-lg font-bold text-gray-900">Teamdock</span>
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
				<div class="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-xs">T</div>
				<span class="font-semibold text-gray-900">Teamdock</span>
			</div>
			<p class="text-sm text-gray-500">© {new Date().getFullYear()} Teamdock. All rights reserved.</p>
			<div class="flex gap-6">
				<a href="/privacy" class="text-sm text-gray-500 hover:text-gray-700">Privacy</a>
				<a href="/terms" class="text-sm text-gray-500 hover:text-gray-700">Terms</a>
			</div>
		</div>
	</div>
</footer>

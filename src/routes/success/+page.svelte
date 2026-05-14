<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let sessionId = $derived($page.url.searchParams.get('session_id') ?? '');
	let slug      = $state('');
	let email     = $state('');
	let plan      = $state('');
	let loaded    = $state(false);

	onMount(async () => {
		if (!sessionId) { loaded = true; return; }

		const res = await fetch(`/api/session?id=${encodeURIComponent(sessionId)}`);
		if (res.ok) {
			const data = await res.json();
			slug  = data.slug  ?? '';
			email = data.email ?? '';
			plan  = data.plan  ?? '';
		}
		loaded = true;
	});
</script>

<svelte:head>
	<title>Welcome to Teamdock!</title>
</svelte:head>

<div class="min-h-screen pt-28 pb-24 bg-gray-50 flex items-center justify-center">
	<div class="mx-auto max-w-lg px-6 w-full">
		{#if !loaded}
			<div class="flex justify-center py-20">
				<svg class="animate-spin h-10 w-10 text-brand-500" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
				</svg>
			</div>
		{:else}
			<div class="card text-center">
				<!-- Success animation -->
				<div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
					<svg class="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
					</svg>
				</div>

				<h1 class="text-3xl font-extrabold text-gray-900 mb-2">You're all set! 🎉</h1>
				<p class="text-gray-500 mb-8">
					{#if email}
						We've sent setup instructions to <strong class="text-gray-700">{email}</strong>.
					{:else}
						Your workspace is being provisioned right now.
					{/if}
				</p>

				{#if slug}
					<div class="mb-8 rounded-xl border border-brand-200 bg-brand-50 px-6 py-5">
						<p class="text-sm font-medium text-brand-700 mb-1">Your workspace URL</p>
						<a
							href="https://{slug}.teamdock.ai"
							target="_blank"
							rel="noopener noreferrer"
							class="text-xl font-bold text-brand-600 hover:underline break-all"
						>
							{slug}.teamdock.ai
						</a>
						<p class="text-xs text-brand-500 mt-2">Live within a few minutes · Check your email for login details</p>
					</div>
				{/if}

				<div class="space-y-3 text-left mb-8">
					<h3 class="text-sm font-semibold text-gray-700 text-center mb-4">What happens next</h3>
					{#each [
						{ step: '1', text: 'Your isolated workspace is being provisioned on our servers.' },
						{ step: '2', text: 'You\'ll receive an email with your admin login credentials.' },
						{ step: '3', text: 'Connect your WooCommerce store in Settings → Integrations.' },
						{ step: '4', text: 'Invite your team and you\'re live!' }
					] as s}
						<div class="flex items-start gap-3">
							<div class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-white text-xs font-bold">
								{s.step}
							</div>
							<p class="text-sm text-gray-600 pt-0.5">{s.text}</p>
						</div>
					{/each}
				</div>

				<a href="mailto:support@teamdock.ai" class="btn-secondary w-full">
					Need help? Contact support
				</a>
			</div>
		{/if}
	</div>
</div>

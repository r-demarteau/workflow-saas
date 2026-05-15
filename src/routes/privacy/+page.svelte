<svelte:head>
	<title>Privacy Policy — Teamdock</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-6 py-24">
	<h1 class="mb-2 text-4xl font-extrabold text-gray-900">Privacy Policy</h1>
	<p class="mb-12 text-sm text-gray-400">Last updated: 15 May 2026 · Version 1.1</p>

	<div class="prose prose-gray max-w-none space-y-10 text-gray-600 leading-relaxed">

		<section>
			<h2 class="mb-3 text-xl font-bold text-gray-900">1. Who we are</h2>
			<p>
				Teamdock is operated by <strong>Raymond Demarteau</strong>, based in the Netherlands
				("<strong>Teamdock</strong>", "we", "us"). This policy describes how we process the personal
				data of <strong>store operators</strong> — the businesses and individuals who subscribe to
				Teamdock to manage their WooCommerce store. It does not cover how your store's own
				customers' data is processed; that is governed by the
				<a href="/dpa" class="text-brand-600 hover:underline">Data Processing Agreement</a>.
			</p>
			<p class="mt-3">Questions: <a href="mailto:legal@teamdock.ai" class="text-brand-600 hover:underline">legal@teamdock.ai</a></p>
		</section>

		<section>
			<h2 class="mb-3 text-xl font-bold text-gray-900">2. What data we collect about you (the operator)</h2>
			<p>When you sign up for Teamdock we collect:</p>
			<ul class="mt-3 list-disc space-y-1 pl-6">
				<li><strong>Email address and company name</strong> — to provision your workspace and send transactional emails</li>
				<li><strong>Billing information</strong> — processed by Stripe on our behalf (we never store card details)</li>
				<li><strong>Usage data</strong> — logins, feature interactions, error logs (used for product improvement and support)</li>
				<li><strong>Technical data</strong> — IP address, browser type (logged for security purposes)</li>
			</ul>
			<p class="mt-3">
				Within your workspace, Teamdock syncs data from your WooCommerce store — orders, customers,
				and support messages — and stores it in your isolated database.
				<strong>You remain the data controller for that data.</strong> We process it on your behalf
				under our <a href="/dpa" class="text-brand-600 hover:underline">Data Processing Agreement</a>.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-xl font-bold text-gray-900">3. Legal basis and purpose</h2>
			<table class="w-full text-sm border-collapse mt-3">
				<thead>
					<tr class="bg-gray-50">
						<th class="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Purpose</th>
						<th class="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Legal basis (Art. 6 GDPR)</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td class="border border-gray-200 px-3 py-2">Provisioning and operating your workspace</td>
						<td class="border border-gray-200 px-3 py-2">Performance of contract (Art. 6(1)(b))</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2">Sending transactional emails (setup, login links, invoices)</td>
						<td class="border border-gray-200 px-3 py-2">Performance of contract (Art. 6(1)(b))</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2">Processing payments via Stripe</td>
						<td class="border border-gray-200 px-3 py-2">Performance of contract (Art. 6(1)(b))</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2">Security logging and fraud prevention</td>
						<td class="border border-gray-200 px-3 py-2">Legitimate interest (Art. 6(1)(f))</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2">Product improvement and diagnostics</td>
						<td class="border border-gray-200 px-3 py-2">Legitimate interest (Art. 6(1)(f))</td>
					</tr>
				</tbody>
			</table>
		</section>

		<section>
			<h2 class="mb-3 text-xl font-bold text-gray-900">4. Data storage and isolation</h2>
			<p>
				Each Teamdock workspace runs in its own isolated Docker container with a dedicated MariaDB
				database on servers located in the <strong>European Union</strong> (Hetzner, Germany).
				Your workspace data is never shared with other tenants.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-xl font-bold text-gray-900">5. Sub-processors</h2>
			<p>We use the following third-party processors. Where data is transferred outside the EU, Standard Contractual Clauses (SCCs) apply.</p>
			<table class="w-full text-sm border-collapse mt-3">
				<thead>
					<tr class="bg-gray-50">
						<th class="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Sub-processor</th>
						<th class="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Purpose</th>
						<th class="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Location</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td class="border border-gray-200 px-3 py-2"><strong>Hetzner Online GmbH</strong></td>
						<td class="border border-gray-200 px-3 py-2">Cloud infrastructure (servers, storage)</td>
						<td class="border border-gray-200 px-3 py-2">Germany (EU)</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2"><strong>Stripe, Inc.</strong></td>
						<td class="border border-gray-200 px-3 py-2">Payment processing and billing</td>
						<td class="border border-gray-200 px-3 py-2">US (SCC)</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2"><strong>OpenAI Ireland Ltd</strong></td>
						<td class="border border-gray-200 px-3 py-2">AI ticket analysis (if enabled in your workspace)</td>
						<td class="border border-gray-200 px-3 py-2">US (SCC)</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2"><strong>Google LLC (Vertex AI)</strong></td>
						<td class="border border-gray-200 px-3 py-2">AI ticket analysis (if enabled in your workspace)</td>
						<td class="border border-gray-200 px-3 py-2">US (SCC)</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2"><strong>Groq, Inc.</strong></td>
						<td class="border border-gray-200 px-3 py-2">AI ticket analysis (if enabled in your workspace)</td>
						<td class="border border-gray-200 px-3 py-2">US (SCC)</td>
					</tr>
				</tbody>
			</table>
			<p class="mt-3 text-sm text-gray-500">
				AI sub-processors only receive data when you have configured an AI provider in your workspace settings.
				They process support ticket content on your documented instruction. All three operate under SCCs
				pursuant to EU Decision 2021/914.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-xl font-bold text-gray-900">6. Data retention</h2>
			<p>
				Your account data (email, company name) is retained for as long as your subscription is
				active. Upon cancellation, all workspace data — including your store's customer data — is
				deleted within <strong>30 days</strong>, unless you request earlier deletion.
				Billing records are retained for 7 years as required by Dutch tax law.
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-xl font-bold text-gray-900">7. Your rights (GDPR)</h2>
			<p>
				As a data subject in the European Economic Area you have the right to access, rectify,
				restrict, port, and erase your personal data, and to object to processing based on
				legitimate interest. To exercise any of these rights, email
				<a href="mailto:legal@teamdock.ai" class="text-brand-600 hover:underline">legal@teamdock.ai</a>.
				We will respond within 30 days. You also have the right to lodge a complaint with the
				Dutch data protection authority (Autoriteit Persoonsgegevens, <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener" class="text-brand-600 hover:underline">autoriteitpersoonsgegevens.nl</a>).
			</p>
		</section>

		<section>
			<h2 class="mb-3 text-xl font-bold text-gray-900">8. Cookies</h2>
			<p>We use only essential session cookies required to operate the service. We do not use tracking or advertising cookies.</p>
		</section>

		<section>
			<h2 class="mb-3 text-xl font-bold text-gray-900">9. Changes to this policy</h2>
			<p>We may update this policy from time to time. We will notify you by email for material changes. Continued use of the service after changes constitutes acceptance.</p>
		</section>

		<section>
			<h2 class="mb-3 text-xl font-bold text-gray-900">10. Contact</h2>
			<p>
				<strong>Raymond Demarteau</strong><br>
				<a href="mailto:legal@teamdock.ai" class="text-brand-600 hover:underline">legal@teamdock.ai</a>
			</p>
		</section>

	</div>
</div>

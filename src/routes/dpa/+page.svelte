<svelte:head>
	<title>Data Processing Agreement — Teamdock</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-6 py-24">
	<h1 class="mb-2 text-4xl font-extrabold text-gray-900">Data Processing Agreement</h1>
	<p class="mb-4 text-sm text-gray-400">Last updated: 15 May 2026 · Version 1.0</p>
	<p class="mb-12 text-sm text-gray-500 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3">
		This Data Processing Agreement ("DPA") forms part of the
		<a href="/terms" class="text-brand-600 hover:underline">Terms of Service</a> between
		<strong>Raymond Demarteau (Teamdock)</strong> and the store operator ("you", "Controller").
		By signing up for Teamdock you accept this DPA. It is binding on both parties without
		requiring a separate signature.
	</p>

	<div class="prose prose-gray max-w-none space-y-10 text-gray-600 leading-relaxed">

		<!-- ── 1. Parties ── -->
		<section>
			<h2 class="mb-3 text-xl font-bold text-gray-900">1. Parties</h2>
			<ul class="list-disc space-y-1 pl-6">
				<li>
					<strong>Processor:</strong> Raymond Demarteau, operating as Teamdock, Netherlands —
					<a href="mailto:legal@teamdock.ai" class="text-brand-600 hover:underline">legal@teamdock.ai</a>
				</li>
				<li>
					<strong>Controller:</strong> The store operator who has created a Teamdock workspace
					(identified by the email address and company name provided at registration).
				</li>
			</ul>
		</section>

		<!-- ── 2. Subject matter and duration ── -->
		<section>
			<h2 class="mb-3 text-xl font-bold text-gray-900">2. Subject matter and duration</h2>
			<p>
				Teamdock processes personal data on behalf of the Controller to provide the Teamdock
				order management and customer support platform. Processing begins when the workspace is
				provisioned and continues until the subscription is terminated. Upon termination, data
				is deleted within 30 days as specified in clause 9.
			</p>
		</section>

		<!-- ── 3. Nature and purpose ── -->
		<section>
			<h2 class="mb-3 text-xl font-bold text-gray-900">3. Nature and purpose of processing</h2>
			<p>Teamdock processes personal data for the following purposes on the Controller's documented instruction:</p>
			<ul class="mt-3 list-disc space-y-1 pl-6">
				<li>Synchronising order and customer data from the Controller's WooCommerce store</li>
				<li>Storing and displaying support tickets, email messages, and WhatsApp conversations</li>
				<li>AI-assisted analysis of support tickets (summarisation, reply suggestions, intent detection) — only when enabled by the Controller</li>
				<li>Creating WooCommerce customer accounts on behalf of the Controller's staff</li>
				<li>Automatically archiving and deleting ticket data according to the retention schedule configured by the Controller</li>
			</ul>
		</section>

		<!-- ── 4. Categories of personal data ── -->
		<section>
			<h2 class="mb-3 text-xl font-bold text-gray-900">4. Categories of personal data processed</h2>
			<table class="w-full text-sm border-collapse mt-3">
				<thead>
					<tr class="bg-gray-50">
						<th class="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Category</th>
						<th class="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Examples</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td class="border border-gray-200 px-3 py-2">Identity</td>
						<td class="border border-gray-200 px-3 py-2">First name, last name, company name</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2">Contact details</td>
						<td class="border border-gray-200 px-3 py-2">Email address, phone number</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2">Address details</td>
						<td class="border border-gray-200 px-3 py-2">Billing address, shipping address, postal code</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2">Order details</td>
						<td class="border border-gray-200 px-3 py-2">Order numbers, products, amounts, payment method, order status</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2">Support content</td>
						<td class="border border-gray-200 px-3 py-2">Email content, WhatsApp messages, ticket replies, attachments</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2">VAT number</td>
						<td class="border border-gray-200 px-3 py-2">EU VAT number (if provided for B2B orders)</td>
					</tr>
				</tbody>
			</table>
			<p class="mt-3 text-sm text-gray-500">
				Data subjects are the Controller's store customers. Teamdock does not process special
				categories of personal data (Art. 9 GDPR) and the Controller must not submit such data
				to the platform.
			</p>
		</section>

		<!-- ── 5. Processor obligations (Art. 28(3)) ── -->
		<section>
			<h2 class="mb-3 text-xl font-bold text-gray-900">5. Processor obligations</h2>
			<p>In accordance with Article 28(3) GDPR, Teamdock shall:</p>

			<h3 class="mt-6 mb-2 text-base font-bold text-gray-800">5.1 Instruction</h3>
			<p>
				Process personal data only on the documented instructions of the Controller, including
				with regard to transfers of personal data to a third country or an international
				organisation, unless required to do so by Union or Member State law. In such a case,
				Teamdock shall inform the Controller of that legal requirement before processing, unless
				that law prohibits such information on grounds of public interest.
			</p>

			<h3 class="mt-6 mb-2 text-base font-bold text-gray-800">5.2 Confidentiality</h3>
			<p>
				Ensure that persons authorised to process personal data have committed themselves to
				confidentiality or are under an appropriate statutory obligation of confidentiality.
			</p>

			<h3 class="mt-6 mb-2 text-base font-bold text-gray-800">5.3 Security (Art. 32 GDPR)</h3>
			<p>Implement and maintain appropriate technical and organisational measures, including:</p>
			<ul class="mt-2 list-disc space-y-1 pl-6">
				<li>Encryption of data in transit (HTTPS/TLS 1.2+)</li>
				<li>Encryption of sensitive session credentials at rest (AES-256-GCM)</li>
				<li>Per-tenant database isolation — no data is shared between workspaces</li>
				<li>Automatic ticket archival and deletion according to configured retention periods</li>
				<li>CSRF protection on all write operations</li>
				<li>Rate limiting on authentication endpoints and API calls</li>
				<li>Access restricted to authenticated staff with appropriate WordPress roles</li>
				<li>Auth credentials and PII automatically omitted from application logs</li>
			</ul>

			<h3 class="mt-6 mb-2 text-base font-bold text-gray-800">5.4 Sub-processors</h3>
			<p>
				Not engage another processor (sub-processor) without prior written authorisation of the
				Controller. By accepting this DPA the Controller grants general written authorisation
				for the sub-processors listed in <strong>Annex A</strong>. Teamdock will notify the
				Controller of any intended changes concerning the addition or replacement of sub-processors
				by updating Annex A and providing at least <strong>14 days' notice</strong> by email,
				giving the Controller the opportunity to object.
			</p>

			<h3 class="mt-6 mb-2 text-base font-bold text-gray-800">5.5 Data subject rights</h3>
			<p>
				Taking into account the nature of the processing, assist the Controller by appropriate
				technical and organisational measures, insofar as possible, for the fulfilment of the
				Controller's obligation to respond to requests for exercising data subjects' rights
				under Chapter III of the GDPR. Teamdock provides the following tools:
			</p>
			<ul class="mt-2 list-disc space-y-1 pl-6">
				<li><strong>Art. 15/20 (Access/Portability):</strong> JSON data export available via the admin panel</li>
				<li><strong>Art. 17 (Erasure):</strong> Customer data purge via the admin panel; ticket deletion via retention settings</li>
				<li><strong>Art. 18 (Restriction):</strong> Tickets can be individually excluded from AI processing</li>
			</ul>

			<h3 class="mt-6 mb-2 text-base font-bold text-gray-800">5.6 Security breach assistance</h3>
			<p>
				Assist the Controller in ensuring compliance with obligations pursuant to Articles 32–36
				GDPR, taking into account the nature of processing and the information available to
				Teamdock. In the event of a personal data breach affecting Controller's data, Teamdock
				will notify the Controller without undue delay and in any event within <strong>72 hours</strong>
				of becoming aware of the breach. Notification will be sent to the email address on the
				Controller's account.
			</p>

			<h3 class="mt-6 mb-2 text-base font-bold text-gray-800">5.7 Deletion and return</h3>
			<p>
				At the choice of the Controller, delete or return all personal data to the Controller
				after the end of the provision of services relating to processing, and delete existing
				copies unless Union or Member State law requires storage of the personal data. Upon
				subscription cancellation, all workspace data is deleted within 30 days. The Controller
				may request a JSON export of their data at any time before deletion.
			</p>

			<h3 class="mt-6 mb-2 text-base font-bold text-gray-800">5.8 Audit rights</h3>
			<p>
				Make available to the Controller all information necessary to demonstrate compliance with
				the obligations laid down in Article 28 GDPR, and allow for and contribute to audits,
				including inspections, conducted by the Controller or an auditor mandated by the
				Controller. The Controller may request a compliance summary by emailing
				<a href="mailto:legal@teamdock.ai" class="text-brand-600 hover:underline">legal@teamdock.ai</a>.
				On-site audits require 30 days' notice and are subject to reasonable scheduling.
			</p>
		</section>

		<!-- ── 6. Controller obligations ── -->
		<section>
			<h2 class="mb-3 text-xl font-bold text-gray-900">6. Controller obligations</h2>
			<p>The Controller shall:</p>
			<ul class="mt-3 list-disc space-y-1 pl-6">
				<li>Ensure a lawful basis exists under GDPR for processing their store customers' personal data through Teamdock</li>
				<li>Maintain and publish an accurate privacy notice to their store customers describing how their data is processed</li>
				<li>Not submit special categories of personal data (Art. 9 GDPR) to the platform without implementing additional safeguards</li>
				<li>Configure appropriate data retention periods in their workspace settings</li>
				<li>Ensure their staff members are aware of data protection obligations when using the platform</li>
				<li>Notify Teamdock promptly if they become aware of any potential data protection issue arising from use of the platform</li>
			</ul>
		</section>

		<!-- ── 7. International transfers ── -->
		<section>
			<h2 class="mb-3 text-xl font-bold text-gray-900">7. International data transfers</h2>
			<p>
				All personal data is stored on EU servers (Hetzner, Germany). Transfers to non-EEA
				countries only occur when the Controller has enabled an AI provider (OpenAI, Google
				Gemini, or Groq). All such transfers are governed by Standard Contractual Clauses (SCCs)
				pursuant to EU Commission Decision 2021/914. The Controller's acceptance of this DPA
				constitutes authorisation for these transfers under the conditions set out in Annex A.
			</p>
		</section>

		<!-- ── 8. Governing law ── -->
		<section>
			<h2 class="mb-3 text-xl font-bold text-gray-900">8. Governing law</h2>
			<p>
				This DPA is governed by the laws of the Netherlands. Any dispute arising from this DPA
				shall be submitted to the competent court in the Netherlands.
			</p>
		</section>

		<!-- ── 9. Term and termination ── -->
		<section>
			<h2 class="mb-3 text-xl font-bold text-gray-900">9. Term and termination</h2>
			<p>
				This DPA remains in force for the duration of the subscription. Upon termination,
				Teamdock's obligation to process the Controller's data ceases and all data is deleted
				within 30 days in accordance with clause 5.7.
			</p>
		</section>

		<!-- ── Annex A ── -->
		<section>
			<h2 class="mb-3 text-xl font-bold text-gray-900">Annex A — Approved sub-processors</h2>
			<p class="mb-4 text-sm text-gray-500">
				Last updated: 15 May 2026. The Controller authorises the use of the following
				sub-processors. Changes are communicated by email with 14 days' notice.
			</p>
			<table class="w-full text-sm border-collapse">
				<thead>
					<tr class="bg-gray-50">
						<th class="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Sub-processor</th>
						<th class="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Purpose</th>
						<th class="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Location</th>
						<th class="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Transfer mechanism</th>
						<th class="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Required?</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td class="border border-gray-200 px-3 py-2"><strong>Hetzner Online GmbH</strong></td>
						<td class="border border-gray-200 px-3 py-2">Cloud infrastructure — servers and storage hosting all workspace databases</td>
						<td class="border border-gray-200 px-3 py-2">Germany (EU)</td>
						<td class="border border-gray-200 px-3 py-2">No transfer outside EU</td>
						<td class="border border-gray-200 px-3 py-2">Mandatory</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2"><strong>OpenAI Ireland Ltd</strong></td>
						<td class="border border-gray-200 px-3 py-2">AI ticket analysis: ticket subject, body, customer name, email, order summary, FAQ content</td>
						<td class="border border-gray-200 px-3 py-2">US</td>
						<td class="border border-gray-200 px-3 py-2">SCCs (EU Decision 2021/914)</td>
						<td class="border border-gray-200 px-3 py-2">Optional — only if AI provider is set to OpenAI in workspace settings</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2"><strong>Google LLC (Vertex AI / Gemini)</strong></td>
						<td class="border border-gray-200 px-3 py-2">AI ticket analysis: same data fields as above</td>
						<td class="border border-gray-200 px-3 py-2">US</td>
						<td class="border border-gray-200 px-3 py-2">SCCs (EU Decision 2021/914)</td>
						<td class="border border-gray-200 px-3 py-2">Optional — only if AI provider is set to Gemini in workspace settings</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2"><strong>Groq, Inc.</strong></td>
						<td class="border border-gray-200 px-3 py-2">AI ticket analysis: same data fields as above</td>
						<td class="border border-gray-200 px-3 py-2">US</td>
						<td class="border border-gray-200 px-3 py-2">SCCs (EU Decision 2021/914)</td>
						<td class="border border-gray-200 px-3 py-2">Optional — only if AI provider is set to Groq in workspace settings</td>
					</tr>
				</tbody>
			</table>
			<p class="mt-3 text-sm text-gray-500">
				Payment card data is processed by <strong>Stripe, Inc.</strong> (US, SCCs) solely for
				billing purposes and is not part of the controller-processor relationship under this DPA.
			</p>
		</section>

		<!-- ── Annex B ── -->
		<section>
			<h2 class="mb-3 text-xl font-bold text-gray-900">Annex B — Technical and organisational measures (Art. 32 GDPR)</h2>
			<p>Teamdock implements the following measures:</p>
			<table class="w-full text-sm border-collapse mt-3">
				<thead>
					<tr class="bg-gray-50">
						<th class="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Area</th>
						<th class="border border-gray-200 px-3 py-2 text-left font-semibold text-gray-700">Measure</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td class="border border-gray-200 px-3 py-2">Transit encryption</td>
						<td class="border border-gray-200 px-3 py-2">HTTPS/TLS 1.2+ on all connections; HSTS enforced</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2">At-rest encryption</td>
						<td class="border border-gray-200 px-3 py-2">Session credentials encrypted AES-256-GCM; disk-level encryption on Hetzner volumes</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2">Tenant isolation</td>
						<td class="border border-gray-200 px-3 py-2">Each tenant runs in a dedicated Docker container with its own MariaDB instance on a private network</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2">Access control</td>
						<td class="border border-gray-200 px-3 py-2">Authentication via WordPress session + HMAC-SHA256 tokens; role-based access (administrator / shop_manager)</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2">Session security</td>
						<td class="border border-gray-200 px-3 py-2">Cookies: HttpOnly, Secure, SameSite=Lax; CSRF tokens on all state-changing requests</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2">Rate limiting</td>
						<td class="border border-gray-200 px-3 py-2">Login attempts and API calls rate-limited per IP</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2">Log hygiene</td>
						<td class="border border-gray-200 px-3 py-2">Auth headers, tokens, passwords, and PII fields automatically redacted from application logs</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2">Data minimisation</td>
						<td class="border border-gray-200 px-3 py-2">Automatic archival after 365 days and permanent deletion after 730 days (configurable by Controller)</td>
					</tr>
					<tr>
						<td class="border border-gray-200 px-3 py-2">Backups</td>
						<td class="border border-gray-200 px-3 py-2">Nightly encrypted database backups stored on the same EU infrastructure</td>
					</tr>
				</tbody>
			</table>
		</section>

		<section>
			<h2 class="mb-3 text-xl font-bold text-gray-900">Contact</h2>
			<p>
				Questions about this DPA or to submit a data protection request:<br>
				<strong>Raymond Demarteau</strong><br>
				<a href="mailto:legal@teamdock.ai" class="text-brand-600 hover:underline">legal@teamdock.ai</a>
			</p>
		</section>

	</div>
</div>

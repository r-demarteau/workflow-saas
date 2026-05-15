# Data Processing Agreement — Teamdock

**Version:** 1.0  
**Effective date:** 15 May 2026  
**Processor:** Raymond Demarteau (trading as Teamdock), Netherlands — legal@teamdock.ai  
**Controller:** The store operator who has created a Teamdock workspace.

This DPA is incorporated by reference into the Terms of Service and is binding on both parties upon account creation.

---

## 1. Subject matter and duration

Teamdock processes personal data on behalf of the Controller to provide the Teamdock order management and customer support platform. Processing begins when the workspace is provisioned and ends 30 days after subscription termination.

## 2. Nature and purpose of processing

- Synchronising order and customer data from the Controller's WooCommerce store
- Storing and displaying support tickets, email, and WhatsApp conversations
- AI-assisted ticket analysis (only when enabled by the Controller)
- Creating WooCommerce customer accounts on behalf of the Controller's staff
- Automatic archival and deletion per the Controller's retention settings

## 3. Categories of personal data

| Category | Examples |
|----------|---------|
| Identity | First name, last name, company name |
| Contact | Email address, phone number |
| Address | Billing address, shipping address, postal code |
| Orders | Order numbers, products, amounts, payment method, status |
| Support content | Email content, WhatsApp messages, ticket replies, attachments |
| VAT number | EU VAT number (B2B orders) |

Data subjects: store customers of the Controller.  
Special categories (Art. 9 GDPR): not processed. Controller must not submit such data.

## 4. Processor obligations (Art. 28(3) GDPR)

**(a) Instruction** — Process only on the Controller's documented instructions.

**(b) Confidentiality** — All authorised persons are bound by confidentiality.

**(c) Security (Art. 32)** — See Annex B.

**(d) Sub-processors** — General written authorisation granted for sub-processors in Annex A. 14 days' notice of any changes, with right to object.

**(e) Data subject rights** — Assist Controller via: JSON export (Art. 15/20), customer purge tool (Art. 17), per-ticket AI opt-out (Art. 18).

**(f) Breach notification** — Notify Controller within 72 hours of becoming aware of a personal data breach.

**(g) Deletion** — Delete all personal data within 30 days of subscription termination. JSON export available on request before deletion.

**(h) Audit** — Provide compliance information on request. On-site audits require 30 days' notice.

## 5. Controller obligations

- Maintain a lawful basis for processing store customers' data through Teamdock
- Publish an accurate privacy notice to store customers
- Not submit special categories of data without additional safeguards
- Configure appropriate retention periods in workspace settings
- Notify Teamdock of any known data protection issues

## 6. International transfers

All data stored in EU (Hetzner, Germany). Transfers to US occur only when an AI provider is enabled by the Controller. All transfers governed by SCCs (EU Decision 2021/914).

## 7. Governing law

Netherlands. Disputes submitted to the competent Dutch court.

---

## Annex A — Approved sub-processors

| Sub-processor | Purpose | Location | Transfer | Required? |
|---------------|---------|----------|----------|-----------|
| Hetzner Online GmbH | Cloud infrastructure | Germany (EU) | None | Mandatory |
| OpenAI Ireland Ltd | AI ticket analysis | US | SCCs | Optional |
| Google LLC (Vertex AI) | AI ticket analysis | US | SCCs | Optional |
| Groq, Inc. | AI ticket analysis | US | SCCs | Optional |

*Stripe, Inc. (US, SCCs) processes billing data only and is not subject to this DPA.*

---

## Annex B — Technical and organisational measures

| Area | Measure |
|------|---------|
| Transit encryption | HTTPS/TLS 1.2+; HSTS enforced |
| At-rest encryption | Session credentials AES-256-GCM; Hetzner volume encryption |
| Tenant isolation | Dedicated Docker container + MariaDB per tenant; private network |
| Access control | WordPress session + HMAC-SHA256 tokens; role-based access |
| Session security | HttpOnly, Secure, SameSite=Lax cookies; CSRF tokens |
| Rate limiting | Login attempts and API calls rate-limited per IP |
| Log hygiene | Auth credentials and PII redacted from application logs |
| Data minimisation | Auto-archival at 365 days; permanent deletion at 730 days (configurable) |
| Backups | Nightly encrypted database backups on EU infrastructure |

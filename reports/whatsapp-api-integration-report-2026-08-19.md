# WhatsApp API Integration Report

Date: 2026-08-19
Workspace: /home/medel/repos/medel/common

## 1) Executive summary

Current WhatsApp sending in this repo is link-based (wa.me / api.whatsapp.com) and browser-driven.
That means user confirmation is inherently required and there is no true server-side automation.

To automate daily sends at 08:00 with minimal cost, move sending to WhatsApp Cloud API (direct Meta) and trigger from Cloudflare Worker cron.

Recommendation:

- Keep current UI flows for ad-hoc/manual messaging as fallback.
- Add a backend send path for automated menu broadcast.
- Reuse current menu builder logic, but extract formatting to a shared server-safe module.

## 2) Current state (as implemented)

### 2.1 Core WhatsApp composable

- `sites/guillermomedel.com/composables/useWhatsappOrder.ts`
  - `waLink(text, phone?)` builds `https://api.whatsapp.com/send?...`
  - `openWhatsApp(text, phone?)` opens browser/app and requires user confirmation.
  - `formatMenu(...)`, `formatOrder(...)`, `formatReady(...)` build message bodies.

### 2.2 Staff orders flow

- `sites/guillermomedel.com/composables/useComandas.ts`
  - `sendTodayMenu()` builds menu text and opens WhatsApp tab.
  - `send()` saves order to PocketBase, then opens WhatsApp link.
  - `completeOrder()` may send ready notice through WhatsApp link.
- `sites/guillermomedel.com/pages/orders.vue`
  - UI button "Enviar menu del dia" calls `sendTodayMenu()`.

### 2.3 Other WhatsApp senders

- `sites/guillermomedel.com/composables/Usechecklists.ts`
  - Sends checklist completion/reopen messages through WhatsApp link.
- `sites/guillermomedel.com/composables/useWeeklyPreorder.ts`
  - Sends preorder summary through WhatsApp link.
- `sites/guillermomedel.com/pages/socios.vue`
  - Sends member summary through `openWhatsApp(...)`.

### 2.4 Existing backend worker

- `chatgpt-proxy/src/index.ts`
  - Handles OpenAI proxy requests only.
- `chatgpt-proxy/wrangler.jsonc`
  - No cron triggers configured.

## 3) Why manual confirmation exists today

- Current send mechanism is deep-link/open URL based.
- WhatsApp app/web intentionally requires final user action for these links.
- There is no server credential or API call that submits messages directly.

Conclusion: full unattended send is not possible with current link strategy.

## 4) Target architecture for true automation

## 4.1 Design goals

- Fully automated daily menu send at 08:00 local time.
- Lowest recurring cost.
- Keep existing front-end workflows intact while introducing backend automation.
- Add observability (logs, retries, errors).

## 4.2 Recommended stack

- Channel provider: Meta WhatsApp Cloud API (direct, no aggregator markup).
- Scheduler: Cloudflare Worker cron trigger.
- Data source: existing PocketBase `menu` record (`active`/rotation logic).
- Recipient source: PocketBase collection for opted-in numbers.

## 4.3 Proposed components

1. `MenuResolver` (server-side)

- Reads today menu from PocketBase (same rule as app: active for date, else rotation fallback).
- Returns normalized menu payload for message rendering.

2. `MessageFormatter` (shared module)

- Move message body logic from `useWhatsappOrder.ts` to a shared TS utility with no `window`/`navigator`.
- Frontend composable can call this shared function.
- Worker cron can call same function to avoid divergence.

3. `WhatsAppGateway`

- Sends template messages via Graph API:
  - `POST /vXX.X/{PHONE_NUMBER_ID}/messages`
- Handles API errors and returns structured send result.

4. `BroadcastScheduler`

- Worker `scheduled` handler runs daily at 08:00.
- Builds menu text and dispatches to recipients.
- Writes per-recipient send logs.

5. `SendLog` + retry

- Persist result status (`success`, `failed`, `retrying`) and provider response.
- Retry transient failures with bounded backoff.

## 4.4 Deployment shape

Option A (fastest): extend current `chatgpt-proxy` worker

- Add `scheduled()` plus an internal authenticated route for manual trigger.
- Pros: fewer services.
- Cons: mixes AI proxy and messaging responsibilities.

Option B (cleaner): create `whatsapp-dispatcher` worker

- Keep AI proxy isolated.
- Pros: better separation, easier policy/security controls.
- Cons: one extra worker project.

Recommendation: Option A for pilot, Option B when stabilized.

## 5) Integration into current app architecture

## 5.1 Keep current user journey

- No immediate UI rewrite required.
- Existing manual-send buttons continue to work during transition.

## 5.2 Introduce backend API path for send actions

Add a new app-internal endpoint (or worker route), for example:

- `POST /api/whatsapp/menu/send-now`
- `POST /api/whatsapp/order-ready`
- `POST /api/whatsapp/checklist`

Then migrate callers gradually:

- `useComandas.sendTodayMenu()` -> call backend endpoint instead of `waLink`.
- Later: `completeOrder()`, `Usechecklists`, `useWeeklyPreorder`, `socios`.

## 5.3 Shared formatter extraction plan

Current formatter functions are in `useWhatsappOrder.ts` alongside browser-only helpers.
Split into:

- `sites/guillermomedel.com/utils/whatsapp/formatters.ts` (pure functions)
- Keep `waLink/openWhatsApp` in composable for manual fallback.

This avoids duplicate templates and keeps existing message style unchanged.

## 5.4 Data model proposal (PocketBase)

Add collections:

1. `whatsapp_recipients`

- `phone_e164` (string, required)
- `name` (string, optional)
- `active` (bool)
- `opted_in` (bool)
- `segment` (string, optional)
- `last_sent_at` (datetime, optional)
- `last_error` (string, optional)

2. `whatsapp_broadcast_logs`

- `campaign_date` (date)
- `message_type` (string: `daily_menu`)
- `recipient_phone` (string)
- `status` (string: `success|failed|retrying|skipped`)
- `provider_message_id` (string, optional)
- `error_code` (string, optional)
- `error_message` (string, optional)
- `attempt` (number)
- `created_at` (datetime)

## 6) Scheduling details

- Cron at local 08:00 (confirm timezone in worker config/process).
- Add idempotency guard by date+recipient so re-runs do not duplicate sends.
- Add manual trigger endpoint with auth for operational retries.

## 7) Security and compliance

- Use worker secrets for API token and phone number ID.
- Restrict internal trigger endpoint with signed token header.
- Respect opt-in and STOP handling.
- Use approved message templates when outside customer-care window.

## 8) Cost profile (low-cost path)

- Infrastructure: Cloudflare Worker cost near zero at low volume.
- Messaging: direct Meta per-conversation pricing (usually low for small daily list).
- Avoid aggregator fees by using Meta Cloud API directly.

## 9) Migration plan and effort

Phase 1 (1 day): pilot

- Add API credentials, template, test recipients.
- Implement worker send function + manual trigger route.
- Verify send logs and delivery statuses.

Phase 2 (1-2 days): scheduled automation

- Add daily cron and idempotency checks.
- Add retries and failure reporting.

Phase 3 (1-2 days): app integration cleanup

- Extract shared formatters.
- Switch `sendTodayMenu()` to backend API path.
- Keep link-based fallback behind feature flag.

Estimated total: 3-5 days to production-ready flow.

## 10) Risks and mitigations

1. Template approval delays

- Mitigation: create and submit template early with simple placeholders.

2. Timezone mistakes causing wrong send time

- Mitigation: explicit timezone conversion and runbook check.

3. Duplicate sends from retries/manual trigger

- Mitigation: idempotency key (`campaign_date + recipient_phone`).

4. Drift between frontend and backend message formats

- Mitigation: shared formatter module used by both.

## 11) Recommended next step in this repo

Implement a small pilot first:

1. Add a worker route `POST /whatsapp/send-daily-menu` (auth protected).
2. Pull menu from PocketBase and send to 1-3 test numbers.
3. Log outcomes to PocketBase.
4. After validation, enable cron schedule.

This gives immediate proof with minimal cost and minimal disruption.

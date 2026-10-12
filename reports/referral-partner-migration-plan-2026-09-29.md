# Referral Partner Migration Plan

Date: 2026-09-29
Target: `api.sancarlosinsider.com` (PocketBase v0.22.22)

## Objective

Add referral-partner presentation profiles without changing property ownership, user authentication, or existing records. Brenda remains the default site identity and local transaction contact. A valid `?ref=<slug>` selects a co-branded presentation profile.

## Production Baseline

- `users`: 4 records
- `properties`: 18 records
- Brenda user ID: `st19vhfly1zoxh8`
- Existing collections and records remain untouched during phase 1.

## Phase 1: Additive Collection

Create `referralPartners` as a new base collection.

Public fields:

- `slug`: required, unique text
- `active`: boolean
- `name`: required text
- `title`: text
- `brokerage`: text
- `photo`: single image file
- `photo_url`: optional externally hosted portrait URL; takes precedence over `photo`
- `bio`: text
- `phone`: text
- `whatsapp_phone`: text
- `email`: email
- `calendly_url`: URL
- `socials`: JSON
- `hero_title`: text
- `hero_description`: text
- `welcome_message`: text
- `accent_color`: text
- `hero_image`: single image file
- `hero_video_url`: optional externally hosted video URL; defaults to the standard site background video
- `landing_content`: JSON configuration for SEO, hero, properties, social, blog, contact, and footer copy

Rules:

- List/view: public, so referral pages can resolve active profiles.
- Create/update/delete: superuser only.
- The application must additionally require `active = true` when resolving a public referral.

Do not store commission terms in this public collection. Commission agreements and payment data require a separate private collection in a later migration.

`landing_content` is intentionally additive and optional. Existing dedicated fields remain valid fallbacks, so adding these fields does not rewrite or invalidate any partner record.

## Test Seed

Create and retain this record:

- `slug`: `ana-sofia`
- `active`: true
- `name`: `Ana Sofia`
- `title`: `Referral Real Estate Agent`
- `brokerage`: `Demo Realty USA`
- `bio`: `Helping buyers explore relocation and real estate opportunities in San Carlos, Sonora.`
- `hero_title`: `Explore San Carlos with Ana Sofia`
- `hero_description`: `Discover homes, rentals, and relocation guidance in partnership with Brenda, your local San Carlos real estate specialist.`
- `welcome_message`: `Ana Sofia has partnered with RelocateToSanCarlos.com to help you explore opportunities in San Carlos.`
- `accent_color`: `#0f766e`

Contact fields may remain blank because this is a non-deliverable test identity.

## Validation

1. Confirm `referralPartners` exists and Ana Sofia resolves by `slug = "ana-sofia"`.
2. Confirm public list/view succeeds and public writes remain denied.
3. Confirm `users` remains at 4 records.
4. Confirm `properties` remains at 18 records.
5. Confirm Brenda's user and all property authors are unchanged.
6. Test the site with `?ref=ana-sofia` and without a referral parameter.
7. Confirm the Ana Sofia landing contains no Brenda-facing copy while the default landing remains unchanged.
8. Confirm both custom media fields resolve through the public PocketBase files endpoint when populated.

## Rollback

Phase 1 does not alter existing collections. If rollback is needed, disable the referral integration in code and mark the profile inactive. Do not delete Ana Sofia, per the test-data requirement. The unused additive collection can remain without affecting current site behavior.

## Later Migration

After presentation testing succeeds:

- Add referral attribution to persisted inquiries.
- Add a private `referralDeals` collection for commission agreements and payment status.
- Snapshot agreed commission terms per deal rather than reading mutable defaults.
- Keep partners unauthenticated unless reporting access becomes a real requirement.

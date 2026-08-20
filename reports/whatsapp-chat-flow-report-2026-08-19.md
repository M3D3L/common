# WhatsApp Chat Flow Report

Date: 2026-08-19
Workspace: /home/medel/repos/medel/common

## Purpose

Describe how WhatsApp is used today in the app as a chat channel:

- Entry points (UI/composables)
- Message composition
- Routing targets
- Persistence behavior
- Operational constraints

## Scope reviewed

- sites/guillermomedel.com/composables/useWhatsappOrder.ts
- sites/guillermomedel.com/composables/useComandas.ts
- sites/guillermomedel.com/composables/useMenuLink.ts
- sites/guillermomedel.com/composables/Usechecklists.ts
- sites/guillermomedel.com/composables/useWeeklyPreorder.ts
- sites/guillermomedel.com/pages/menu.vue
- sites/guillermomedel.com/pages/orders.vue
- sites/guillermomedel.com/pages/socios.vue
- sites/guillermomedel.com/components/organisms/ClockIn.vue
- sites/guillermomedel.com/components/organisms/Comandas/Ticket.vue
- components/molecules/WhatsappButton.vue

## High-level architecture

WhatsApp is currently used as a client-side link channel.
The app builds a text payload and opens WhatsApp using api.whatsapp.com / wa.me URLs.

No server-side WhatsApp API integration exists in this workspace.
No inbound webhook processing is implemented.

## Core WhatsApp utility

File: sites/guillermomedel.com/composables/useWhatsappOrder.ts

Key responsibilities:

- Message builders:
  - formatOrder
  - formatMenu
  - formatSoldOut
  - formatReady
  - formatChecklist
  - formatChecklistReopen
  - formatChecklistItem
- URL/link helpers:
  - waLink(text, phone?)
  - openWhatsApp(text, phone?)
- Device behavior:
  - iOS/macOS touch devices use direct navigation
  - other devices open popup/new tab with fallback

This composable is the central formatter and link generator across most flows.

## End-to-end chat flows

### Flow 1: Staff sends Daily Menu broadcast

Trigger:

- Button in sites/guillermomedel.com/pages/orders.vue -> sendTodayMenu

Orchestration:

- sites/guillermomedel.com/composables/useComandas.ts::sendTodayMenu
  - Validates that today menu has items
  - Builds text via formatMenu
  - Opens blank tab synchronously
  - Navigates tab to waLink(text)

Data dependency:

- Uses current active menu state (from menu record / rotation resolution in useComandas store)

Persistence:

- No dedicated WhatsApp send log record

Target:

- Generic WhatsApp composer (no fixed recipient in this function)

### Flow 2: Public customer order from menu page

Trigger:

- Customer submits order in sites/guillermomedel.com/pages/menu.vue::sendOrder

Orchestration:

- Builds order text with useMenuLink.formatCustomerOrder
- Creates kitchen order record in PocketBase collection comandas
- Opens WhatsApp URL using waLink(text, RESTAURANT_WHATSAPP)

Data dependency:

- Resolved active menu for selected date
- Cart, mode, customer info, taquiza breakdown

Persistence:

- Creates a comandas record first (best effort), then opens WhatsApp

Target:

- Fixed restaurant number (RESTAURANT_WHATSAPP)

### Flow 3: Staff order send from comandas panel

Trigger:

- send action in sites/guillermomedel.com/composables/useComandas.ts::send

Orchestration:

- Snapshot order/cart state
- Optionally tags member code in note
- Builds message with formatOrder
- Saves order record in comandas collection
- Opens WhatsApp via sendToTab(waLink(text))

Persistence:

- DB-first pattern: createItem(comandas) attempted before WhatsApp open
- Local store updated optimistically, realtime dedupes by recordId

Target:

- Generic WhatsApp composer (no fixed recipient in this function)

### Flow 4: Order ready message to member

Trigger:

- Mark order ready in useComandas.completeOrder

Orchestration:

- Optionally resolves member phone by member code
- Deletes order record from comandas (hard delete active queue model)
- Builds ready message with formatReady
- Opens waLink(text, memberPhone)

Persistence:

- Queue closure is persisted first (deleteItem), then WhatsApp notification

Target:

- Member phone number (if available)

### Flow 5: Sold-out / back-in-stock notices

Trigger:

- Staff toggles availability in useComandas.toggleOut

Orchestration:

- Updates sold_out state and menu record
- Builds short status text via formatSoldOut
- Opens WhatsApp link

Persistence:

- sold_out is persisted in menu record; WhatsApp send itself is not logged

Target:

- Generic WhatsApp composer

### Flow 6: Checklist completion and reopen notifications

Trigger:

- Usechecklists.completeChecklist / reopenChecklist

Orchestration:

- Builds checklist message with formatChecklist or formatChecklistReopen
- Saves checklist data first (flushSave)
- Opens WhatsApp via waLink

Persistence:

- Checklist state persisted in checklists collection before sending link

Target:

- Generic WhatsApp composer

### Flow 7: Weekly preorder summary

Trigger:

- useWeeklyPreorder.submit

Orchestration:

- Iterates selected preorder days
- Persists each day as comandas item
- Aggregates multiple day texts using formatOrder
- Opens one WhatsApp draft containing full summary

Persistence:

- Attempts to persist each preorder command before opening final WhatsApp link

Target:

- Generic WhatsApp composer

### Flow 8: Member summary from socios page

Trigger:

- sites/guillermomedel.com/pages/socios.vue::sendSummary

Orchestration:

- Builds membership balance/history message inline in page
- Calls openWhatsApp(message, member.phone)

Persistence:

- No send log persistence

Target:

- Specific member phone

### Flow 9: Clock-in/clock-out announcements

Trigger:

- sites/guillermomedel.com/components/organisms/ClockIn.vue::toggle

Orchestration:

- Writes punch first to clockins record
- Builds shift message (entry/exit + timestamp)
- Opens WhatsApp via waLink

Persistence:

- punch write first, then WhatsApp draft open

Target:

- Generic WhatsApp composer

### Flow 10: Direct phone link in ticket card

Trigger:

- Click phone link in sites/guillermomedel.com/components/organisms/Comandas/Ticket.vue

Orchestration:

- Renders direct wa.me link for member phone

Persistence:

- None

Target:

- Specific member phone

### Flow 11: Generic WhatsApp button component

Trigger:

- components/molecules/WhatsappButton.vue

Orchestration:

- Renders wa.me link with prefilled text

Persistence:

- None

Target:

- Prop-provided phone and message

## Message composition map

Centralized in useWhatsappOrder:

- Kitchen-facing operational messages: formatOrder, formatSoldOut, formatReady
- Broadcast-style messages: formatMenu
- Checklist messages: formatChecklist, formatChecklistReopen, formatChecklistItem

Separate builder:

- useMenuLink.formatCustomerOrder for public menu customer order text

Inline page builder:

- socios.vue sendSummary builds member summary in-page

## Data and sequence patterns

Common pattern in operational flows:

1. Open blank tab inside click gesture (popup-safe)
2. Persist business state to PocketBase
3. Navigate prepared tab to WhatsApp URL

This pattern is visible in:

- useComandas.send
- useComandas.toggleOut
- useComandas.completeOrder
- Usechecklists.completeChecklist/reopenChecklist
- ClockIn.toggle

Rationale:

- Prevent popup blocking by opening tab before await
- Preserve DB-first behavior in most critical flows

## Chat channel characteristics

Current channel type:

- Outbound draft generation through URL scheme

Not implemented:

- Server-to-WhatsApp direct send
- Delivery status callbacks
- Inbound message webhooks
- Automated conversation state machine

Implications:

- Final send confirmation is manual in WhatsApp client
- No native delivery receipts inside app database
- No centralized audit trail for message send outcomes

## Known strengths

- Consistent message formatting via shared composable
- Strong operational bias toward DB-first then chat open
- Multiple business workflows already wired to WhatsApp entry points
- Supports both generic composer and fixed-recipient drafts

## Known constraints

- Manual user confirmation required to actually send
- Several flows open generic composer without fixed recipient
- No unified message send log model
- No inbound-to-app automation from WhatsApp replies

## Recommended documentation follow-up

If desired, create an internal runbook with:

1. Who owns each flow (orders, menu, checklists, socios, clock-in)
2. Which flows require fixed recipients vs generic composer
3. What to verify before daily operations (menu loaded, member phones present)
4. Failure handling (DB save fails, popup blocked, missing phone)

## Summary

WhatsApp in this app is implemented as a multi-flow outbound draft channel tightly coupled to business actions.
It is not yet a two-way integrated messaging platform.
The strongest implemented pattern is DB-first persistence followed by client-side WhatsApp draft opening, which protects business state even when messaging is user-confirmed.

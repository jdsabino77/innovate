# Ticket Purchasing — Innovate 2027

Online pass sales for the **Innovate Medical Aesthetics Conference** (February 27, 2027, Toronto).

## Decision: Ticket Tailor (primary)

We use **[Ticket Tailor](https://www.tickettailor.com/)** for checkout, QR code tickets, and door check-in. The Innovate site embeds Ticket Tailor’s box-office widget on [`/register`](../src/pages/register.astro) so attendees purchase passes without leaving the conference website.

**Alternative considered:** [Eventbrite Canada](https://www.eventbrite.ca/) — more familiar to Canadian attendees, but materially higher fees (see comparison below). Eventbrite remains a viable fallback if brand recognition outweighs cost savings.

---

## Fee comparison (Canada, C$499 pass example)

Sources: [Eventbrite Canada fees](https://www.eventbrite.ca/help/en-ca/articles/755615/eventbrite-fees/), [Ticket Tailor pricing](https://www.tickettailor.com/pricing), [Stripe Canada](https://stripe.com/en-ca/pricing).

| | **Ticket Tailor** (chosen) | **Eventbrite** (alternative) |
|---|---|---|
| Platform fee | ~C$1.00 flat per ticket (pay-as-you-go) | 3.5% + C$1.29 = **C$18.76** |
| Payment processing | 2.9% + C$0.30 = **C$15.07** (your Stripe account) | 2.9% of order ≈ **C$15.02** |
| **Total per C$499 pass** | **~C$16 (~3.2%)** | **~C$34 (~6.8%)** |
| **150 passes sold** | **~C$2,400 in fees** | **~C$5,100 in fees** |
| **Delta (Eventbrite vs TT)** | — | **~C$2,700 more** on 150 passes |

Fees can be passed to the buyer (default) or absorbed by the organizer on either platform.

### What Ticket Tailor includes

- Branded checkout (embed on innovate site)
- Confirmation email with **QR code** ticket
- Check-in mobile app for registration desk
- Multiple ticket tiers, promo codes, waitlists, refunds
- CAD sales via **Stripe** payout to Yasa Laser’s bank account
- Attendee export (CSV)

### Ticket Tailor in Canada

Ticket Tailor is a UK-based platform (since 2010) used in 120+ countries. It is **not** a Canadian company like Eventbrite.ca, but it fully supports **CAD**, Canadian Stripe payouts, and HST collection. For a host-driven professional conference, the checkout experience matters more than platform name recognition.

---

## Site integration

### Configuration — [`event-config.json`](../event-config.json)

```json
"ticketing": {
  "provider": "ticket-tailor",
  "enabled": false,
  "embedUrl": "",
  "checkoutUrl": ""
}
```

| Field | Purpose |
|---|---|
| `enabled` | Set `true` when Ticket Tailor event is live |
| `embedUrl` | Box office widget URL from Ticket Tailor → **Promote → Website embed codes** (e.g. `https://www.tickettailor.com/all-tickets/your-event-id`) |
| `checkoutUrl` | Fallback direct checkout link if embed is not used |

### Ticket tier display — [`src/data/tickets.json`](../src/data/tickets.json)

Marketing copy and tier cards on `/register` (Early bird, Conference pass, VIP). **Prices and inventory are controlled in Ticket Tailor** — keep `tickets.json` in sync when tiers go live.

### Register page — [`src/pages/register.astro`](../src/pages/register.astro)

- **Closed:** “Registration opens soon” + contact CTA
- **Open:** Tier summary cards + embedded Ticket Tailor widget
- Footnote: secure checkout, QR tickets emailed after purchase

---

## Ticket Tailor setup checklist

1. **Create account** at [tickettailor.com](https://www.tickettailor.com/) (organizer: Yasa Laser)
2. **Connect Stripe** (Canadian account, CAD settlement)
3. **Create event:** Innovate 2027 — Feb 27, 2027, The Quay — Gala room, Toronto
4. **Define ticket types** matching [`src/data/tickets.json`](../src/data/tickets.json):
   - Early bird (limited quantity + end date)
   - Conference pass (standard)
   - VIP / premium (if applicable)
5. **Tax:** Enable HST (13% Ontario) if required — consult accountant
6. **Branding:** Box Office Design Studio — match Innovate navy/gold palette
7. **Embed:** Promote → Website embed codes → copy widget URL → paste into `event-config.json` `embedUrl`
8. **Test purchase:** Buy a C$1 test ticket; verify QR email + check-in app scan
9. **Go live:** Set `ticketing.enabled` to `true`, deploy site

---

## Day-of operations

| Task | Tool |
|---|---|
| Scan tickets at registration | Ticket Tailor Check-in app (iOS/Android) |
| Attendee list / badges | Export CSV from Ticket Tailor dashboard |
| Refunds / transfers | Ticket Tailor dashboard |
| Walk-up sales | Ticket Tailor box office or manual check-in |
| Support questions | `events@yasalaser.com` |

---

## Switching to Eventbrite (if needed)

1. Create event on [eventbrite.ca](https://www.eventbrite.ca/)
2. Set `ticketing.provider` to `eventbrite`, replace `embedUrl` with Eventbrite widget URL or checkout link
3. Update register page footnote copy
4. Expect **~2× higher fees** per ticket (see table above)

No site architecture changes required — both platforms embed on a static Astro page.

---

## Open items

- [ ] Final ticket tier names and CAD pricing
- [ ] Early bird end date and capacity limits
- [ ] Fee pass-through vs absorb decision
- [ ] HST registration / tax line on checkout
- [ ] Ticket Tailor account + Stripe connection
- [ ] Test purchase + embed URL in `event-config.json`

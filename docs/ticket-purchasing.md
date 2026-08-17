# Ticket Purchasing — Innovate 2027

Online pass sales for **Innovate: What's New in Medical Aesthetics** (February 27, 2027, Toronto).

## Decision: Eventbrite (primary)

We use **[Eventbrite Canada](https://www.eventbrite.ca/)** for checkout, QR code tickets, and door check-in. The Innovate site embeds Eventbrite checkout on [`/register`](../src/pages/register.astro) so attendees purchase passes without leaving the conference website.

**Widget wiring** (provider switch, embed component) is tracked in GitHub issue #1. This document is the **product spec**: one C$99 pass, custom questions, confirmation email, and no-refund policy.

**Alternative considered:** [Ticket Tailor](https://www.tickettailor.com/) — lower fees (see comparison below). Ticket Tailor remains historical comparison only.

---

## Fee comparison (Canada, C$99 pass)

Sources: [Eventbrite Canada fees](https://www.eventbrite.ca/help/en-ca/articles/755615/eventbrite-fees/), [Ticket Tailor pricing](https://www.tickettailor.com/pricing), [Stripe Canada](https://stripe.com/en-ca/pricing).

| | **Eventbrite** (chosen) | **Ticket Tailor** (not used) |
|---|---|---|
| Platform fee | 3.5% + C$1.29 = **C$4.76** | ~C$1.00 flat per ticket (pay-as-you-go) |
| Payment processing | 2.9% of order = **C$2.87** | 2.9% + C$0.30 = **C$3.17** (Stripe) |
| **Total per C$99 pass** | **~C$8 (~7.7%)** | **~C$4 (~4.2%)** |
| **150 passes sold** | **~C$1,150 in fees** | **~C$630 in fees** |
| **Delta (Eventbrite vs TT)** | **~C$520 more** on 150 passes | — |

Fees can be passed to the buyer (default) or absorbed by the organizer.

### What Eventbrite includes

- Branded checkout (embed on innovate site)
- Confirmation email with **QR code** ticket
- Organizer app for registration-desk check-in
- Custom order questions (credentials, dietary needs, consents)
- CAD sales and Canadian payouts
- Attendee export (CSV)

---

## Pass offering

**One ticket type:** Conference pass **C$99**.

Includes:

- Full access to all keynote and breakout sessions
- Breakfast, lunch, and light snack
- Official conference swag bag

**Policy:** No refunds or substitutions. Attendee information is used to manage attendance and, if the attendee opts in, to share limited details with sponsors/exhibitors for relevant follow-up.

Marketing copy on `/register` lives in [`src/data/tickets.json`](../src/data/tickets.json). **Price and inventory are controlled in Eventbrite** — keep `tickets.json` in sync when the event is live.

---

## Site integration

### Configuration — [`event-config.json`](../event-config.json)

```json
"ticketing": {
  "provider": "eventbrite",
  "enabled": false,
  "embedUrl": "",
  "checkoutUrl": ""
}
```

`provider` is still `"ticket-tailor"` in the repo until issue #1 lands. Attendee-facing copy already names Eventbrite.

| Field | Purpose |
|---|---|
| `enabled` | Set `true` when the Eventbrite event is live |
| `embedUrl` | Eventbrite checkout widget URL / event page used by the embed |
| `checkoutUrl` | Fallback direct checkout link if embed is not used |

### Register page — [`src/pages/register.astro`](../src/pages/register.astro)

- **Closed:** “Registration opens soon” + C$99 pass summary + contact CTA
- **Open:** Pass card + Eventbrite checkout (embed when #1 ships; checkout URL fallback)
- Footnote: Eventbrite, no refunds or substitutions, optional sponsor sharing, `events@yasalaser.com`

---

## Eventbrite setup checklist

1. **Create or confirm organizer account** on [eventbrite.ca](https://www.eventbrite.ca/) (organizer: Yasa Laser)
2. **Create event:** Innovate: What's New in Medical Aesthetics — Saturday, February 27, 2027, The Quay — Gala room, Toronto
3. **Ticket type:** one Conference pass at **C$99** matching [`src/data/tickets.json`](../src/data/tickets.json)
4. **Tax:** Enable HST (13% Ontario) if required — consult accountant
5. **Refunds:** Disable refunds / state no refunds or substitutions on the event
6. **Custom questions:** add every field in the list below
7. **Confirmation email:** paste the copy below; schedule a week-before reminder
8. **Branding:** match Innovate navy/gold as closely as Eventbrite allows
9. **Embed:** capture event ID, widget URL, and public checkout URL for issue #1
10. **Test purchase:** buy a C$1 or complimentary test ticket; verify QR email + Organizer app scan
11. **Go live:** set `ticketing.enabled` to `true` after #1, deploy site

### Custom questions (order form)

Collect on the Eventbrite order — not on this static site.

**Attendee information**

- First name
- Last name
- Professional credentials (e.g. MD, DO, FRCSC, RN, NP, PA, RPN, DDS, Aesthetician)
- Role / title
- Organization / clinic
- Email
- Mobile phone
- Primary focus areas (e.g. lasers/devices, injectables, energy-based body contouring, skin regeneration)
- Interest in hands-on / product demos (Yes/No)

**Mailing address**

- Street address
- City
- Province / state
- Postal / ZIP code
- Country

**Participation and preferences**

- Dietary needs (None / Vegetarian / Vegan / Gluten-free / Kosher / Halal / Other)

**Communications and directory**

- Conference updates (email important updates and materials: Yes/No)
- Attendee directory opt-in (share name, role, clinic, and email with attendees and sponsors: Yes/No)
- Photo / video consent (I consent to be photographed/recorded: Yes/No)

**Payment and invoicing**

- Billing contact name and email
- Billing organization (if different)
- Billing address

### Confirmation email

> Thank you for registering for Innovate! We are excited to see you on February 27, 2027 at The Quay in Downtown Toronto. We will send you a reminder email a week before the conference with all the details you will need.
>
> If you have any questions, please contact us at events@yasalaser.com.

Also include accessibility / registration assistance via `events@yasalaser.com`.

---

## Day-of operations

| Task | Tool |
|---|---|
| Scan tickets at registration | Eventbrite Organizer app (iOS/Android) |
| Attendee list / badges | Export CSV from Eventbrite dashboard |
| Exceptions (policy is no refunds/substitutions) | Eventbrite dashboard, case-by-case |
| Walk-up sales | Eventbrite box office or on-site order |
| Support questions | `events@yasalaser.com` |

Doors / light breakfast **7:30–8:30 AM**; program **8:30 AM–4:00 PM**; cocktail hour **4:00–5:00 PM**.

---

## Open items

- [ ] Fee pass-through vs absorb decision
- [ ] HST registration / tax line on checkout
- [ ] Eventbrite account + event ID + embed URL (issue #1)
- [ ] Custom questions configured on the Eventbrite event
- [ ] Confirmation email + week-before reminder in Eventbrite
- [ ] Test purchase + `ticketing.enabled` in `event-config.json`

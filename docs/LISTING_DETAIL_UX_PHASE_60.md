# Listing detail UX — Phase 60

## What improved

- Reduced visual weight of the gallery, price card, and seller card
- Kept the primary request CTA first and full width
- Added consistent light/dark styles for detail containers
- Localized listing actions, characteristic labels, trust labels, and related sections
- Added a compact request hint before the lead form
- Kept related listing sections hidden when there are no results

## Top section

Desktop uses the existing two-column layout:

- Left: gallery, thumbnails, characteristics, and description
- Right: sticky price/contact card followed by seller/trust information

Mobile remains one column: gallery first, then price/CTA and seller information.

## CTA behavior

The primary blue action scrolls to the existing lead form. Favorites, sign-in/contact
actions, seller profile, and reporting remain secondary. Existing authentication and
lead submission behavior is unchanged.

## Seller and trust blocks

The seller card keeps safe avatar initials, company/name, seller role, profile link,
active listing count, city, membership date, and existing trust signals. Phone and
seller contacts are still only exposed according to the existing authentication rules.

## i18n

RU/KG/EN labels were added or verified for price, minimum order, city, stock, request
actions, favorites, seller/trust information, characteristics, description, reporting,
and related listings.

## Not changed

- Database schema
- Upload and image URL architecture
- Lead creation logic
- Authentication
- Public listing visibility

Similar and seller listing queries still require published, non-expired listings.

## Known gaps

- Manual mobile QA is still required on representative devices
- Deeper seller verification can be introduced in a later phase

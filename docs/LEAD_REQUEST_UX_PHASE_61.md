# Lead request UX — Phase 61

## 1. How the request form works

On `/listings/[id]`, the buyer scrolls to the existing lead form (`ListingLeadForm`) via the primary CTA.

The form still posts to `POST /api/listings/[id]/leads` and creates a `Lead` for the listing seller.

## 2. Guest behavior

Unauthenticated users see a clear login CTA:

- explanation that sign-in/register is required
- listing + seller summary
- **Sign in** and **Register** buttons
- return path uses existing `next` auth redirect helpers

No broken empty form is shown to guests.

## 3. Authenticated behavior

Signed-in buyers see:

- title / description (i18n)
- listing summary (title + seller)
- quantity (when vertical config enables it)
- optional phone/email (prefilled from profile when available)
- message textarea
- submit button

Owners see an own-listing notice instead of the form.
Restricted users see the existing restriction message.

## 4. Validation rules

Server-side (`createLeadSchema` + route checks):

- message trim, min 5, max 1000
- quantity integer ≥ 1 and ≤ 1_000_000
- auth required (`requireAuth`)
- buyer id from session only
- seller profile taken from listing
- own listing blocked
- only `PUBLISHED` and non-expired listings accept leads
- rate limits and content checks remain
- soft duplicate window (10 minutes, same buyer + listing)

## 5. Success state

After submit:

- success title/description via i18n
- **Close** resets the form for another message
- **Continue browsing** links to `/listings`
- no forced full page reload

## 6. Duplicate behavior

Soft check already existed and was broadened:

- recent lead by same buyer for the same listing within 10 minutes blocks a new submit
- UI shows `lead.alreadySent`

There is still **no unique DB constraint** for buyer+listing.

## 7. Seller notification

Existing `createNewLeadNotification` call remains after lead create. Phase 61 does not replace the notification system.

## 8. Seller leads page

`/seller/leads` still loads only the current seller profile’s leads.

Cards show listing, message, buyer/safe contacts, date, and status.
If the listing is no longer published, the card shows an unavailable badge and hides the open-listing CTA instead of crashing.

Deleted listings continue to cascade-delete leads (existing schema behavior).

## 9. Unchanged

- Prisma schema / migrations
- Lead model fields
- Auth architecture
- Upload architecture
- Core seller dashboard logic

## 10. Known gaps

- Stronger anti-spam / richer rate-limit UX later
- Hard unique duplicate constraint if product wants permanent one-request-per-listing
- Deeper CRM pipeline for lead statuses later

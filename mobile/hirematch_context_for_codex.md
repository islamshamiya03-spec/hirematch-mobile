# HireMatch — Project Context & Product Specification

> **Purpose:** This document is the canonical product and implementation context for Codex or another coding agent working on HireMatch. Read it before changing code. Treat confirmed requirements as authoritative, preserve existing working behavior, and flag unresolved decisions rather than silently inventing product rules.

## 1. Project overview

**HireMatch** is a mobile-first, swipe-based recruitment and job-matching platform inspired by the interaction model of Tinder. It connects job seekers with employers through profile discovery, mutual-interest matching, and contact-information unlocking.

The product is not simply a conventional job board with a swipe animation. The swipe-and-match interaction is a defining part of the product experience.

### Core value proposition

- **For job seekers:** discover relevant employers/opportunities and express interest quickly.
- **For employers:** discover candidate profiles and express interest in suitable people.
- **For both:** a mutual match creates a clear connection and reveals each party's chosen contact information so they can communicate directly and arrange interviews outside the app.

### Product model in one sentence

**Swipe right to express interest, swipe left to pass, and reveal contact information only after a mutual match.**

## 2. Confirmed product requirements

These are explicit decisions and should be treated as fixed unless the product owner changes them.

1. HireMatch is a **mobile app** and should be designed mobile-first.
2. The interaction model is **Tinder-like**: discover cards, swipe left/right, and mutual matches.
3. There are two principal user groups:
   - **Job seekers / candidates**
   - **Employers / recruiters**
4. Both sides can discover and express interest in the other side.
5. **A match occurs only when both parties have expressed interest in each other** (mutual right-swipe).
6. **Contact information is hidden unless a mutual match exists.**
7. When a match exists, **both parties can see the other's contact information**.
8. **There is no in-app chat requirement.** After matching, users connect directly using the contact information revealed by the platform.
9. The visual identity should feel approachable and engaging, with Tinder-inspired energy, while remaining credible and professional for recruitment.
10. The currently proposed palette is:
    - Coral Pink `#FF4F70` — primary action / interest / match
    - Midnight Navy `#17243B` — structure, headings, navigation
    - Warm Ivory `#FFF8F5` — primary background
    - Soft Blush `#FFDFE6` — selected states and gentle highlights
    - Electric Violet `#7057E8` — selective discovery or premium accents
    - Fresh Green `#159B72` — success / verified / positive status
    - Light Grey `#F2F3F7` — muted surfaces, input backgrounds, dividers
    - Muted Slate `#697386` — secondary text
11. Contact details should be treated as private profile data and must not leak through public profile endpoints, discovery payloads, logs, or client-side state before a match.

## 3. Product goals

### Primary goals
- Make candidate and employer discovery quick and understandable.
- Reduce the friction of expressing interest.
- Create a clear mutual-consent gate before sharing contact details.
- Help matched parties move to a real conversation or interview without requiring HireMatch to host chat.
- Provide a polished, accessible, responsive experience.

### Non-goals for the initial product unless explicitly added
- In-app messaging or chat.
- A full applicant tracking system (ATS).
- Automated hiring decisions or candidate ranking presented as authoritative.
- Payment, subscriptions, or premium tiers.
- Complex social networking features.
- Public exposure of personal contact details.

The coding agent should not build these merely because they are common in recruitment products.

## 4. User roles and permissions

### 4.1 Job seeker
A job seeker can:
- Register and authenticate.
- Create and edit a candidate profile.
- Add professional information such as skills, experience, education, résumé/portfolio links, and job preferences, subject to the final data model.
- Discover eligible employer/job cards.
- Swipe right to express interest or left to pass.
- View their own outgoing interests and mutual matches.
- View an employer's contact information only after a mutual match.
- Manage their own contact information and privacy settings.

### 4.2 Employer / recruiter
An employer can:
- Register and authenticate.
- Create an employer/company profile.
- Add organization details and recruitment information, subject to the final data model.
- Discover eligible candidate cards.
- Swipe right to express interest or left to pass.
- View their own outgoing interests and mutual matches.
- View a candidate's contact information only after a mutual match.
- Manage their own contact information and privacy settings.

### 4.3 Authorization principle
A user must only access data and actions permitted for their authenticated account and role. Enforce this on the server/API, not only in the UI.

## 5. Core user journeys

### 5.1 Onboarding and account setup
1. User opens the app.
2. User registers or signs in.
3. User selects or is assigned a role: job seeker or employer.
4. User completes the corresponding profile.
5. User reviews the contact details they choose to share after matching.
6. User enters the discovery experience.

The implementation may adapt this flow to the existing repository, but it must preserve role-specific setup and contact privacy.

### 5.2 Candidate discovers employers/opportunities
1. Candidate opens the discovery screen.
2. The app displays one eligible employer or opportunity card at a time (or a similarly focused card stack).
3. Candidate can review the publicly shareable profile information.
4. Candidate swipes left to pass or right to express interest.
5. The decision is persisted by the backend.
6. If the employer has already expressed interest, the backend creates a mutual match.
7. The UI displays a match confirmation and makes the employer's permitted contact information available.

### 5.3 Employer discovers candidates
1. Employer opens candidate discovery.
2. The app displays eligible candidate cards.
3. Employer reviews the candidate's public profile information.
4. Employer swipes left to pass or right to express interest.
5. The decision is persisted by the backend.
6. If the candidate has already expressed interest, a mutual match is created.
7. The UI displays a match confirmation and makes the candidate's permitted contact information available.

### 5.4 Match and contact reveal
1. A mutual right-swipe is recorded.
2. The backend creates or confirms exactly one match for that pair and relevant matching context.
3. The match appears in both parties' match lists.
4. The matched users can view each other's explicitly shared contact fields.
5. The app provides a clear way to copy or open those details where supported.
6. There is no in-app chat. The UI should not imply that a messaging inbox exists.

### 5.5 Unmatch, block, or account removal
These are recommended safety/privacy behaviors, but their precise product semantics need confirmation:
- If unmatching is implemented, contact details should become inaccessible to both parties through the app.
- Blocking should prevent further discovery and matching between the accounts.
- Account deletion should remove or anonymize personal data according to the product's retention policy and applicable law.
- Do not assume that unmatching can erase contact information already seen, copied, or saved by the other party; communicate this limitation clearly.

## 6. Matching rules and state model

### 6.1 Interest actions
Each discovery decision should record:
- Actor user ID
- Target user or target profile ID
- Action: `LIKE` (right swipe) or `PASS` (left swipe)
- Timestamp
- Matching context, if the product distinguishes a candidate-to-employer connection from a candidate-to-job-posting connection

Avoid creating duplicate active decisions for the same actor-target-context combination. Define whether a later action can overwrite an earlier one; do not silently implement contradictory behavior.

### 6.2 Mutual match
A match is created when:
- User A likes User B in the applicable context, and
- User B likes User A in that same context.

A pass does not create a match. A one-sided like does not reveal contact information.

### 6.3 Match lifecycle
Suggested states:
- `ACTIVE` — mutual match exists and contact details are accessible to the matched parties.
- `UNMATCHED` — match ended; contact details are no longer available through the app.
- `BLOCKED` — a block relationship prevents discovery or matching.

Use the simplest state model compatible with the existing codebase. Do not add lifecycle complexity without a product need.

### 6.4 Idempotency and race conditions
The backend must handle two likes arriving concurrently:
- Use a transaction or equivalent consistency mechanism.
- Enforce uniqueness at the database level for a match pair/context.
- Ensure retries do not create duplicate matches or duplicate match notifications.
- Return a consistent result to both clients.

### 6.5 Discovery exclusions
Discovery should normally exclude:
- The authenticated user's own profile.
- Profiles already passed or liked in the current context, unless the product intentionally supports resurfacing.
- Existing active matches.
- Blocked users and users who blocked the current user.
- Ineligible, disabled, incomplete, or non-discoverable profiles.

The exact resurfacing and eligibility policy is a product decision; keep it configurable or clearly isolated rather than scattering assumptions through the app.

## 7. Contact information privacy and security

This is a critical product rule.

### 7.1 Before a match
- Contact fields must not be included in discovery API responses.
- Contact fields must not be embedded in HTML, serialized application state, analytics events, or client caches.
- UI may show a neutral prompt such as “Contact details unlock after a mutual match.”
- Do not rely on hiding contact text in the frontend as a security measure.

### 7.2 After a match
- Only the two matched parties may retrieve the contact details each has chosen to share.
- The backend must verify authentication, match membership, match status, and authorization on every request.
- Return only the allowed contact fields, not the entire private user record.
- Avoid exposing contact details in server logs, exception traces, analytics, or debug output.

### 7.3 Contact preferences
Recommended fields (confirm against the existing schema before implementation):
- Email address
- Phone number
- LinkedIn URL
- Portfolio/personal website

Users should be able to choose which fields are shareable. Do not assume every contact field is mandatory or public.

### 7.4 Security controls
- Apply server-side authorization to every profile, match, and contact endpoint.
- Validate and normalize contact values.
- Rate-limit sensitive endpoints where appropriate.
- Use secure authentication/session practices already established by the project.
- Avoid exposing sequential internal IDs where that creates enumeration risk.
- Use HTTPS in deployed environments.
- Ensure test fixtures and demo data do not contain real personal contact information.

## 8. UX and visual design direction

### 8.1 Design character
The interface should combine:
- The immediacy and tactile feedback of Tinder-style discovery.
- The clarity and trust expected of a recruitment product.
- A friendly, modern, mobile-first visual system.
- Accessible typography, contrast, and touch targets.

Avoid making the app look like a dating app in its content or language. The interaction pattern is Tinder-inspired; the domain, copy, imagery, and information architecture must remain clearly career/recruitment-oriented.

### 8.2 Color tokens

| Token | Color name | HEX | RGB | Intended use |
|---|---|---|---|---|
| `primary` | Coral Pink | `#FF4F70` | `255, 79, 112` | Primary CTA, like action, match emphasis |
| `navy` | Midnight Navy | `#17243B` | `23, 36, 59` | Headings, navigation, primary text |
| `background` | Warm Ivory | `#FFF8F5` | `255, 248, 245` | Main app background |
| `blush` | Soft Blush | `#FFDFE6` | `255, 223, 230` | Selected cards, gentle highlights |
| `accent` | Electric Violet | `#7057E8` | `112, 87, 232` | Selective accent/discovery/premium styling |
| `success` | Fresh Green | `#159B72` | `21, 155, 114` | Success, verification, positive state |
| `surface-muted` | Light Grey | `#F2F3F7` | `242, 243, 247` | Inputs, separators, inactive surfaces |
| `text-muted` | Muted Slate | `#697386` | `105, 115, 134` | Secondary text, metadata |

Suggested CSS variables:

```css
:root {
  --color-primary: #FF4F70;
  --color-navy: #17243B;
  --color-background: #FFF8F5;
  --color-blush: #FFDFE6;
  --color-accent: #7057E8;
  --color-success: #159B72;
  --color-surface-muted: #F2F3F7;
  --color-text-muted: #697386;
}
```

Suggested visual balance: approximately 60% warm background, 25% navy, 10% coral, and 5% combined accent colors. This is a design guideline, not a rigid rule.

### 8.3 Interaction details
- Right swipe: clear positive visual feedback using coral.
- Left swipe: restrained neutral/pass feedback; avoid making rejection feel punitive.
- Mutual match: concise celebratory moment using coral, with optional violet accent.
- Locked contact state: explain that details become visible only after mutual interest.
- Successful contact reveal: show the exact contact methods shared by that user.
- Buttons and gestures must have accessible alternatives; do not make swipe the only way to act.
- Respect reduced-motion preferences and avoid excessive animation.

### 8.4 UX quality and ethical engagement
Aim for satisfying, responsive, understandable interactions—not manipulative engagement loops. Do not add artificial scarcity, anxiety-inducing notifications, deceptive match counts, or dark patterns. Prioritize relevance, transparency, performance, and user control.

## 9. Information architecture / key screens

The exact screen inventory should be reconciled with the current implementation. A reasonable initial structure is:

1. **Welcome / authentication**
2. **Role selection**
3. **Profile setup**
   - Candidate profile
   - Employer/company profile
4. **Discovery**
   - Candidate discovery for employers
   - Employer/opportunity discovery for candidates
5. **Profile detail**
   - Public/shareable information only before match
6. **Match confirmation**
7. **Matches list**
8. **Matched contact details**
9. **My profile / edit profile**
10. **Privacy and contact-sharing settings**
11. **Settings / account**
12. **Empty, loading, error, and offline states**

Do not introduce a chat screen or chat tab unless the product owner explicitly changes the no-chat decision.

## 10. Suggested data model

This is a conceptual model, not a mandate to replace an existing schema. Inspect the repository first and adapt to its conventions.

### User
- `id`
- `email` or authentication identity
- `role` (`JOB_SEEKER` or `EMPLOYER`)
- `status`
- `created_at`
- `updated_at`

### CandidateProfile
- `id`
- `user_id`
- `display_name`
- `headline`
- `summary`
- `location`
- `skills`
- `experience`
- `education`
- `resume_url` (if supported)
- `portfolio_url` (if supported)
- `is_discoverable`
- timestamps

### EmployerProfile
- `id`
- `user_id`
- `company_name`
- `company_description`
- `industry`
- `company_website`
- `location`
- `logo_url`
- `is_discoverable`
- timestamps

### ContactPreferences
- `user_id`
- `share_email`
- `share_phone`
- `share_linkedin`
- `share_portfolio`
- corresponding contact values, preferably stored in protected profile fields or a dedicated private table
- timestamps

### Interest
- `id`
- `actor_user_id`
- `target_user_id` or target profile/job ID
- `context_id` (if matching is scoped to a job or listing)
- `action` (`LIKE` or `PASS`)
- `created_at`
- `updated_at`
- unique constraint for actor, target, and context

### Match
- `id`
- `user_a_id`
- `user_b_id`
- `context_id` (if applicable)
- `status` (`ACTIVE`, `UNMATCHED`, etc.)
- `matched_at`
- `ended_at`
- unique canonical pair/context constraint

### Block (recommended)
- `id`
- `blocker_user_id`
- `blocked_user_id`
- `created_at`
- unique constraint on blocker/blocked pair

Use foreign keys, indexes, constraints, and migrations appropriate to the selected database. Store timestamps consistently, preferably in UTC, and format them for the user's locale in the client.

## 11. API behavior (conceptual)

Use the project's existing API style and naming conventions. These are behavioral contracts, not required literal route names.

### Authentication and profiles
- Register/sign in/sign out using the existing auth mechanism.
- Read and update the authenticated user's profile.
- Read a public profile with only pre-match-safe fields.
- Update contact-sharing preferences and private contact values.

### Discovery
- Fetch the next page/batch of eligible discovery cards for the authenticated role.
- Submit a `LIKE` or `PASS` decision.
- Return whether the action created a mutual match.
- Do not return the target's contact details unless a valid active match exists.

### Matches
- List active matches for the authenticated user.
- Read a specific match only if the requester is one of its members.
- Retrieve the other party's shareable contact information only when the match is active and the requester is a member.
- Unmatch if that feature is enabled.
- Block/unblock if that feature is enabled.

### Response design
- Use stable error codes and clear messages.
- Distinguish authentication failures, authorization failures, validation errors, missing resources, and conflicts.
- Paginate discovery and match lists.
- Ensure mutations are idempotent where practical.
- Never treat a client-supplied `is_matched` flag as authoritative; compute authorization from persisted server state.

## 12. Recommended implementation architecture

**First inspect the repository.** Do not assume a particular framework, directory structure, or database merely from this document.

The architecture should separate:
- **Client/UI:** screens, navigation, reusable components, gesture handling, accessibility.
- **Domain logic:** profile eligibility, interest processing, mutual-match determination, match lifecycle.
- **API/backend:** authentication, authorization, validation, persistence, contact reveal.
- **Database:** relational integrity, indexes, uniqueness, migrations.
- **Infrastructure/configuration:** environment variables, deployment settings, logging, monitoring.

Keep matching and privacy rules in backend/domain services rather than duplicating them across screens. The client should present server-confirmed match state.

## 13. Non-functional requirements

- **Security:** enforce authorization server-side; protect private contact data.
- **Privacy:** collect only necessary personal data; provide understandable sharing controls.
- **Reliability:** prevent duplicate matches and handle concurrent swipe actions.
- **Performance:** discovery cards should load quickly; use pagination and appropriately sized media.
- **Accessibility:** support screen readers, adequate contrast, keyboard/switch alternatives where applicable, and reduced motion.
- **Maintainability:** use clear module boundaries, typed contracts where supported, and consistent naming.
- **Observability:** log operational events without logging sensitive contact data or credentials.
- **Resilience:** show useful loading, empty, retry, and network-error states.
- **Testing:** cover matching logic, authorization boundaries, and contact privacy with automated tests.

## 14. Testing and acceptance criteria

A feature is not complete merely because the UI appears to work. Verify the following.

### Matching
- A right swipe creates a persisted like/interest.
- A left swipe creates a persisted pass and does not create a match.
- A one-sided like does not create a match.
- Reciprocal likes create exactly one match.
- Both users see the same active match.
- Repeated requests do not create duplicate interests or matches.
- Concurrent reciprocal likes still result in one consistent match.

### Contact privacy
- Before matching, candidate discovery responses do not contain employer contact details.
- Before matching, employer discovery responses do not contain candidate contact details.
- A one-sided like does not unlock contact information.
- A matched user can retrieve only the other party's permitted contact fields.
- A non-member cannot retrieve a match or its contact details.
- An inactive/unmatched relationship does not authorize contact retrieval.
- Contact details are absent from logs and analytics payloads.

### Role and authorization
- Candidate-only actions cannot be invoked by an employer unless explicitly allowed.
- Employer-only actions cannot be invoked by a candidate unless explicitly allowed.
- Users cannot edit another user's profile or contact preferences.
- Users cannot spoof a match by altering client state or request parameters.

### UX
- Swipe gestures work reliably and have button/accessibility alternatives.
- Match confirmation appears only after server confirmation.
- Contact details are visibly locked before a match and available after a match.
- There is no misleading chat functionality.
- Loading, empty, error, and retry states are implemented.

### Release readiness
- Migrations apply cleanly to a fresh database.
- Automated tests pass.
- Environment secrets are not committed.
- Build/lint/type checks pass according to the repository's toolchain.
- Setup and run instructions are documented.

## 15. Product decisions still to confirm

Do not silently decide these if they materially affect schema, UX, or matching semantics:

1. **Matching target:** do candidates swipe on employer/company profiles, individual job postings, or both?
2. **Employer identity:** can one employer account have multiple recruiter seats or company profiles?
3. **Candidate profile fields:** which fields are required, optional, or visible before matching?
4. **Contact methods:** which contact fields are supported, and can users choose visibility per field?
5. **Unmatch behavior:** can either party unmatch, and should unmatching immediately revoke in-app contact access?
6. **Blocking/reporting:** what moderation, reporting, and safety workflows are required for the MVP?
7. **Discovery rules:** should passed profiles ever reappear? Can users undo a swipe?
8. **Match expiration:** do matches remain active indefinitely, or expire after a defined period?
9. **Notifications:** should users receive push/email notifications for likes or matches? If yes, what events and preferences?
10. **Verification:** is employer/company verification part of the MVP?
11. **Résumé handling:** are résumés uploaded, linked, or omitted initially?
12. **Localization:** which languages and regions are supported in the first release?
13. **Admin/moderation:** is an admin console required for the initial release?

Use conservative defaults, document assumptions in code or an ADR, and ask the product owner when a decision changes privacy, security, or core behavior.

## 16. Guidance for Codex: how to work in this repository

Before coding:
1. Inspect the repository tree, README, dependency manifests, environment examples, existing screens, API routes, models, migrations, and tests.
2. Identify the actual frontend, backend, database, authentication provider, and current implementation status.
3. Report what already exists and map it to this specification.
4. Identify conflicts, missing foundations, and product decisions that block implementation.
5. Prefer incremental changes that fit the existing architecture. Do not rewrite the stack without a clear reason and explicit approval.

While coding:
- Preserve existing conventions and working functionality.
- Implement one coherent feature at a time.
- Keep UI styling aligned with the palette and recruitment-oriented tone.
- Put critical matching and contact-access rules on the server.
- Add or update migrations and tests alongside behavior changes.
- Do not introduce chat, payments, rankings, or unrelated features without approval.
- Do not fabricate API responses or use hardcoded mock data in production paths.
- Use mock/demo data only in clearly separated development fixtures.
- Avoid exposing secrets, tokens, personal data, or contact details in logs or committed files.
- Document non-obvious architectural choices and unresolved assumptions.

After coding:
1. Run relevant tests, linting, type checks, and build commands.
2. Fix regressions introduced by the changes.
3. Summarize files changed, behavior implemented, tests run, and remaining work.
4. Clearly distinguish verified behavior from assumptions or untested areas.

## 17. Definition of done

The MVP's defining experience is complete when:
- A candidate and an employer can create the appropriate profiles and authenticate.
- Each role can discover the other role's eligible profiles.
- Users can pass or express interest with swipe gestures and accessible controls.
- Reciprocal interest creates one persistent match visible to both parties.
- Contact information is strictly hidden before a match and available to both parties only after a valid active match, limited to each user's chosen shareable fields.
- The product does not depend on or imply in-app chat.
- The experience is mobile-first, responsive, accessible, and consistent with the approved visual direction.
- Core privacy, authorization, concurrency, and matching tests pass.
- The project can be installed, configured, run, and tested using documented instructions.

---

## Quick reference for the coding agent

**Product:** HireMatch  
**Category:** Mobile-first job-seeker/employer matching platform  
**Interaction:** Tinder-style swipe discovery  
**Right swipe:** Express interest  
**Left swipe:** Pass  
**Match condition:** Both parties swipe right  
**Contact visibility:** Hidden until mutual match; then both parties can see the other's explicitly shared contact information  
**Messaging:** No in-app chat; matched parties connect directly  
**Visual direction:** Energetic, modern, trustworthy recruitment UX  
**Primary color:** Coral `#FF4F70`  
**Core privacy invariant:** No pre-match contact disclosure, enforced by the backend  
**Implementation instruction:** Inspect the existing codebase first; adapt this specification to the actual stack and report unresolved product decisions rather than inventing them.

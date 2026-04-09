# Global Compliance Landscape for RuleSell Marketplace

**Date**: 2026-04-08
**Context**: RuleSell — global marketplace for digital goods (code configs, MCP servers, prompts, agent setups). Free + paid items. Hosted code executed on user machines. UGC, reviews, multi-creator payouts.
**Status**: COMPLETE (2026-04-08)

---

## Research Plan

1. EU: GDPR, DSA, DMA, EAA
2. US: CCPA/CPRA + state privacy mosaic, Section 230, COPPA, ADA, export controls
3. Tax: EU VAT OSS, UK VAT, US state sales tax, APAC/LatAm, MoR decision
4. Platform: liability for hosted code, content moderation, DMCA
5. Payouts: Stripe Connect models, 1099/KYC/sanctions
6. IP: open source licensing on listings
7. Synthesis: launch gates vs 90-day vs 1K users

---

## 1. EU — GDPR (Regulation 2016/679)

**Applies**: Any business offering goods/services to EU residents, regardless of where hosted (Art. 3 extraterritoriality). RuleSell is in scope from first EU user.

**Key requirements for a marketplace**:
- **Lawful basis (Art. 6)** — each processing purpose needs one: contract (order fulfillment, payouts), legitimate interest (fraud, basic analytics), consent (marketing, non-essential cookies).
- **Cookie consent (ePrivacy Dir. Art. 5(3))** — non-essential cookies need prior opt-in. No pre-ticked boxes, no dark patterns, symmetric Accept/Reject buttons, withdraw as easy as grant. Auditable consent logs required. Even SMBs are in scope.
- **Data subject rights (Art. 12-22)** — access, rectification, erasure, portability, restriction, objection. Must respond within 1 month. Build a DSR intake flow and an export endpoint.
- **Privacy notice (Art. 13/14)** — identity, purposes, legal basis, recipients, retention, rights, DPO contact (if any), transfers.
- **DPAs (Art. 28)** — every processor (Stripe, Vercel, Neon, Supabase, analytics, email) needs a signed DPA. Keep a Record of Processing Activities (Art. 30) even as SMB if processing is "not occasional" — which a marketplace always is.
- **International transfers (Ch. V)** — US processors require SCCs + transfer impact assessment (post-Schrems II). If using US-based hosts, rely on the EU-US Data Privacy Framework (DPF) for certified providers.
- **DPO (Art. 37)** — mandatory only for public authorities, large-scale systematic monitoring, or large-scale special-category processing. **RuleSell does NOT need a DPO at launch.** Virtual DPO (€200-600/mo) optional.
- **Breach notification (Art. 33)** — 72h to supervisory authority if risk to rights/freedoms.

**Data model impact**:
- `consent_events` table: user_id/anon_id, purpose, granted_at, withdrawn_at, banner_version, source_ip, user_agent.
- `data_processing_log` table for DSR audit.
- `user_deletion_requests` with status + 30-day SLA timer.
- Retention policies per table (accounts: active+X years; logs: 90d; payment records: 7-10y for tax).

**UI impact**:
- Cookie banner on first visit: Accept / Reject / Customize — equal visual weight.
- `/privacy`, `/cookies` pages with processor list.
- Account settings: "Export my data", "Delete my account" self-serve.
- Granular marketing opt-ins separate from account creation.

---

## 2. EU — Digital Services Act (Regulation 2022/2065)

**Applies**: All "intermediary services" offering services in the EU. RuleSell is a **hosting service** (stores user-uploaded skills/configs) and also an **online platform** (disseminates to public, has ratings/reviews).

**VLOP threshold**: 45 million average monthly active EU recipients. RuleSell is not a VLOP and will not be for years. VLOP-only obligations (risk assessment, external audit, researcher data access, recommender transparency under Art. 27/38, crisis protocols) do **not** apply.

**What DOES apply to any online platform (including small)**:
- **Art. 11-12 — Points of contact**: single email for authorities and for users.
- **Art. 13 — Legal representative in the EU** if the platform is not established in the EU. Non-EU marketplaces MUST appoint one. Cost ~€1-3K/yr.
- **Art. 14 — Clear T&Cs** describing content moderation rules, algorithmic decision-making, redress.
- **Art. 15 — Transparency reports** — annual, publicly available. Orders from authorities, notices received, actions taken, handling times, use of automated moderation. Standardized template since Implementing Regulation July 2025; first harmonized reports published Feb 2026.
- **Art. 16 — Notice and action**: easy electronic mechanism for anyone to report illegal content. Confirm receipt, act without undue delay, send reasoned decision.
- **Art. 17 — Statement of reasons** — every removal, demotion, suspension must send the uploader a specific justification (legal basis, facts, automated decision yes/no, redress options). Submitted to the DSA Transparency Database.
- **Art. 20 — Internal complaint-handling system** — free, for 6 months after a decision.
- **Art. 21 — Out-of-court dispute resolution** referral.
- **Art. 22 — Trusted flaggers** — prioritized notices.
- **Art. 23 — Measures against misuse** — suspension policy for repeated illegal uploads or abusive notices.
- **Art. 24(2) — Average monthly active recipients** — publish every 6 months (even if tiny — mandatory).
- **Art. 25 — Dark patterns prohibition**.
- **Art. 28 — Protection of minors**: no targeted ads based on profiling of minors; high level of privacy/safety/security.
- **Art. 30-31 — KYC for "traders"**: if a user is a trader (commercial activity), platform must collect name, address, bank account, registration number, self-certification before letting them list. **Applies directly to RuleSell's paid sellers.**
- **Art. 32 — Consumer info on illegal products** — notify buyers who purchased something later found illegal.

**Data model impact**:
- `moderation_notices` (reporter, target_id, reason category, status, SLA timer).
- `moderation_decisions` (target_id, decision, reasoned_statement, automated_flag, submitted_to_db_at).
- `appeals` with 6-month window.
- `trader_kyc` (user_id, legal_name, address, bank, reg_number, verified_at).
- Monthly EU active recipients counter.

**UI impact**:
- "Report" button on every listing, review, profile.
- Trader vs consumer account toggle at seller onboarding with KYC form.
- Public `/transparency` page with annual report + monthly active recipients.
- T&C section explaining moderation rules, automated tools, appeal path.

---

## 3. EU — Digital Markets Act (Regulation 2022/1925)

**Does NOT apply.** DMA targets "gatekeepers" — currently 7 companies (Alphabet, Amazon, Apple, ByteDance, Meta, Microsoft, Booking). Thresholds: €7.5B EU turnover OR €75B market cap, 45M monthly EU users AND 10K yearly EU business users, in 3+ member states for 3 years. RuleSell will not approach these. **Skip.**

---

## 4. EU — European Accessibility Act (Directive 2019/882) + WCAG

**Deadline**: 28 June 2025 (already in force). Private enforcement starts 2026-2027.

**Applies**: E-commerce services sold to EU consumers. RuleSell IS an e-commerce service under the EAA. Transposed into each EU member state's law (so enforcement is national — e.g., BFSG in Germany).

**Exemption**: Microenterprises (< 10 employees AND < €2M turnover) — exempt from the service provisions. RuleSell at launch likely qualifies for the microenterprise exemption, but this is a short runway: crossing either threshold revokes it immediately, and the exemption is narrower than it sounds (it doesn't exempt from national accessibility laws in some member states).

**Standard**: Harmonized standard EN 301 549, which currently maps to WCAG 2.1 Level AA. WCAG 2.2 is recommended by most advisors because EN 301 549 is expected to update. Plan against **WCAG 2.2 AA** to future-proof.

**Practical requirements**: keyboard navigation, focus visible, color contrast 4.5:1 (text), 3:1 (UI components), screen reader labels, captions for media, error identification, accessibility statement published.

**US parallel**: ADA Title III — applied to websites by courts under "places of public accommodation". No formal standard but courts routinely reference WCAG 2.1/2.2 AA. Demand-letter lawsuits remain the primary risk.

**UI impact**: audit against WCAG 2.2 AA before launch (Lighthouse + manual keyboard test), publish `/accessibility` statement even during microenterprise exemption, design tokens must hit contrast ratios.

---

## 5. US — CCPA/CPRA (California, as amended by CPPA regulations effective Jan 1, 2026)

**Applies** if ANY of: $26.625M+ revenue; processes PI of 100K+ CA residents/households; or 50%+ revenue from selling/sharing PI. **RuleSell at launch likely doesn't meet the thresholds**, but "sharing" for cross-context behavioral advertising counts — if you use any ad retargeting pixel (Meta, Google Ads) you may trip the share threshold fast.

**Requirements regardless**:
- **Notice at collection** — categories of PI + sensitive PI collected, purposes, retention.
- **Privacy policy** accessible, updated annually, accessible to users with disabilities, in languages you ordinarily use.
- **"Do Not Sell or Share My Personal Information"** link on homepage if you sell/share.
- **"Limit Use of My Sensitive Personal Information"** link if you use SPI beyond service provision.
- **Global Privacy Control** (GPC) — honor browser signal as opt-out.
- **Rights**: know, delete, correct, portability, opt-out of sale/sharing, opt-out of automated decision-making (effective 2027 under new ADMT regs).
- **Sensitive PI** now includes neural data (2026 update).
- **Mobile apps**: privacy policy link required in app stores (new Jan 2026).
- **New rules effective Jan 1, 2026**: automated decision-making (ADMT) risk assessments, cybersecurity audits for high-risk processing.

**Data model impact**: `ccpa_optouts` table by identifier hash; honor GPC header on first request. Sensitive PI tagging on columns.

**UI impact**: "Your Privacy Choices" footer link; opt-out flow that works without login; disability-accessible privacy policy.

---

## 6. US — State Privacy Law Mosaic (20 states effective in 2026)

**In force in 2026** (notable): California (CCPA/CPRA), Virginia (VCDPA), Colorado (CPA), Connecticut (CTDPA), Utah (UCPA), Texas (TDPSA), Oregon, Delaware, Montana, Iowa, Indiana, Tennessee, New Jersey, New Hampshire, Nebraska, Kentucky, Maryland, Minnesota, Rhode Island.

Most follow the **Virginia template**. Utah is the most business-friendly (narrower rights). **Texas TDPSA** is unusually broad — it has **no revenue threshold**, applying to any business processing PI of Texas residents and not a small business under SBA definitions, AND that sells SPI or processes PI. Texas is often the binding constraint.

**Common denominator** (build once, satisfy most):
- Privacy notice + retention disclosure.
- Rights: access, correction, deletion, portability, opt-out of sale, opt-out of targeted advertising, opt-out of profiling for significant decisions.
- Respond within 45 days, extension possible.
- No private right of action (except CA data breach).
- Sensitive data opt-in (consent) in CO, CT, VA; opt-out in UT, IA.
- Honor Universal Opt-Out Mechanisms / Global Privacy Control in CA, CO, CT, OR, TX (required).
- Data Protection Assessments for high-risk processing (targeted ads, sale, profiling, SPI).
- Appeal mechanism for rights denials.

**Practical strategy**: Build to the **California + Colorado + Texas** ceiling — it covers everyone. Single DSR intake flow, geo-aware options, honor GPC globally.

---

## 7. Taxes — VAT / Sales Tax / GST on Digital Goods

### EU VAT (One Stop Shop — OSS, replacing MOSS since 2021)
- **No threshold for non-EU sellers.** Single EU sale to a B2C buyer triggers VAT registration. Must collect VAT at buyer's local rate (17%-27%). Register once in any member state (non-Union OSS scheme for non-EU sellers) and file quarterly.
- B2B sales with valid VAT number → reverse charge, no VAT collected.
- Must keep VAT records 10 years.

### UK VAT
- UK left EU VAT regime post-Brexit. UK has its own VAT MOSS equivalent. **Non-UK sellers have a £0 threshold for digital services to UK consumers**. Must register with HMRC and collect 20% VAT.

### US sales tax on digital goods
- No federal sales tax. ~30 states tax digital goods; treatment varies by product type and state. Economic nexus thresholds post-**Wayfair** (2018) typically $100K sales or 200 transactions per state per year.
- **Marketplace facilitator laws** — if RuleSell is the "marketplace facilitator" (collecting payment on behalf of sellers), **RuleSell must collect and remit sales tax in the states where it has nexus**, even for seller sales.

### Canada (GST/HST/QST)
- Non-resident digital service providers must register for GST/HST if > CAD $30K/yr to Canadian consumers. QST separately for Quebec.

### Australia GST
- 10% GST on digital services to Australian consumers. AUD $75K threshold for non-residents.

### Japan JCT
- 10% consumption tax on digital services. JPY 10M threshold.

### Singapore GST
- 9% on overseas digital services. SGD $100K threshold.

### India GST
- 18% OIDAR tax on digital services to Indian consumers. No threshold for non-residents.

### Brazil
- Complex: ICMS + PIS/COFINS; tax reform in progress. Generally requires local fiscal representation.

### Merchant of Record (MoR) vs Self
| Dimension | Stripe (self MoR) | Paddle / Lemon Squeezy (they MoR) |
|---|---|---|
| Fees | 2.9% + $0.30 (domestic); ~4.9-5.2% effective intl | 5% + $0.50 flat global |
| Tax burden | You register, collect, remit in every jurisdiction | They handle all taxes globally |
| Chargebacks | You fight them | They handle |
| Payouts to creators | Stripe Connect (easy) | Limited — Paddle has affiliate-style; LS weaker |
| Speed to global | Slow (jurisdiction by jurisdiction) | Immediate |
| Compliance risk | Yours | Theirs |

**Update (2026)**: Stripe acquired Lemon Squeezy (July 2024) and is building Stripe Managed Payments (an MoR product), currently in private beta.

**Recommendation**: **Start with Paddle or Lemon Squeezy as MoR for buyer-side payments** — the tax compliance avoidance alone is worth the ~2% premium for a sub-1K-user marketplace. **Use Stripe Connect Express in parallel for creator payouts**. Once GMV justifies it (~$500K/yr), migrate buyer side to Stripe Managed Payments or self-MoR with Stripe Tax. The **split model** (MoR for collection, Connect for payout) is uncommon but valid — alternatively stay fully on LS until they support multi-creator splits, or use Polar.sh which is MoR + built for this exact use case.

**Polar.sh** — Open-source MoR built for developer tool sales with creator payouts. Worth evaluating; less mature than Paddle but purpose-fit.

---

## 8. Platform Liability — Hosted Code, Section 230, DMCA, DSA

**Core risk**: A creator uploads a "skill" or "MCP server" containing malware, credential stealer, or crypto miner. A buyer runs it on their machine. Damages occur.

### US — Section 230 (47 USC § 230)
- Protects platforms from liability for third-party content. Does NOT protect from: federal criminal law, IP (handled by DMCA), ECPA (stored communications), FOSTA-SESTA (sex trafficking), or your own first-party content.
- **Case law drift (2024-2026)**: Gonzalez v. Google (2023, SCOTUS) declined to narrow §230. But recent state and district courts (K.G.M. v. Meta, New Mexico v. Meta, Mar 2026) have started treating algorithmic recommendation as first-party conduct not covered by §230. If RuleSell uses ranking/recommendation, this is a growing exposure.
- §230 does NOT pre-empt product liability claims if the platform "materially contributed" to the harm (e.g., promised security review, hosted code that executes on users).

### US — DMCA (17 USC § 512) Safe Harbor
- Requires: registered **DMCA agent** with Copyright Office ($6 filing), clearly posted takedown procedure, repeat-infringer policy, expeditious removal on valid notice, counter-notice + putback process.
- **Must have at launch** — unregistered = no safe harbor.

### EU — DSA notice-and-action (covered above, section 2)

### Hosting code vs linking to GitHub — **liability fork**
- **Hosting files yourself**: You are a "hosting service" (DSA Art. 6) and an "online service provider that stores content at direction of users" (DMCA §512(c)). Get safe harbor by following the process. But you also become a target for malware reports, and duty of care is arguably higher when you actually transmit the binary.
- **Linking to GitHub**: You become an "information location tool" (DMCA §512(d)) — narrower safe harbor but much lower liability surface for execution harms. You never served the malicious binary; you linked to it. Downside: no control, GitHub can remove, bad UX (users bounce off).
- **Hybrid (recommended)**: Host metadata + readable previews + signed checksums; either mirror from GitHub with attribution or host artifacts yourself with mandatory static analysis (antivirus scan, suspicious-pattern detection), signed provenance, and explicit "execute at your own risk" disclaimer. Require creators to connect their GitHub and verify repo ownership.

**Mitigation layers**:
- Mandatory **content scanning** pipeline: VirusTotal, Semgrep rules for known bad patterns (obfuscation, exfil endpoints, eval of remote content), LLM-assisted review.
- **Sandboxed preview** (e.g., Vercel Sandbox, Firecracker microVM) before publishing.
- **Signed publisher identity** — verified seller badge, forces KYC via DSA Art. 31 for traders.
- **Explicit safety disclaimer** on every product page + execute-locally warning.
- **Abuse report** button one click away.
- **Immutable version history** + ability to pull a version across all installs.

---

## 9. Content Moderation — DMCA, Trademark, Malware

- **DMCA**: registered agent + takedown form + counter-notice + repeat infringer policy.
- **Trademark**: no safe harbor like DMCA; liability depends on knowledge. Publish a trademark complaint form; act on credible notices.
- **Malware / security**: not a statutory safe harbor, but responsive removal + scanning + creator KYC reduces negligence exposure.
- **DSA statement of reasons**: every removal generates a structured JSON record submitted to the DSA Transparency Database API.

---

## 10. Payout Regulations — Stripe Connect

### Connect account types
| Type | Onboarding | KYC owner | Dashboard | Fit |
|---|---|---|---|---|
| Standard | Creator has own Stripe | Creator | Creator's own | Established sellers |
| Express | Hosted onboarding | Stripe manages KYC | Stripe Express | **Marketplace default** |
| Custom | API-driven | You manage KYC | You build | Max control, compliance burden |

**Recommendation**: **Stripe Connect Express** — Stripe owns the KYC/PEP/OFAC sanctions screening (reduces your compliance surface). Trade-off: less UI customization.

### 1099 reporting (US)
- **1099-K** (through 2025 tax year): $20K AND 200 transactions federally. State-specific lower thresholds (MA, VT, VA, IL $600; CA $600).
- **1099-NEC/MISC** threshold rises **from $600 to $2,000 in 2026** under the One Big Beautiful Bill Act (July 2025).
- Stripe Connect issues 1099-K on behalf of platform at year-end; you configure the threshold.

### KYC / Sanctions
- Stripe Connect Express runs KYC, OFAC, PEP, and adverse media screening automatically at onboarding and periodically.
- You must still enforce **geo-blocking** at signup for comprehensively sanctioned jurisdictions (Cuba, Iran, North Korea, Syria, Crimea/DNR/LNR regions of Ukraine, Belarus for certain sectors).

---

## 11. Accessibility — WCAG 2.2 AA + EAA + ADA (covered in §4)

**Summary checklist**: contrast, focus states, keyboard paths, alt text, labels, aria-live for errors, form error identification, skip links, semantic HTML, accessibility statement.

---

## 12. Age Gates — COPPA + GDPR-K

### COPPA (15 USC § 6501)
- **Under 13**. Applies to services directed at children OR with actual knowledge of under-13 users.
- **Updated COPPA rule effective April 22, 2026**: tightened definitions, verifiable parental consent (VPC) expanded, data minimization, retention limits.
- Penalties up to $51,744 per violation (2025 inflation-adjusted).
- **Mitigation**: explicit "You must be 18+" in T&C + age gate at signup + delete-on-discovery policy. Don't market to minors.

### GDPR-K (Art. 8)
- Default age **16**. Member states may lower to **13** (UK, Ireland, Spain, Denmark, Poland, Sweden, Czech Rep, Latvia did).
- Under the member-state age, parental consent required for consent-based processing.
- DSA Art. 28 adds: no profiling-based ads to minors; platforms must ensure high privacy/safety/security.

**Recommendation**: **Restrict RuleSell to 18+** via T&C and signup age gate. Explicitly not directed at minors. This sidesteps almost all COPPA/GDPR-K complexity.

**Data model**: `users.date_of_birth` (at least year) or `users.is_adult_confirmed`; reject under-18 at signup.

---

## 13. ToS / Privacy Policy — Essentials

**Must have at launch**:
- Terms of Service: eligibility (18+), account rules, acceptable use, IP licensing (creator grants platform a license), payment terms, refund policy, DMCA/notice procedure, dispute resolution (arbitration clause with class-action waiver in US; consumer-protection-safe carve-outs in EU), termination, governing law, EU consumer rights addendum.
- Privacy Policy: GDPR Art. 13 + CCPA/CPRA requirements merged. Processor list.
- Cookie Policy: category breakdown + vendors.
- Acceptable Use Policy: prohibits malware, illegal content, harassment, copyright infringement, unlawful data collection.
- DMCA Policy: designated agent, notice form, counter-notice, repeat infringer.
- Creator Agreement: separate — commission %, payout schedule, KYC, content warranties (creator indemnifies platform for IP/malware claims), license grants.
- EU Consumer Rights Notice: 14-day withdrawal right for digital content UNLESS buyer consents to immediate download and waives right (must be explicit, one-click).
- Community Guidelines / Moderation Policy (DSA Art. 14).

---

## 14. Open Source Licensing on Listings

Creators will upload code built on open source. RuleSell must require license declaration and warn buyers when:

- **MIT / BSD / Apache 2.0** — Permissive. Safe to resell if credits preserved. Apache 2.0 adds patent grant.
- **GPL v2/v3** — Copyleft. If a listing incorporates GPL code, the listing must also be GPL. Cannot be sold as proprietary.
- **AGPL v3** — Strongest copyleft; triggers on **network use** (SaaS hosting). Most commercial marketplaces blacklist AGPL content.
- **LGPL** — Dynamic linking OK; modifications must be LGPL.
- **SSPL / BSL / Elastic License** — Source-available but not OSS; usage restrictions. Needs per-license review.
- **Creative Commons** — CC-BY fine; CC-BY-NC prohibits commercial use (incompatible with paid listings); CC-BY-SA triggers share-alike.

**Compatibility traps**:
- Apache 2.0 ↔ GPLv2: **incompatible**. Apache → GPLv3 only.
- GPLv2 ↔ GPLv3: incompatible unless GPLv2 is "or later".
- MIT is compatible with everything.

**Data model**: `listings.license` (SPDX identifier — enum), `listings.license_compatibility_warnings` computed from dependency scan.

**UI**: license badge on listing card; warning modal on purchase if license requires attribution or is copyleft; creator must declare and accept responsibility.

---

## 15. Export Controls & Sanctions

- **Comprehensive sanctions** (OFAC): Cuba, Iran, North Korea, Syria + Crimea/DNR/LNR regions. U.S. persons cannot provide software/services to these jurisdictions without a license. RuleSell must geo-block at signup + payment.
- **Russia / Belarus**: targeted not comprehensive; but EU Regulation 833/2014 (amended) prohibits provision of "software for enterprise management" and certain digital services to Russia. Safer to geo-block Russia entirely.
- **China / Hong Kong / Macau**: not comprehensively sanctioned but AI-related exports subject to EAR controls; BIS updated AI chip rules Jan 2026. Software configs for general-purpose AI tooling are currently OK for most users; enterprise KYC for any listing tagged "dual-use".
- **EAR classification**: most RuleSell content is **EAR99** or mass-market encryption (ECCN 5D992.c) — low-risk. But if a listing provides cryptographic functionality, a self-classification review is needed.

**Data model**: `users.country_of_residence` validated against sanctions list at signup and before each payment. Maintain a `sanctions_blocklist` table updated weekly from OFAC SDN + BIS Entity List.

**UI**: country picker at signup rejects blocked countries; post-signup residence change triggers re-verification; payment IP geocheck as a defense-in-depth.

---

## Synthesis

### Must-have at LAUNCH (cannot ship without)
1. **Cookie banner** (Accept/Reject/Customize, equal weight, consent log).
2. **Privacy policy + Terms of Service + Acceptable Use + DMCA policy + Cookie policy** pages.
3. **DMCA designated agent registered** with Copyright Office ($6) + takedown form live.
4. **18+ age gate** at signup + "not directed at children" clause.
5. **Sanctions geo-block** on signup (Cuba, Iran, NK, Syria, Crimea/DNR/LNR; Russia recommended).
6. **Creator KYC via Stripe Connect Express** for any paid seller (handles OFAC/PEP).
7. **Trader KYC (DSA Art. 31)** collection for paid sellers selling to EU — legal name, address, bank, reg number.
8. **Notice-and-action ("Report" button)** on listings, reviews, profiles.
9. **EU legal representative** appointed (DSA Art. 13) if RuleSell entity is outside EU.
10. **VAT collection** — via MoR (Paddle/Lemon Squeezy/Polar) OR Stripe Tax + OSS + UK registration.
11. **Static malware scan pipeline** on every upload (VirusTotal + Semgrep rules) + explicit execute-at-your-own-risk warning on product pages.
12. **License declaration** required per listing (SPDX) + compatibility warning on copyleft.
13. **DSR self-serve**: export + delete in account settings.
14. **"Do Not Sell/Share" link** if using any retargeting pixels + **Global Privacy Control** honored.
15. **WCAG 2.2 AA** baseline audit (Lighthouse + keyboard test + contrast check).

### Within 90 DAYS
- **DSA transparency report** scaffolding (numbers tracked from day 1, first report published at 12 months).
- **Statement of reasons** structured records submitted to DSA Transparency Database.
- **Appeal flow** for moderation decisions (6-month window).
- **Accessibility statement** published at `/accessibility`.
- **Record of Processing Activities** (GDPR Art. 30) documented in Notion or a Vanta-like tool.
- **DPAs signed** with every processor (Stripe, Vercel, Neon, Sentry, email, analytics).
- **Trusted flagger intake** (DSA Art. 22) — form + SLA.
- **State-by-state sales-tax nexus monitoring** if not using MoR.
- **Repeat-infringer and repeat-misuse suspension policies** documented.
- **Incident response plan** for 72h GDPR breach notification.

### Defer to 1K USERS (or earlier if triggered)
- DPO appointment (only if large-scale monitoring trips Art. 37).
- Formal SOC 2 Type II audit.
- Virtual DPO retainer (€200-600/mo).
- Full WCAG third-party audit.
- ADMT risk assessments (CCPA, effective 2027).
- EU member-state transposition specifics (BFSG Germany, etc.) beyond core EAA.
- B2B contract templates (DPAs, MSAs) for enterprise buyers.
- Dispute resolution provider contract (DSA Art. 21).

---

### Recommendation 1 — Merchant of Record: YES, use one

Use **Paddle**, **Lemon Squeezy**, or **Polar.sh** as merchant of record for the first 12-24 months. Reasoning:

- **Tax compliance is a landmine**. EU OSS, UK, Canada, Australia, Japan, Singapore, India, US 30-state sales tax — each with registration, filing, audit exposure. A 2% premium is cheap insurance.
- **Chargebacks**. MoR absorbs them.
- **Focus**. Founder attention belongs on creator acquisition and content quality, not tax returns.
- **Reversibility**. Switch to self-MoR via Stripe Managed Payments (new 2026 product) once GMV > ~$500K/yr and compliance FTE is justified.
- **Split model**: MoR handles buyer-side; **Stripe Connect Express** handles creator payouts + KYC + sanctions. Two systems is worth it.

Polar.sh is worth a serious look — it is open-source, developer-tool focused, MoR, and built around creator splits. Paddle is the safest if you want zero surprises.

### Recommendation 2 — Hosting strategy: HYBRID

Host metadata, previews, and docs yourself. For the **code artifact itself**:
1. **Require GitHub link + ownership verification** (OAuth into creator GitHub, confirm repo owner).
2. **Mirror the release tarball** into your own object storage (R2 / Vercel Blob) at publish time, pinned by commit SHA, checksummed.
3. **Run the static scan pipeline** (VirusTotal, Semgrep, LLM review) on the mirrored artifact. Block publish if fails.
4. **Serve from your CDN** with a signed URL that embeds the checksum.
5. **Public GitHub link shown as provenance** on the product page.

Reasoning:
- Pure GitHub linking gives weak UX (creators delete, repos rename, versions drift) and creates reliance on a third party you can't audit.
- Pure self-hosting gives the strongest liability surface — you become the distributor.
- Hybrid gives you DMCA §512(c) safe harbor (you host at the direction of users, with takedown process), full UX control, a scan gate, AND a GitHub provenance signal buyers trust.
- Your execute-locally disclaimer + static scan + creator KYC + reversible version pull gives you a defensible "duty of care" narrative if a malicious upload ever slips through.

### Recommendation 3 — Top 5 things compliance MUST add to data model + UI

1. **`consent_events` table + cookie banner v1** — purpose-scoped, auditable consent log keyed on user_id (or anon_id pre-login). Banner renders server-side at first visit, blocks non-essential scripts until resolved. This is the foundation for GDPR, CCPA, ePrivacy, DSA Art. 25 (no dark patterns).

2. **`moderation_notices` + `moderation_decisions` tables + Report button on every listing/review/profile** — DSA Art. 16/17 notice-and-action with reasoned statement generation. Even if moderation volume is zero at launch, the schema, SLA timers, and public submission path to the DSA Transparency Database must exist. Tied to `appeals` (6-month window).

3. **`trader_kyc` table + creator onboarding with trader toggle + Stripe Connect Express handoff** — DSA Art. 31 trader identification combined with Stripe-managed OFAC/PEP/sanctions screening. The toggle "Are you selling in the course of a commercial activity?" determines whether EU trader requirements kick in. KYC failure blocks listing publish, not just payout.

4. **`listings.license` (SPDX enum) + `listings.scan_results` (JSON) + publish-time scan gate UI** — creator must declare license; publish pipeline runs VirusTotal + Semgrep + LLM pattern check; results stored; badges shown on listing card; copyleft triggers purchase-time warning modal. License + scan are the single biggest levers on platform liability.

5. **`users.country_of_residence` + `users.age_confirmed` + geo-block at signup + payment-time re-check** — sanctions enforcement (Cuba/Iran/NK/Syria/Russia), 18+ restriction to sidestep COPPA/GDPR-K, and VAT-rate determination all key off these two fields. They must be collected at signup, immutable without re-verification, and guarded on every payment/publish action.

---

### Biggest non-obvious risks

- **Texas TDPSA has no revenue threshold** — US state privacy hits at user #1.
- **DSA Art. 24(2) monthly-active-recipient publishing** is mandatory even at zero users.
- **UK VAT is £0 threshold for non-UK digital services** — one UK sale obligates you.
- **Section 230 is eroding for algorithmic recommendation** — be careful with "recommended for you" surfaces until case law settles.
- **AGPL creeping in via a transitive dependency** can taint a creator's listing; your scanner should flag license pollution.
- **EAA microenterprise exemption evaporates** the moment you hit 10 employees OR €2M revenue — design accessible from day 1.

---

## Sources

- EU GDPR: [Regulation (EU) 2016/679 — EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj); [CookieHub 2026 guide](https://www.cookiehub.com/blog/cookie-consent-management-guide-2026); [Sprinto SMB GDPR guide](https://sprinto.com/blog/gdpr-for-small-companies/)
- EU DSA: [European Commission DSA page](https://digital-strategy.ec.europa.eu/en/policies/digital-services-act); [DSA VLOP designation](https://digital-strategy.ec.europa.eu/en/policies/dsa-vlops); [Wilson Sonsini reporting obligations](https://www.wsgr.com/en/insights/upcoming-reporting-obligations-under-the-eu-digital-services-act.html); [Commission evaluation 2026](https://digital-strategy.ec.europa.eu/en/news/commission-evaluates-digital-services-acts-interaction-other-eu-laws-and-its-designation-threshold); [Compliance & Risks marketplace obligations](https://www.complianceandrisks.com/blog/online-marketplaces-are-accountable-for-products-sold-on-their-platforms-eu-digital-services-act/)
- EU DMA: [European Commission DMA page](https://digital-strategy.ec.europa.eu/en/policies/dma-gatekeepers)
- EU EAA: [Level Access EAA guide](https://www.levelaccess.com/compliance-overview/european-accessibility-act-eaa/); [Sharetribe marketplaces EAA](https://www.sharetribe.com/academy/european-accessibility-act-for-online-marketplaces/); [Siteimprove EAA e-commerce](https://www.siteimprove.com/blog/european-accessibility-act-e-commerce/)
- CCPA/CPRA: [CA OAG CCPA](https://oag.ca.gov/privacy/ccpa); [CPPA FAQ](https://cppa.ca.gov/faq.html); [Greenberg Traurig 2026 updates](https://www.gtlaw.com/en/insights/2025/9/revised-and-new-ccpa-regulations-set-to-take-effect-on-jan-1-2026-summary-of-near-term-action-items); [Clym 2026 notice requirements](https://www.clym.io/blog/ccpa-notice-requirements-update)
- US state privacy: [Bloomberg Law tracker](https://pro.bloomberglaw.com/insights/privacy/state-privacy-legislation-tracker/); [MultiState 2026 summary](https://www.multistate.us/insider/2026/2/4/all-of-the-comprehensive-privacy-laws-that-take-effect-in-2026); [IAPP tracker](https://iapp.org/resources/article/us-state-privacy-legislation-tracker); [Osano 2026 landscape](https://www.osano.com/us-data-privacy-laws)
- EU VAT OSS: [Your Europe OSS](https://europa.eu/youreurope/business/taxation/vat/one-stop-shop/index_en.htm); [Commenda non-EU VAT](https://www.commenda.io/sales-tax/eu-vat-compliance-for-non-eu-businesses-in-2025); [Intertax OSS vs MOSS](https://polishtax.com/what-is-vat-moss/)
- MoR comparison: [GlobalSolo Stripe vs Paddle vs LS 2026](https://www.globalsolo.global/blog/stripe-vs-paddle-vs-lemon-squeezy-2026); [Lemon Squeezy 2026 update](https://www.lemonsqueezy.com/blog/2026-update); [Medium $10K comparison](https://medium.com/@muhammadwaniai/stripe-vs-paddle-vs-lemon-squeezy-i-processed-10k-through-each-heres-what-actually-matters-27ef04e4cb43)
- Section 230 / DMCA: [Haynes Boone ISP liability](https://www.haynesboone.com/news/publications/section-230-and-dmca-safe-harbors); [Crowell CDA DMCA](https://www.crowell.com/en/insights/client-alerts/the-cda-and-dmca-recent-developments-and-how-they-work-together-to-regulate-online-services); [Congress.gov §230 overview](https://www.congress.gov/crs-product/R46751); [EFF Section 230](https://www.eff.org/issues/cda230)
- Stripe Connect 1099: [Stripe 1099-K docs](https://support.stripe.com/questions/1099-k-tax-forms); [Stripe Connect tax reporting](https://docs.stripe.com/connect/tax-reporting); [1800Accountant 2026 changes](https://1800accountant.com/blog/irs-1099-reporting-changes-2026)
- COPPA / GDPR-K: [Pandectes children's privacy](https://pandectes.io/blog/childrens-online-privacy-rules-around-coppa-gdpr-k-and-age-verification/); [FTC COPPA 2026 update](https://www.toyassociation.org/PressRoom2/News/2026-News/updated-coppa-rule-requirements-take-effect-april-22.aspx); [Usercentrics COPPA 2026](https://usercentrics.com/knowledge-hub/coppa-compliance/)
- Export controls: [OFAC sanctions programs](https://ofac.treasury.gov/sanctions-programs-and-country-information); [ArentFox 2026 top five](https://www.afslaw.com/perspectives/national-security-counsel/top-five-export-controls-and-sanctions-areas-watch-2026); [Mayer Brown AI chip rules 2026](https://www.mayerbrown.com/en/insights/publications/2026/01/administration-policies-on-advanced-ai-chips-codified)
- Open source: [Snyk license types](https://snyk.io/articles/open-source-licenses/); [Brainhub licenses to avoid](https://brainhub.eu/library/open-source-licenses-to-avoid); [Mend license comparison](https://www.mend.io/blog/open-source-licenses-comparison-guide/)

---

**Status**: COMPLETE. Next action: Baha reviews data-model deltas; Nalba reviews UI requirements for cookie banner, report button, trader toggle, and publish-time scan gate.

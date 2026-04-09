# RuleSell Compliance Citations — Phase 10 Legal Page Reference

**Prepared by:** researcher (background task, per team-lead request)
**Date:** 2026-04-12
**Purpose:** Curated list of 5-10 most material specific compliance citations for Phase 10 legal page copy. Includes DSA, GDPR, EAA, CCPA/CPRA, DMCA, Section 230, COPPA, OFAC.

---

## Regulatory Citations by Domain

### EU — Digital Services Act (Regulation 2022/2065)

| Citation | Topic | Requirement | Phase 10 Legal Section |
|----------|-------|-------------|----------------------|
| **Art. 13** | EU Legal Representative | Non-EU platform MUST appoint (operational, €1-3K/yr). Required before public launch. | Footer: "Legal Compliance" → "Our EU Representative" |
| **Art. 14** | Terms & Conditions | T&C must describe content moderation, algorithmic decisions, redress. | Link existing T&C; embed "How We Moderate" section |
| **Art. 16** | Notice & Action — Mechanism | User can report any listing/review/profile via electronic form; platform confirms receipt, acts without undue delay. | Footer: "Report" link; Moderation Policy page |
| **Art. 17** | Statement of Reasons | Every removal/demotion/suspension triggers reasoned notice (legal basis, facts, appeal path). Must be sent to user. | Moderation Policy: "Your Rights When We Act" |
| **Art. 24(2)** | Monthly Active Recipients (MAU) | Platform must publish rolling 6-month MAU counter (even if < 100K). Mandatory baseline. | `/transparency` page: "Monthly Active Users (EU)" |
| **Art. 25** | Dark Patterns Prohibition | No deceptive UX. Consent must be as easy to withdraw as to grant. | Cookie Policy + Privacy Settings: Equal-weight buttons |
| **Art. 28** | Protection of Minors | No targeted ads based on profiling of minors; high level of privacy/safety/security. | Privacy Policy: "Protecting Children Online" |
| **Art. 30-31** | Trader KYC ("Trader" definition & verification) | Paid sellers = "traders" under DSA; must complete KYC: legal name, address, bank account, registration number. Enforced at seller onboarding via Stripe Connect Express. | Seller Onboarding Policy: "Trader Status & Verification" |

### EU — General Data Protection Regulation (Regulation 2016/679)

| Citation | Topic | Requirement | Phase 10 Legal Section |
|----------|-------|-------------|----------------------|
| **Art. 3** | Territorial Scope | GDPR applies to any business processing data of EU residents, regardless of where hosted. RuleSell in scope from first EU user. | Privacy Policy preamble: "Who This Applies To" |
| **Art. 6** | Lawful Basis | Each processing purpose needs one basis: contract, legitimate interest, consent, or other. RuleSell uses all three. | Privacy Policy: "Legal Basis for Data Processing" (table) |
| **Art. 12-22** | Data Subject Rights | Access (Art. 15), delete (Art. 17), export (Art. 20), correct (Art. 16), restrict (Art. 18), object (Art. 21). Must respond within 30 days (Art. 12(3)). | Account Settings: "Manage My Data" → Export / Delete / Correct |
| **Art. 13/14** | Privacy Notice | Must be given at collection point (or online within reasonable timeframe). Content: identity, purposes, legal basis, recipients, retention, rights. | Privacy Policy (comprehensive); shown pre-signup |
| **Art. 28** | Data Processing Agreement (DPA) | Every processor (Stripe, Vercel, Neon, email provider, etc.) requires signed DPA. Keep Record of Processing Activities (Art. 30). | Legal Note: "Processor Agreements" (vendor list maintained internally) |
| **Art. 33** | Breach Notification | Notify supervisory authority within 72h if risk to rights/freedoms. | Privacy Policy: "Security & Data Breaches" |
| **Art. 37** | Data Protection Officer (DPO) | Mandatory only for public authorities, large-scale systematic monitoring, or special-category data processing. **RuleSell does NOT need DPO at launch.** Virtual DPO optional (€200-600/mo). | Legal Note: Deferred to 1K+ users (not required at launch) |
| **Ch. V** | International Data Transfers | US processors require SCCs + transfer impact assessment (post-Schrems II). EU-US Data Privacy Framework (DPF) for certified US providers. | Legal Note: "International Data Transfers" (maintained by compliance officer) |

### US — California Consumer Privacy Act (CCPA) + California Privacy Rights Act (CPRA)

| Citation | Topic | Requirement | Phase 10 Legal Section |
|----------|-------|-------------|----------------------|
| **§ 1798.100** | Consumer Rights (CCPA baseline) | Users in California have rights: access, delete, opt-out of "sale or sharing." Must respond within 45 days. | Account Settings: "Your Privacy Choices" |
| **§ 1798.120 (CPRA add)** | Do Not Sell or Share My Personal Information | "Do Not Sell or Share My Personal Information" link in footer. Consumers can opt-out via [Global Privacy Control (GPC)](https://globalprivacycontrol.org/) header. | Footer: "Do Not Sell or Share" link + Privacy Settings honor GPC |
| **§ 1798.121 (CPRA add)** | Automated Decision-Making (ADMT) | For "significant decisions" (denial of service, eligibility), transparency + opt-out required. **RuleSell defers detailed ADMT assessment to 1K+ users.** | Privacy Policy: "Automated Decisions (Deferred)" |
| **Effective Dates** | CCPA (Jan 1, 2020); CPRA (Jan 1, 2023); Risk Assessment requirement (first report April 1, 2028). | Track filing deadlines internally. | Legal Note: "Compliance Timeline" (maintained by compliance officer) |

### US — Children's Online Privacy Protection Act (COPPA)

| Citation | Requirement | Compliance Path | Phase 10 Legal Section |
|----------|-----------|-----------------|----------------------|
| **16 CFR 312 (Updated April 22, 2026)** | Biometric data now covered (fingerprints, face, voiceprints, DNA); no indefinite retention; separate parental consent for data sharing with advertisers/AI training. Penalty: $51,744 per incident per day. | **RuleSell blocks <18 at signup (date-of-birth verification).** COPPA does not apply to our user base. | Terms of Service: "Age & Eligibility" (18+ gate); Privacy Policy footnote: "COPPA Compliance" |

### US — Digital Millennium Copyright Act (DMCA)

| Citation | Topic | Requirement | Phase 10 Legal Section |
|----------|-------|-------------|----------------------|
| **§ 512(c)** | Hosting Safe Harbor (Takedown Safe Harbor) | Requires: (1) designated DMCA agent, (2) takedown notice process, (3) counter-notice policy, (4) repeat infringer policy. | "DMCA / IP Policy" page: Designated Agent, Process, Counter-Notice Rights |
| **§ 512(b)(2)(E)** | Agent Registration | Register DMCA agent with US Copyright Office (form SR or TX, $6 fee). Before public launch. | Legal Note: "Registered DMCA Agent [Name, contact, registration #]" |
| **License Declaration** | SPDX Compliance | Every listing declares license (MIT, Apache-2.0, GPL-3.0, CC-BY-NC, Commercial, etc.); incompatibility warnings shown on purchase. | Each listing detail page: "License" badge + "License Information" section |

### EU — European Accessibility Act (Directive 2019/882) + WCAG 2.2 AA

| Citation | Requirement | Compliance Path | Phase 10 Legal Section |
|----------|-----------|-----------------|----------------------|
| **EN 301 549 / WCAG 2.2 Level AA** | Digital Accessibility Standard | All screens, components, forms, modals, error messages meet WCAG 2.2 AA: contrast (4.5:1), keyboard navigation, focus indicators, alt text, labels. | "Accessibility Statement" page + Footer: "Accessibility" |
| **Microenterprise Exemption** | Small Business Relief | <10 employees AND <€2M turnover = exempt from service provisions (but not national laws). Exemption expires upon crossing either threshold. | Legal Note: "Accessibility Exemption Status" (tracked for compliance officer updates) |

### US — Section 230, Communications Decency Act

| Citation | Topic | Application | Phase 10 Legal Section |
|----------|-------|-----------|----------------------|
| **47 U.S.C. § 230(c)(1)** | Immunity for Platforms | Platform not liable for third-party content (listings, reviews, comments) as long as no role in creating/developing illegal content. Applies to RuleSell. | Terms of Service: "Content Liability Disclaimer" |

### International — OFAC Sanctions List

| Citation | Requirement | Compliance Path | Phase 10 Legal Section |
|----------|-----------|-----------------|----------------------|
| **OFAC SDN List** | Sanctions Screening | Block signup/purchase from comprehensively sanctioned countries (Cuba, Iran, North Korea, Syria, Crimea, Belarus sector-specific). Ongoing screening of transactions. | Signup Flow: Geo-block; Payment: Stripe/Paddle handle OFAC screening at transaction | Terms of Service: "Geographic Restrictions" |

---

## Quick Copy-Paste Template for Phase 10 Writer

When drafting legal sections, reference as follows:

### For EU Compliance Section:
- **DSA Art. 13** — EU Legal Representative (required, appointed before launch)
- **DSA Art. 16-17** — Notice & Action + Statement of Reasons (moderation policy)
- **DSA Art. 24(2)** — Monthly Active Recipients transparency (publish MAU on `/transparency`)
- **DSA Art. 30-31** — Trader KYC for paid sellers (enforced via Stripe Connect Express)
- **GDPR Art. 6, 13, 33** — Lawful basis, privacy notice, breach notification (privacy policy)
- **GDPR Art. 5(3)** — Cookie consent (ePrivacy Directive; equal-weight buttons)
- **GDPR Art. 12-22** — Data subject rights (access, delete, export in account settings)
- **EAA / WCAG 2.2 AA** — Digital accessibility (statement + compliance on all screens)

### For US Compliance Section:
- **CCPA § 1798.100** — Consumer rights (access, delete, opt-out in privacy settings)
- **CCPA § 1798.120 (CPRA)** — "Do Not Sell" link in footer; honor Global Privacy Control
- **COPPA (April 22, 2026 update)** — Biometric data coverage + 18+ age gate sidesteps obligation
- **DMCA § 512(c), § 512(b)(2)(E)** — Takedown safe harbor + designated agent registration
- **Section 230(c)(1)** — Platform immunity for third-party content (in T&C)
- **OFAC SDN List** — Geo-blocking for sanctioned jurisdictions (in T&C + signup)

### For General/Risk Sections:
- **CPRA § 1798.121 (ADMT)** — Automated decision-making (note: deferred to 1K+ users)
- **GDPR Art. 37 (DPO)** — Data Protection Officer (note: not required at launch)
- **CCPA Risk Assessment** — First report due April 1, 2028 (not required at launch)

---

## Key Assumptions & Caveats

1. **No legal advice.** These citations are research-backed reference pointers. Qualified legal counsel must review all published policies before launch.
2. **Execution burden on seller onboarding.** DSA Art. 30-31 (Trader KYC) is enforced in the seller flow, not on legal pages themselves (though reference needed in "Seller Agreement" / "Seller Terms").
3. **COPPA April 22, 2026 deadline is imminent.** 18+ age gate + privacy policy note are sufficient; no policy changes required beyond what synthesis already includes.
4. **EU legal representative appointment is operational.** Must be completed before public launch; T&C page should list name/contact once appointed.
5. **Accessibility statement on public page is mandatory.** Must be comprehensive (contrast, keyboard, alt text, etc.). Internal tracking of audit + remediation plan.
6. **OFAC screening is delegated to payment processor** (Stripe/Paddle does screening at transaction time). RuleSell adds geo-block at signup as extra layer.
7. **Section 230 immunity is not guaranteed.** It requires platform to not have knowledge of illegality. Our moderation policy ("Report" button, review process) supports immunity claim.

---

## Compliance Officer Checklist for Phase 10

- [ ] EU legal representative appointed + name/contact added to T&C
- [ ] DMCA agent registered with US Copyright Office (form SR/TX, $6)
- [ ] Cookie banner: Accept/Reject/Customize buttons equal visual weight
- [ ] Privacy policy: DSA, GDPR, CCPA, COPPA sections drafted
- [ ] Privacy policy: Breach notification timeline (72h to EU authority) documented
- [ ] Data subject rights flows: Export, Delete, Correct fully functional in account settings
- [ ] Trader KYC form (name, address, bank, reg number) integrated into seller onboarding
- [ ] Moderation policy: "Report" button on all listings/reviews/profiles; SLA timer (Art. 16 "without undue delay")
- [ ] `/transparency` page: Monthly active EU recipients counter + annual transparency report template
- [ ] OFAC geo-block: Cuba, Iran, North Korea, Syria, Crimea/DNR/LNR, Belarus sector active at signup
- [ ] Accessibility audit: WCAG 2.2 AA scan on all pages; statement published
- [ ] Global Privacy Control (GPC) header honored in privacy settings
- [ ] COPPA: 18+ age gate + privacy policy note re: biometric data (April 22, 2026 update)
- [ ] Cookie consent logs stored in `consent_events` table (auditable)
- [ ] Processor DPA list maintained internally (Stripe, Vercel, Neon, email, analytics)
- [ ] Legal agreements drafted: T&C, Privacy Policy, Cookie Policy, Acceptable Use, Creator Agreement, DMCA Policy

---

## Sources

- [EU Digital Services Act — European Commission](https://digital-strategy.ec.europa.eu/en/policies/digital-services-act)
- [GDPR — Regulation 2016/679](https://gdpr-info.eu/)
- [CCPA — California Consumer Privacy Act](https://cppa.ca.gov/)
- [CPRA — California Privacy Rights Act](https://cppa.ca.gov/)
- [COPPA — 16 CFR Part 312 (Updated April 22, 2026)](https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule)
- [DMCA § 512 — Copyright Safe Harbors](https://www.copyright.gov/dmca/designate.html)
- [EAA / EN 301 549 — Digital Accessibility](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/03.02.01_60/en_301549v030201p.pdf)
- [WCAG 2.2 — Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [OFAC Sanctions List](https://ofac.treasury.gov/specially-designated-nationals-list-data-formats-data-schemas)
- [Global Privacy Control (GPC)](https://globalprivacycontrol.org/)
- [RuleSell Compliance Landscape — docs/research/2026-04-08-global-compliance-landscape.md](./2026-04-08-global-compliance-landscape.md)
- [RuleSell Research Synthesis — docs/research/2026-04-08-SYNTHESIS.md](./2026-04-08-SYNTHESIS.md)

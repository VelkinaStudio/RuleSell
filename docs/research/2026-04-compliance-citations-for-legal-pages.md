# RuleSell Compliance Citations — For Legal Page Copy (Phase 10)

**Prepared by:** researcher
**Date:** 2026-04-08
**Purpose:** Quick reference of 3-5 most material compliance citations for Phase 10 legal page drafting. Covers: DSA, GDPR, CCPA/CPRA, EAA, DMCA, COPPA.

---

## EU — Digital Services Act (DSA — Regulation 2022/2065)

**Most material articles for RuleSell:**

| Article | Topic | Requirement | Legal Page Section |
|---------|-------|-------------|-------------------|
| **Art. 13** | EU Legal Representative | Non-EU platforms MUST appoint (€1-3K/yr). Required before launch. | "About RuleSell" / "Legal Compliance" |
| **Art. 14** | Terms & Conditions | T&Cs must describe content moderation, algorithmic decisions, redress. | Link T&C (existing); embed moderation policy |
| **Art. 16** | Notice & Action | User can report any listing/review/profile. Platform confirms receipt, acts without undue delay. | Footer: "Report" link + contact form |
| **Art. 17** | Statement of Reasons | Every removal/demotion/suspension gets reasoned notice (legal basis, facts, appeal path). | In moderation decision emails; appeal form |
| **Art. 30-31** | Trader KYC | Paid sellers must declare name, address, bank, reg number (DSA "trader" status). | Seller onboarding flow; Stripe Connect Express gate |
| **Art. 24(2)** | Monthly Active Recipients | Publish rolling 6-month MAU counter (even if tiny — mandatory). | `/transparency` page |

---

## EU — General Data Protection Regulation (GDPR — Regulation 2016/679)

**Most material articles for RuleSell:**

| Article | Topic | Requirement | Legal Page Section |
|---------|-------|-------------|-------------------|
| **Art. 6** | Lawful Basis | Each data processing purpose needs one basis: contract, legitimate interest, or consent. RuleSell uses all three. | Privacy Policy (section: "Legal Basis for Processing") |
| **Art. 13/14** | Privacy Notice | Must be given at point of data collection (or online within reasonable timeframe). | Privacy Policy (comprehensive); shown at signup |
| **Art. 5(3) (ePrivacy Dir.)** | Cookie Consent | Non-essential cookies require prior opt-in. No dark patterns, symmetric buttons, auditable logs. | Cookie Policy + banner; stored in `consent_events` |
| **Art. 12-22** | Data Subject Rights | Access, delete, export, correct, restrict, object. Must respond in 1 month. | Account Settings: "Export My Data" / "Delete Account" |
| **Art. 33** | Breach Notification | Notify supervisory authority within 72h if risk to rights/freedoms. | Privacy Policy (section: "Security Incidents") |

---

## US — California Consumer Privacy Act (CCPA) / California Privacy Rights Act (CPRA)

**Most material sections for RuleSell:**

| Section | Topic | Requirement | Legal Page Section |
|---------|-------|-------------|-------------------|
| **CCPA § 1798.100** | Consumer Rights | Access, delete, opt-out of sale/share, and (CPRA) correct. | Account Settings: "Manage Privacy" |
| **CCPA § 1798.120** (CPRA addition) | Do Not Sell or Share | "Do Not Sell or Share My Personal Information" link in footer. Consumers can opt-out via Global Privacy Control. | Footer link + Privacy Settings |
| **CPRA § 1798.121** | Automated Decision-Making (ADMT) | For high-risk decisions (denial of service, eligibility), transparency + opt-out required. RuleSell defers detailed ADMT assessment to 1K users. | Privacy Policy (note: deferred requirement) |
| **CPRA § 1798.100(d)** | Risk Assessment | High-risk data practices (sale, sharing, processing of sensitive info) require documented risk assessments, annual attestation. First report due April 1, 2028. | Legal note (compliance officer task, deferred) |

---

## US — Children's Online Privacy Protection Act (COPPA)

**Most material requirement for RuleSell:**

| Rule/Deadline | Topic | Requirement | Legal Page Section |
|---|---|---|---|
| **April 22, 2026** | Updated Rule Effective | Biometric data now covered; no indefinite retention of children's data; separate parental consent for data sharing with advertisers/AI training. Penalty: $51,744 per incident per day. | Privacy Policy + Legal Note |
| **18+ Age Gate** | COPPA Compliance | RuleSell blocks <18 at signup (date-of-birth verification). Sidesteps COPPA entirely. | Terms of Service (section: "Age & Eligibility") |

---

## US — Digital Millennium Copyright Act (DMCA)

**Most material for RuleSell:**

| Section | Topic | Requirement | Legal Page Section |
|---|---|---|---|
| **§ 512(c)** | Hosting Safe Harbor | Requires: designated DMCA agent, takedown notice process, counter-notice policy. | "DMCA / IP Policy" page |
| **§ 512(b)(2)(E)** | Agent Registration | Register agent with US Copyright Office ($6, forms SR or TX). Before launch. | Legal reference only (no user-facing requirement) |
| **License Declaration** | SPDX Compliance | Every listing declares license (MIT, Apache, GPL, CC-BY-NC, Commercial, etc.); violations flagged. | Each listing detail page; "License" badge |

---

## EU — European Accessibility Act (EAA — Directive 2019/882) + WCAG 2.2

**Most material for RuleSell:**

| Requirement | Topic | Compliance Path | Legal Page Section |
|---|---|---|---|
| **WCAG 2.2 AA** | Digital Accessibility | All screens, components, forms, modals, error messages meet WCAG 2.2 Level AA (contrast, keyboard, focus, alt text, labels). | "Accessibility" footer link + statement |
| **Microenterprise Exemption** | Small Business Relief | RuleSell at launch likely <10 employees + <€2M turnover = exempt from service provisions (but not national laws). Exemption expires on first threshold cross. | Legal note (compliance officer task) |

---

## Quick Copy-Paste Template for Phase 10

When drafting legal page sections, cite as:

- **DSA Art. 13** — EU Legal Representative requirement
- **DSA Art. 16-17** — Notice & Action + Statement of Reasons
- **GDPR Art. 6, 13, 33** — Lawful Basis, Privacy Notice, Breach Notification
- **GDPR Art. 5(3)** — Cookie Consent (ePrivacy Directive reference)
- **CCPA § 1798.100, CPRA § 1798.121** — Consumer Rights, ADMT (deferred)
- **COPPA (April 22, 2026 update)** — Biometric data, no indefinite retention, 18+ gate sidesteps
- **DMCA § 512(c), (b)(2)(E)** — DMCA Agent, Takedown / Counter-Notice
- **EAA / WCAG 2.2 AA** — Digital Accessibility Standard

---

## Assumptions & Caveats

- **No legal advice.** These are research citations only. Legal review by qualified counsel required before publishing any policy.
- **DSA Art. 30-31 KYC** is enforced at seller onboarding (Stripe Connect Express gate), not on the legal pages themselves.
- **COPPA April 22, 2026 deadline** is <2 weeks from baseline. Compliance via 18+ age gate is straightforward; no COPPA-specific legal page text required beyond privacy policy note.
- **CCPA/CPRA risk assessment** deferred to 1K-user milestone per synthesis. Legal note sufficient for Phase 10.
- **No virtual DPO required at launch** (GDPR Art. 37); could add as optional feature post-launch.

---

## Sources

- `docs/research/2026-04-08-global-compliance-landscape.md` (full landscape, 14 domains)
- `docs/research/2026-04-08-SYNTHESIS.md` (launch gates, compliance must-haves, section 8)
- `docs/research/2026-04-continuous-monitoring.md` (Cycle 1, April 2026 updates)

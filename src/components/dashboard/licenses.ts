// SPDX license catalog used by the publishing wizard. Lives under
// components/dashboard rather than src/constants because constants/** is
// read-only for builder-dash. Move to src/constants/licenses.ts during a
// future consolidation pass.

export interface LicenseOption {
  spdx: string;
  name: string;
  commercial: boolean;
  attribution: boolean;
  shareAlike: boolean;
  copyleft: boolean;
  summary: string;
}

export const LICENSES: LicenseOption[] = [
  {
    spdx: "MIT",
    name: "MIT License",
    commercial: true,
    attribution: true,
    shareAlike: false,
    copyleft: false,
    summary: "Permissive. Commercial use allowed. Requires attribution.",
  },
  {
    spdx: "Apache-2.0",
    name: "Apache License 2.0",
    commercial: true,
    attribution: true,
    shareAlike: false,
    copyleft: false,
    summary: "Permissive with explicit patent grant.",
  },
  {
    spdx: "BSD-3-Clause",
    name: "BSD 3-Clause",
    commercial: true,
    attribution: true,
    shareAlike: false,
    copyleft: false,
    summary: "Permissive. No-endorsement clause.",
  },
  {
    spdx: "GPL-3.0",
    name: "GNU GPL v3",
    commercial: true,
    attribution: true,
    shareAlike: true,
    copyleft: true,
    summary: "Copyleft. Derivatives must be GPL.",
  },
  {
    spdx: "AGPL-3.0",
    name: "GNU AGPL v3",
    commercial: true,
    attribution: true,
    shareAlike: true,
    copyleft: true,
    summary: "Copyleft + network use disclosure.",
  },
  {
    spdx: "CC-BY-4.0",
    name: "Creative Commons Attribution 4.0",
    commercial: true,
    attribution: true,
    shareAlike: false,
    copyleft: false,
    summary: "Commercial OK with attribution.",
  },
  {
    spdx: "CC-BY-NC-4.0",
    name: "CC Attribution-NonCommercial 4.0",
    commercial: false,
    attribution: true,
    shareAlike: false,
    copyleft: false,
    summary: "No commercial use permitted.",
  },
  {
    spdx: "CC0-1.0",
    name: "CC0 1.0 Universal",
    commercial: true,
    attribution: false,
    shareAlike: false,
    copyleft: false,
    summary: "Public domain dedication.",
  },
  {
    spdx: "Commercial",
    name: "Commercial (RuleSell)",
    commercial: true,
    attribution: false,
    shareAlike: false,
    copyleft: false,
    summary: "Governed by the RuleSell Creator Agreement.",
  },
];

export function findLicense(spdx: string | undefined): LicenseOption | undefined {
  if (!spdx) return undefined;
  return LICENSES.find((l) => l.spdx === spdx);
}

export function isNonCommercial(spdx: string | undefined): boolean {
  const lic = findLicense(spdx);
  return !!lic && !lic.commercial;
}

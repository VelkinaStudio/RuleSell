// ISO-3166 alpha-2 codes for the comprehensive sanctions list per US OFAC,
// EU restrictive measures, and UK financial sanctions. The Crimea/DNR/LNR
// regions of Ukraine are tracked separately by some lists but for a country
// picker the closest available code is RU; we leave them as commented entries
// since a country dropdown cannot represent a sub-region.
export const SANCTIONED_COUNTRIES: string[] = [
  "CU", // Cuba
  "IR", // Iran
  "KP", // North Korea
  "SY", // Syria
  // Sub-region: Crimea (UA-43), DNR (UA-DA), LNR (UA-LU) — handled separately.
];

export function isSanctioned(countryCode: string): boolean {
  return SANCTIONED_COUNTRIES.includes(countryCode.toUpperCase());
}

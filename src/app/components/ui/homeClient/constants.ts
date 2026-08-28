export const DISTRICT_INFO: Record<string, { label: string; navy: string; accent: string }> = {
    lakeland: { label: 'Lakeland District', navy: '#0D2B52', accent: '#B08D3F' },
    stpete: { label: 'St. Petersburg District', navy: '#123A6B', accent: '#D4AF37' },
    tampa: { label: 'Tampa District', navy: '#0A1F44', accent: '#C9A84C' },
};

// Manual pixel nudges applied on top of each district's computed centroid,
// so labels never collide even when two districts' county shapes sit close together.
// [dx, dy] in SVG viewBox units (viewBox is 0 0 900 900).
export const DISTRICT_LABEL_OFFSETS: Record<string, [number, number]> = {
    lakeland: [-40, -30],
    stpete: [0, 40],
    tampa: [40, -30],
};

export const OFFICERS_PREVIEW_COUNT = 5;

// Matches Sanity's free-text `district` field (e.g. "Tampa District",
// "St. petersburg district") to our internal slug used for colors/labels/routing.
export function districtSlugFromLabel(label?: string | null): string | null {
    if (!label) return null;
    const l = label.toLowerCase();
    if (l.includes('lakeland')) return 'lakeland';
    if (l.includes('petersburg') || l.includes('st. pete') || l.includes('stpete')) return 'stpete';
    if (l.includes('tampa')) return 'tampa';
    return null;
}

// ─── Tokens ─────────────────────────────────────────────────────────────
// ink       #0A1F44  primary navy, text on light
// field     #061024  hero / dark background
// gilt      #C9A84C  signature accent — map + seal marks + one CTA only
// parchment #F4EFE2  card / section background instead of flat white
// slate     #5B6B85  secondary text on dark
// hairline  rgba(201,168,76,.22)
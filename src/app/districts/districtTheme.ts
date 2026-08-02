export const districtThemes = {
    tampa: {
        navy: '#0A1F44',        // deep navy — anchor/flagship feel
        navySoft: '#F4F6FA',
        accent: '#C9A84C',      // classic gold
        accentDeep: '#A8863A',
        dividerVariant: 'wave' as const,
        heroTexture: 'none' as const,
        cardTopTreatment: 'solid' as const,   // thick solid gold bar
    },
    stpete: {
        navy: '#123A6B',        // brighter royal blue
        navySoft: '#EEF3FA',
        accent: '#D4AF37',      // warmer, richer gold
        accentDeep: '#B8912B',
        dividerVariant: 'angle' as const,
        heroTexture: 'diagonal-lines' as const,
        cardTopTreatment: 'gradient' as const, // gold-to-blue gradient bar
    },
    lakeland: {
        navy: '#0D2B52',        // cooler steel-navy
        navySoft: '#F0F3F7',
        accent: '#B08D3F',      // muted antique gold
        accentDeep: '#8F7130',
        dividerVariant: 'zigzag' as const,
        heroTexture: 'dot-grid' as const,
        cardTopTreatment: 'hairline' as const, // thin restrained line
    },
} as const;

export type DistrictSlug = keyof typeof districtThemes;
export type DistrictTheme = (typeof districtThemes)[DistrictSlug];

export function getDistrictTheme(slug: string): DistrictTheme {
    return districtThemes[slug as DistrictSlug] ?? districtThemes.tampa;
}
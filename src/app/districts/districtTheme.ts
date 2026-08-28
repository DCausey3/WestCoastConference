export const districtThemes = {
    tampa: {
        navy: '#0A1F44',
        navySoft: '#F4F6FA',
        accent: '#C9A84C',
        accentDeep: '#A8863A',
        dividerVariant: 'wave' as const,
        heroTexture: 'none' as const,
        cardTopTreatment: 'solid' as const,
        heroMotif: 'diamond' as const,       // rule-line ornament shape
        heroMovement: 'kenburns' as const,    // background animation style
        eyebrowFont: "'Cinzel', serif",
        titleFont: "'Lora', serif",
    },
    stpete: {
        navy: '#123A6B',
        navySoft: '#EEF3FA',
        accent: '#D4AF37',
        accentDeep: '#B8912B',
        dividerVariant: 'angle' as const,
        heroTexture: 'diagonal-lines' as const,
        cardTopTreatment: 'gradient' as const,
        heroMotif: 'wave' as const,
        heroMovement: 'panright' as const,
        eyebrowFont: "'Cinzel', serif",
        titleFont: "'Playfair Display', serif",
    },
    lakeland: {
        navy: '#0D2B52',
        navySoft: '#F0F3F7',
        accent: '#B08D3F',
        accentDeep: '#8F7130',
        dividerVariant: 'zigzag' as const,
        heroTexture: 'dot-grid' as const,
        cardTopTreatment: 'hairline' as const,
        heroMotif: 'leaf' as const,
        heroMovement: 'kenburns-slow' as const,
        eyebrowFont: "'Source Sans 3', sans-serif",
        titleFont: "'Playfair Display', serif",
    },
} as const;
export type DistrictSlug = keyof typeof districtThemes;
export type DistrictTheme = (typeof districtThemes)[DistrictSlug];

export function getDistrictTheme(slug: string): DistrictTheme {
    return districtThemes[slug as DistrictSlug] ?? districtThemes.tampa;
}
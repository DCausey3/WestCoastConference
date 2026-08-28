// app/districts/cardTopTreatment.ts
import type { DistrictTheme } from './districtTheme';

export function getCardTopStyle(theme: DistrictTheme): React.CSSProperties {
    switch (theme.cardTopTreatment) {
        case 'gradient':
            return { borderTop: `4px solid transparent`, borderImage: `linear-gradient(90deg, ${theme.accent}, ${theme.navy}) 1` };
        case 'hairline':
            return { borderTop: `1px solid ${theme.accent}`, boxShadow: `inset 0 1px 0 ${theme.accentDeep}` };
        case 'solid':
        default:
            return { borderTop: `4px solid ${theme.accent}` };
    }
}
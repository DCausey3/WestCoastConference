// app/districts/HeroTexture.tsx
import type { DistrictTheme } from './districtTheme';

export default function HeroTexture({ theme }: { theme: DistrictTheme }) {
    if (theme.heroTexture === 'none') return null;

    if (theme.heroTexture === 'dot-grid') {
        return (
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.06]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, ${theme.accent} 1px, transparent 0)`,
                    backgroundSize: '22px 22px',
                }}
            />
        );
    }

    if (theme.heroTexture === 'diagonal-lines') {
        return (
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.07]"
                style={{
                    backgroundImage: `repeating-linear-gradient(135deg, ${theme.accent} 0px, ${theme.accent} 1px, transparent 1px, transparent 14px)`,
                }}
            />
        );
    }

    return null;
}
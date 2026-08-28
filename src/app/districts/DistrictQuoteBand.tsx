// app/districts/DistrictQuoteBand.tsx
import type { DistrictTheme } from './districtTheme';

interface DistrictQuoteBandProps {
    quote: string;
    theme: DistrictTheme;
}

export default function DistrictQuoteBand({ quote, theme }: DistrictQuoteBandProps) {
    return (
        <section
            className="relative overflow-hidden px-6 py-16 text-center"
            style={{ background: theme.navy }}
        >
            {theme.heroTexture === 'dot-grid' && (
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, ${theme.accent} 1px, transparent 0)`,
                        backgroundSize: '20px 20px',
                    }}
                />
            )}
            {theme.heroTexture === 'diagonal-lines' && (
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage: `repeating-linear-gradient(135deg, ${theme.accent} 0px, ${theme.accent} 1px, transparent 1px, transparent 14px)`,
                    }}
                />
            )}
            <div className="h-0.5 w-12 mx-auto mb-6" style={{ background: theme.accent }} />
            <p
                className="italic max-w-2xl mx-auto relative z-10"
                style={{
                    color: theme.accent,
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 'clamp(1.5rem, 3vw, 2.1rem)',
                    lineHeight: '1.3',
                }}
            >
                "{quote}"
            </p>
        </section>
    );
}
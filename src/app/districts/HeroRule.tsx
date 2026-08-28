// app/districts/HeroRule.tsx
import type { DistrictTheme } from './districtTheme';

export default function HeroRule({ theme }: { theme: DistrictTheme }) {
    const shape = {
        diamond: <div className="w-2 h-2 rotate-45" style={{ background: theme.accent }} />,
        wave: (
            <svg width="18" height="10" viewBox="0 0 18 10">
                <path d="M0 5 Q4.5 0 9 5 T18 5" stroke={theme.accent} strokeWidth="1.5" fill="none" />
            </svg>
        ),
        leaf: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill={theme.accent}>
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 007 20c8 0 14-5 14-14 0-.5-.05-1-.09-1.5C19.5 5.5 18.34 6.86 17 8z" />
            </svg>
        ),
    }[theme.heroMotif] ?? <div className="w-2 h-2 rotate-45" style={{ background: theme.accent }} />;

    return (
        <div className="flex items-center gap-5 w-full max-w-sm mb-8 wcc-hero-fadeup" style={{ animationDelay: '0.5s' }}>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${theme.accent}99)` }} />
            {shape}
            <div className="flex-1 h-px" style={{ background: `linear-gradient(270deg, transparent, ${theme.accent}99)` }} />
        </div>
    );
}
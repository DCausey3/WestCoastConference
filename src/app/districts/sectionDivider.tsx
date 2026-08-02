interface SectionDividerProps {
    variant?: 'wave' | 'angle' | 'zigzag';
    flip?: boolean;
    color?: string; // top color the divider "cuts into" — usually matches the section below
    background?: string; // color behind the divider shape — matches the section above
}

export default function SectionDivider({
                                           variant = 'wave',
                                           flip = false,
                                           color = '#F4F6FA',
                                           background = '#FFFFFF',
                                       }: SectionDividerProps) {
    const paths: Record<string, string> = {
        wave: 'M0,64 C240,120 480,0 720,32 C960,64 1200,120 1440,64 L1440,120 L0,120 Z',
        angle: 'M0,0 L1440,90 L1440,120 L0,120 Z',
        zigzag: 'M0,60 L180,20 L360,60 L540,20 L720,60 L900,20 L1080,60 L1260,20 L1440,60 L1440,120 L0,120 Z',
    };

    return (
        <div
            aria-hidden="true"
            style={{ backgroundColor: background, lineHeight: 0, transform: flip ? 'scaleY(-1)' : undefined }}
        >
            <svg
                viewBox="0 0 1440 120"
                preserveAspectRatio="none"
                style={{ width: '100%', height: '60px', display: 'block' }}
            >
                <path d={paths[variant]} fill={color} />
            </svg>
        </div>
    );
}
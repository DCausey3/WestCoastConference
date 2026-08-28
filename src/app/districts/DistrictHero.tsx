import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { client } from '@/sanity/client';
import type { District } from './Getdistrictfulldata';
import type { DistrictTheme } from './districtTheme';
import HeroRule from './HeroRule';

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
    projectId && dataset ? createImageUrlBuilder({ projectId, dataset }).image(source) : null;

interface DistrictHeroProps {
    district: District;
    fallbackHeroImage: string;
    theme: DistrictTheme;
}

export default function DistrictHero({ district, fallbackHeroImage, theme }: DistrictHeroProps) {
    const heroUrl = district.heroImage
        ? urlFor(district.heroImage)?.width(1600).height(1200).url()
        : fallbackHeroImage;

    const movementClass = {
        kenburns: 'wcc-hero-kenburns',
        'kenburns-slow': 'wcc-hero-kenburns-slow',
        panright: 'wcc-hero-panright',
    }[theme.heroMovement] ?? 'wcc-hero-kenburns';

    return (
        <section
            className="relative w-full overflow-hidden"
            style={{ height: 'clamp(650px, 85vh, 900px)', background: theme.navy }}
        >
            {/* Background image with per-district movement */}
            <div className="absolute inset-0 z-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={heroUrl}
                    alt={district.name}
                    className={`w-full h-full object-cover ${movementClass}`}
                    style={{ opacity: 0.35, filter: 'contrast(1.1) brightness(0.7)' }}
                />
            </div>

            {/* Radial fog vignette in the district's own navy */}
            <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse 80% 60% at 50% 60%, ${theme.navy}00 20%, ${theme.navy}BF 100%)`,
                }}
            />

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col items-center justify-center px-6 text-center">
                <p
                    className="uppercase mb-8 wcc-hero-fadeup"
                    style={{
                        color: theme.accent,
                        fontFamily: theme.eyebrowFont,
                        fontSize: 'clamp(0.6rem, 1.8vw, 0.85rem)',
                        letterSpacing: '0.45em',
                        animationDelay: '0.3s',
                    }}
                >
                    West Coast Conference
                </p>

                <HeroRule theme={theme} />

                <h1
                    className="font-bold leading-none mb-8 wcc-hero-emerge"
                    style={{
                        fontFamily: theme.titleFont,
                        fontSize: 'clamp(3rem, 12vw, 5.5rem)',
                        letterSpacing: '-0.02em',
                        animationDelay: '0.6s',
                    }}
                >
                    <span className="text-white">{district.name.replace(' District', '')}</span>
                    <span style={{ color: theme.accent }}> District</span>
                </h1>

                {district.nickname && (
                    <p
                        className="text-white/80 italic mb-10 wcc-hero-fadeup"
                        style={{
                            fontFamily: theme.titleFont,
                            fontSize: 'clamp(0.95rem, 2.5vw, 1.25rem)',
                            animationDelay: '1.2s',
                        }}
                    >
                        "{district.nickname}"
                    </p>
                )}

                {district.counties && district.counties.length > 0 && (
                    <div className="flex gap-2 flex-wrap justify-center wcc-hero-fadeup" style={{ animationDelay: '1.5s' }}>
                        {district.counties.map((county) => (
                            <span
                                key={county}
                                className="px-3 py-1.5 rounded-full text-sm"
                                style={{ background: 'rgba(255,255,255,0.1)', color: theme.accent, border: `1px solid ${theme.accent}4D`, fontWeight: 600 }}
                            >
                                {county} County
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Gold floor */}
            <div
                className="absolute bottom-0 left-0 w-full h-[3px] z-30"
                style={{
                    background: `linear-gradient(90deg, transparent 0%, ${theme.accent} 40%, ${theme.accent} 60%, transparent 100%)`,
                    boxShadow: `0 -12px 40px ${theme.accent}73`,
                }}
            />
        </section>
    );
}
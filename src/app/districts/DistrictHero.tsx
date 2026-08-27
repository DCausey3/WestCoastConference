import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { client } from '@/sanity/client';
import type { District } from './Getdistrictfulldata';

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
    projectId && dataset
        ? createImageUrlBuilder({ projectId, dataset }).image(source)
        : null;

interface DistrictHeroProps {
    district: District;
    fallbackHeroImage: string;
}

export default function DistrictHero({ district, fallbackHeroImage }: DistrictHeroProps) {
    const heroUrl = district.heroImage
        ? urlFor(district.heroImage)?.width(1200).height(1000).url()
        : fallbackHeroImage;

    return (
        <section className="bg-[#0A1F44] relative overflow-hidden">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 items-stretch">
                {/* TEXT SIDE */}
                <div className="px-6 lg:px-16 py-20 flex flex-col justify-center relative z-10">
                    <div
                        className="text-[#C9A84C] mb-4 wcc-fade-in"
                        style={{
                            fontFamily: "'Source Sans 3', sans-serif",
                            fontWeight: 600,
                            fontSize: '12px',
                            letterSpacing: '0.15em',
                            animationDelay: '0.05s',
                        }}
                    >
                        WEST COAST CONFERENCE
                    </div>
                    <div
                        className="h-0.5 w-12 bg-[#C9A84C] mb-6 wcc-grow-in"
                        style={{ animationDelay: '0.2s' }}
                    />

                    <h1
                        className="text-white mb-3 wcc-fade-in"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(2.25rem, 4vw, 3rem)',
                            fontWeight: 700,
                            lineHeight: '1.1',
                            animationDelay: '0.15s',
                        }}
                    >
                        {district.name}
                    </h1>

                    {district.nickname && (
                        <p
                            className="text-[#C9A84C] italic mb-6 wcc-fade-in"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '1.15rem',
                                animationDelay: '0.25s',
                            }}
                        >
                            "{district.nickname}"
                        </p>
                    )}

                    {district.description && (
                        <p
                            className="text-white/80 mb-8 wcc-fade-in"
                            style={{ fontSize: '1.05rem', lineHeight: '1.7', animationDelay: '0.35s' }}
                        >
                            {district.description}
                        </p>
                    )}

                    {district.counties && district.counties.length > 0 && (
                        <div className="flex gap-2 flex-wrap wcc-fade-in" style={{ animationDelay: '0.45s' }}>
                            {district.counties.map((county) => (
                                <span
                                    key={county}
                                    className="wcc-chip bg-white/10 text-[#C9A84C] px-3 py-1.5 rounded-full text-sm border border-[#C9A84C]/30"
                                    style={{ fontWeight: 600 }}
                                >
                                    {county} County
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* IMAGE SIDE */}
                <div className="relative min-h-[360px] lg:min-h-0 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center wcc-img-reveal"
                        style={{ backgroundImage: `url(${heroUrl})` }}
                    />
                    {/* Horizontal fade into text side */}
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(90deg, rgba(10,31,68,0.45) 0%, rgba(10,31,68,0) 30%)' }}
                    />
                    {/* Bottom fade for depth, matches navy footer transitions elsewhere */}
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(180deg, rgba(10,31,68,0) 65%, rgba(10,31,68,0.5) 100%)' }}
                    />
                    {/* Thin gold edge separating image from text on desktop */}
                    <div
                        className="hidden lg:block absolute left-0 top-0 bottom-0 w-[2px]"
                        style={{ background: 'linear-gradient(180deg, transparent, #C9A84C55, transparent)' }}
                    />
                </div>
            </div>

            {/* Bottom divider into next section */}
            <svg
                className="absolute bottom-0 w-full"
                viewBox="0 0 1440 40"
                preserveAspectRatio="none"
                style={{ height: '40px' }}
            >
                <polygon points="0,40 1440,0 1440,40" fill="white" fillOpacity="0" />
            </svg>
        </section>
    );
}
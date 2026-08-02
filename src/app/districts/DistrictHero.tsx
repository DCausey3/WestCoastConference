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
        <section className="bg-[#0A1F44]">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 items-stretch">
                {/* TEXT SIDE */}
                <div className="px-6 lg:px-16 py-20 flex flex-col justify-center">
                    <div
                        className="text-[#C9A84C] mb-4"
                        style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: '12px', letterSpacing: '0.15em' }}
                    >
                        WEST COAST CONFERENCE
                    </div>
                    <div className="h-0.5 w-12 bg-[#C9A84C] mb-6"></div>

                    <h1 className="text-white mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 700, lineHeight: '1.1' }}>
                        {district.name}
                    </h1>

                    {district.nickname && (
                        <p className="text-[#C9A84C] italic mb-6" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem' }}>
                            "{district.nickname}"
                        </p>
                    )}

                    {district.description && (
                        <p className="text-white/80 mb-8" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                            {district.description}
                        </p>
                    )}

                    {district.counties && district.counties.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {district.counties.map((county) => (
                                <span
                                    key={county}
                                    className="bg-white/10 text-[#C9A84C] px-3 py-1.5 rounded-full text-sm border border-[#C9A84C]/30"
                                    style={{ fontWeight: 600 }}
                                >
                                    {county} County
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* IMAGE SIDE */}
                <div className="relative min-h-[360px] lg:min-h-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${heroUrl})` }}
                    />
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(90deg, rgba(10,31,68,0.35) 0%, rgba(10,31,68,0) 30%)' }}
                    />
                </div>
            </div>
        </section>
    );
}
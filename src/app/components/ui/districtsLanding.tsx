import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MapPin } from 'lucide-react';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { client } from '@/sanity/client';

type SanityDistrict = {
    _id: string;
    name: string;
    slug?: { current: string };
    nickname?: string;
    description?: string;
    counties?: string[];
    heroImage?: SanityImageSource;
};

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
    projectId && dataset
        ? createImageUrlBuilder({ projectId, dataset }).image(source)
        : null;

// The three districts are now static pages (app/districts/{slug}/page.tsx), so the
// slug -> route mapping is fixed here rather than computed from the Sanity name.
// This is keyed by the exact district name stored in Sanity so content edits in
// Studio (description, nickname, counties, etc.) still flow through automatically —
// only the URL and fallback hero image are hardcoded.
const SLUG_BY_NAME: Record<string, string> = {
    'Lakeland District': 'lakeland',
    'St. Petersburg District': 'stpete',
    'Tampa District': 'tampa',
};

const fallbackDistricts = [
    {
        id: 'lakeland',
        name: 'Lakeland District',
        nickname: 'The Lively Lakeland District',
        description: 'Serving AME churches in the central Florida region with a commitment to spiritual growth and community outreach.',
        counties: ['Polk', 'Hardee', 'Highlands'],
        heroImage: '/assets/districts/lakeland-hero.jpg',
    },
    {
        id: 'stpete',
        name: 'St. Petersburg District',
        nickname: 'The Sizzling Sweetie 16',
        description: 'Dedicated to strengthening our faith community along Florida\'s west coast through worship and service.',
        counties: ['Pinellas', 'Pasco', 'Hernando'],
        heroImage: '/assets/districts/stpete-hero.jpg',
    },
    {
        id: 'tampa',
        name: 'Tampa District',
        nickname: 'The Trending Tremendous Tampa District',
        description: 'Empowering congregations in the Tampa Bay area to grow in faith and serve their communities with purpose.',
        counties: ['Hillsborough', 'Manatee', 'Sarasota'],
        heroImage: '/assets/districts/tampa-hero.jpg',
    },
];

interface DistrictsLandingProps {
    districts?: SanityDistrict[];
}

export default function DistrictsLanding({ districts: sanityDistricts }: DistrictsLandingProps) {
    const districts = sanityDistricts?.length
        ? sanityDistricts
            .filter((d) => SLUG_BY_NAME[d.name]) // only render districts we have a static page for
            .map((d) => {
                const id = SLUG_BY_NAME[d.name];
                const fallback = fallbackDistricts.find((f) => f.id === id);
                const heroUrl = d.heroImage
                    ? urlFor(d.heroImage)?.width(800).height(450).url()
                    : fallback?.heroImage;
                return {
                    id,
                    name: d.name,
                    nickname: d.nickname || fallback?.nickname || '',
                    description: d.description || fallback?.description || '',
                    counties: d.counties?.length ? d.counties : fallback?.counties || [],
                    heroImage: heroUrl,
                };
            })
        : fallbackDistricts;

    return (
        <div className="py-20 px-6 bg-gradient-to-b from-white to-[#F4F6FA]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="text-[#C9A84C] mb-4" style={{
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontWeight: 600,
                        fontSize: '13px',
                        letterSpacing: '0.15em'
                    }}>
                        WEST COAST CONFERENCE
                    </div>
                    <h1 className="mb-6" style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '56px',
                        fontWeight: 700,
                        lineHeight: '1.1'
                    }}>
                        Three Districts, One Family
                    </h1>
                    <div className="h-1 w-24 bg-[#C9A84C] mx-auto mb-6"></div>
                    <p className="text-gray-600 max-w-3xl mx-auto" style={{ fontSize: '18px', lineHeight: '1.7' }}>
                        From Lakeland to St. Petersburg to Tampa, every district carries its own spirit and
                        story — but all are bound by the same call: to teach, to train, and to empower the
                        laity of the AME Church across Florida's west coast.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {districts.map((district) => (
                        <Link key={district.id} href={`/districts/${district.id}`} className="block group">
                            <Card className="h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border-2 border-gray-100 hover:border-[#C9A84C] bg-white rounded-xl overflow-hidden">
                                {district.heroImage ? (
                                    <div className="relative w-full" style={{ height: '180px' }}>
                                        <Image
                                            src={district.heroImage}
                                            alt={district.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div
                                            className="absolute inset-0"
                                            style={{ background: 'linear-gradient(180deg, rgba(10,31,68,0) 45%, rgba(10,31,68,0.85) 100%)' }}
                                        />
                                        {district.nickname && (
                                            <div className="absolute bottom-3 left-4 right-4">
                                                <p className="text-[#C9A84C] italic" style={{ fontSize: '13px', fontWeight: 600 }}>
                                                    "{district.nickname}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-2 bg-gradient-to-r from-[#C9A84C] to-[#d4b76a]"></div>
                                )}
                                <CardHeader className="pb-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-[#C9A84C]/10 rounded-lg group-hover:bg-[#C9A84C] group-hover:text-white transition-colors">
                                            <MapPin className="w-6 h-6 text-[#C9A84C] group-hover:text-white transition-colors" />
                                        </div>
                                        <CardTitle className="group-hover:text-[#C9A84C] transition-colors" style={{
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: '28px',
                                            fontWeight: 700
                                        }}>
                                            {district.name}
                                        </CardTitle>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed" style={{ fontSize: '15px', lineHeight: '1.7' }}>
                                        {district.description}
                                    </p>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <div className="mb-6">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-3" style={{ fontWeight: 600 }}>
                                            Counties Served
                                        </p>
                                        <div className="flex gap-2 flex-wrap">
                                            {district.counties.map((county) => (
                                                <span
                                                    key={county}
                                                    className="bg-[#E8EDF5] text-[#0A1F44] px-3 py-1.5 rounded-full text-sm transition-colors group-hover:bg-[#C9A84C] group-hover:text-white"
                                                    style={{ fontWeight: 600 }}
                                                >
                          {county}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex items-center text-[#C9A84C] font-semibold group-hover:gap-2 transition-all" style={{ fontSize: '15px' }}>
                                        <span>View District</span>
                                        <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
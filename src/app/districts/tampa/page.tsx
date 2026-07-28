import type { Metadata } from 'next';
import { client } from '@/sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { MapPin, Phone, Globe, Calendar } from 'lucide-react';

export const revalidate = 30;

const DISTRICT_QUERY = `*[_type == "district" && slug.current == "tampa"][0]{name, nickname, description, counties, heroImage}`;
const CHURCHES_QUERY = `*[_type == "church" && district == "Tampa District"] | order(name asc){name, address, city, state, zip, county, pastor, phone, website}`;
const EVENTS_QUERY = `*[_type == "event" && district == "Tampa District" && date >= now()] | order(date asc){_id, title, date, location, description}`;

type District = {
    name: string;
    nickname?: string;
    description?: string;
    counties?: string[];
    heroImage?: SanityImageSource;
};

type Church = {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    county?: string;
    pastor?: string;
    phone?: string;
    website?: string;
};

type DistrictEvent = {
    _id: string;
    title: string;
    date: string;
    location: string;
    description: string;
};

const fallbackDistrict: District = {
    name: 'Tampa District',
    nickname: 'The Trending Tremendous Tampa District',
    description: 'Empowering congregations in the Tampa Bay area to grow in faith and serve their communities with purpose.',
    counties: ['Hillsborough'],
};

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
    projectId && dataset
        ? createImageUrlBuilder({ projectId, dataset }).image(source)
        : null;

export const metadata: Metadata = {
    title: 'Tampa District | West Coast Conference Lay Organization',
    description: 'Explore the Tampa District of the West Coast Conference Lay Organization and the AME churches it serves.',
};

export default async function TampaDistrictPage() {
    const [district, churches, events]: [District | null, Church[], DistrictEvent[]] = await Promise.all([
        client.fetch(DISTRICT_QUERY, {}, { next: { revalidate: 30 } }),
        client.fetch(CHURCHES_QUERY, {}, { next: { revalidate: 30 } }),
        client.fetch(EVENTS_QUERY, {}, { next: { revalidate: 30 } }),
    ]);

    const info = district || fallbackDistrict;
    const heroUrl = info.heroImage
        ? urlFor(info.heroImage)?.width(1600).height(700).url()
        : '/assets/districts/tampa-hero.jpg';

    return (
        <div className="bg-white">
            {/* Page Header / Hero */}
            <section className="relative" style={{ minHeight: '480px' }}>
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${heroUrl})` }}
                />
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(180deg, rgba(10,31,68,0.75) 0%, rgba(10,31,68,0.92) 100%)' }}
                />
                <div className="relative max-w-7xl mx-auto px-6 py-24 text-center flex flex-col items-center justify-center" style={{ minHeight: '480px' }}>
                    <div
                        className="text-[#C9A84C] mb-4"
                        style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: '13px', letterSpacing: '0.15em' }}
                    >
                        WEST COAST CONFERENCE
                    </div>
                    <h1 className="text-white mb-3" style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 700 }}>
                        {info.name}
                    </h1>
                    {info.nickname && (
                        <p className="text-[#C9A84C] mb-6" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontStyle: 'italic' }}>
                            "{info.nickname}"
                        </p>
                    )}
                    {info.description && (
                        <p className="text-white/80 max-w-2xl mx-auto" style={{ fontSize: '1.125rem', lineHeight: '1.7' }}>
                            {info.description}
                        </p>
                    )}
                    {info.counties && info.counties.length > 0 && (
                        <div className="flex gap-2 flex-wrap justify-center mt-6">
                            {info.counties.map((county) => (
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
            </section>

            {/* Upcoming Events (only renders if there are current/future events) */}
            {events.length > 0 && (
                <section className="px-6 py-16 bg-[#F4F6FA]">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-10">
                            <div
                                className="text-[#C9A84C] mb-3"
                                style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: '12px', letterSpacing: '0.12em' }}
                            >
                                WHAT'S HAPPENING
                            </div>
                            <h2 className="text-[#0A1F44]" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700 }}>
                                Upcoming in the Tampa District
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {events.map((event) => {
                                const eventDate = new Date(event.date);
                                const dateLabel = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
                                const yearLabel = eventDate.getFullYear();

                                return (
                                    <div key={event._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                                        <div className="flex items-baseline gap-2 mb-3">
                                            <span className="text-[#C9A84C]" style={{ fontSize: '28px', fontWeight: 700 }}>{dateLabel}</span>
                                            <span className="text-gray-500" style={{ fontSize: '14px' }}>{yearLabel}</span>
                                        </div>
                                        <h3 className="text-[#0A1F44] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 600 }}>
                                            {event.title}
                                        </h3>
                                        <p className="text-[#C9A84C] mb-2 flex items-center gap-1.5" style={{ fontSize: '14px' }}>
                                            <Calendar className="w-4 h-4" />
                                            {event.location}
                                        </p>
                                        <p className="text-gray-700" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                            {event.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Churches List */}
            <section className="px-6 py-16">
                <div className="max-w-5xl mx-auto">
                    <h2
                        className="text-[#0A1F44] mb-8 text-center"
                        style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 600 }}
                    >
                        Churches in the Tampa District
                    </h2>

                    {churches.length === 0 ? (
                        <p className="text-gray-600 text-center">
                            Church listings for this district are being updated. Check back soon.
                        </p>
                    ) : (
                        <div className="grid gap-6">
                            {churches.map((c, idx) => (
                                <div
                                    key={idx}
                                    className="border-l-4 border-[#C9A84C] bg-gray-50 p-6 rounded-r-lg hover:shadow-lg transition-shadow"
                                >
                                    <h3
                                        className="text-[#0A1F44] mb-2"
                                        style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.375rem', fontWeight: 600 }}
                                    >
                                        {c.name}
                                    </h3>
                                    {c.pastor && (
                                        <p className="text-gray-700 text-sm mb-3">{c.pastor}</p>
                                    )}
                                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                                        {(c.address || c.city) && (
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4 text-[#C9A84C]" />
                                                {[c.address, c.city, c.state, c.zip].filter(Boolean).join(', ')}
                                            </span>
                                        )}
                                        {c.phone && (
                                            <span className="flex items-center gap-1.5">
                                                <Phone className="w-4 h-4 text-[#C9A84C]" />
                                                {c.phone}
                                            </span>
                                        )}
                                        {c.website && (
                                            <a
                                                href={c.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 text-[#0A1F44] hover:text-[#C9A84C] transition-colors"
                                            >
                                                <Globe className="w-4 h-4 text-[#C9A84C]" />
                                                Visit Website
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
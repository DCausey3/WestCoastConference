import { client } from '@/sanity/client';



// Only pull events whose date is today or later — past events drop off automatically
// as soon as their date passes, no manual cleanup needed in Studio.
const EVENTS_QUERY = `*[_type == "event" && date >= now()] | order(date asc){title, date, location, description}`;

type SanityEvent = {
    title: string;
    date: string; // ISO date string
    location: string;
    description: string;
};

function formatEventDate(date: string) {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default async function Events() {
    const sanityEvents: SanityEvent[] = await client.fetch(EVENTS_QUERY, {}, { next: { revalidate: 30 } });
    const events = sanityEvents.map((e) => ({ ...e, date: formatEventDate(e.date) }));

    return (
        <div className="bg-white">
            {/* Page Header */}
            <section className="bg-[#0A1F44] px-6 py-16">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-white mb-4" style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '3rem',
                        fontWeight: 700
                    }}>
                        Events & Programs
                    </h1>
                    <p className="text-[#C9A84C]" style={{ fontSize: '1.25rem' }}>
                        Join Us for Upcoming Events and Activities
                    </p>
                </div>
            </section>

            {/* Events List */}
            <section className="px-6 py-16">
                <div className="max-w-5xl mx-auto">
                    {events.length === 0 ? (
                        <div className="text-center py-16">
                            <svg className="w-16 h-16 mx-auto mb-6 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h2
                                className="text-[#0A1F44] mb-4"
                                style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 600 }}
                            >
                                Come back later!
                            </h2>
                            <p className="text-gray-600 max-w-md mx-auto">
                                We&apos;re preparing for our next big event and next year&apos;s calendar.
                                Check back soon for updates on our upcoming conference and programs.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {events.map((event, index) => (
                                <div key={index} className="border-l-4 border-[#C9A84C] bg-gray-50 p-6 rounded-r-lg hover:shadow-lg transition-shadow">
                                    <h3 className="text-[#0A1F44] mb-2" style={{
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: '1.75rem',
                                        fontWeight: 600
                                    }}>
                                        {event.title}
                                    </h3>
                                    <div className="flex gap-6 mb-3">
                                        <div className="text-[#C9A84C]">
                                            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {event.date}
                                        </div>
                                        <div className="text-[#C9A84C]">
                                            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {event.location}
                                        </div>
                                    </div>
                                    <p className="text-gray-700">
                                        {event.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
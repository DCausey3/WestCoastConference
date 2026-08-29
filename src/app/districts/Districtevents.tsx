import { Calendar } from 'lucide-react';
import type { DistrictEvent } from './Getdistrictfulldata';
import type { DistrictTheme } from './districtTheme';

interface DistrictEventsProps {
    events: DistrictEvent[];
    districtName: string;
    theme: DistrictTheme;
}

export default function DistrictEvents({ events, districtName, theme }: DistrictEventsProps) {
    return (
        <section className="px-6 py-20 bg-white">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <Calendar className="w-8 h-8 mx-auto mb-4" style={{ color: theme.accent }} />
                    <h2 style={{ color: theme.navy, fontFamily: "'Playfair Display', serif", fontSize: '2.25rem', fontWeight: 700 }}>
                        Upcoming in the {districtName}
                    </h2>
                </div>

                {events.length === 0 ? (
                    <div
                        className="text-center rounded-lg py-16 px-6"
                        style={{ background: theme.navySoft, border: `1px dashed ${theme.accent}66` }}
                    >
                        <p style={{ color: theme.navy, fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 600, marginBottom: '6px' }}>
                            Events Coming Soon
                        </p>
                        <p className="text-gray-600" style={{ fontSize: '14px', maxWidth: '380px', margin: '0 auto' }}>
                            Check back soon for upcoming {districtName} events, or reach out below if you have something to share.
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {events.map((event) => {
                            const eventDate = new Date(event.date);
                            const dateLabel = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
                            const yearLabel = eventDate.getFullYear();

                            return (
                                <div key={event._id} style={{ background: theme.navySoft, borderLeft: `4px solid ${theme.accent}` }} className="rounded-lg p-6">
                                    <div className="flex items-baseline gap-2 mb-3">
                                        <span style={{ color: theme.accent, fontSize: '28px', fontWeight: 700 }}>{dateLabel}</span>
                                        <span className="text-gray-500" style={{ fontSize: '14px' }}>{yearLabel}</span>
                                    </div>
                                    <h3 style={{ color: theme.navy, fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 600 }}>
                                        {event.title}
                                    </h3>
                                    <p className="text-gray-600 mb-2" style={{ fontSize: '14px' }}>{event.location}</p>
                                    <p className="text-gray-700" style={{ fontSize: '14px', lineHeight: '1.6' }}>{event.description}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
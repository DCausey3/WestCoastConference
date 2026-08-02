import { Calendar } from 'lucide-react';
import type { DistrictEvent } from './Getdistrictfulldata';

interface DistrictEventsProps {
    events: DistrictEvent[];
    districtName: string;
}

export default function DistrictEvents({ events, districtName }: DistrictEventsProps) {
    if (events.length === 0) return null;

    return (
        <section className="px-6 py-20 bg-white">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <Calendar className="w-8 h-8 mx-auto mb-4 text-[#C9A84C]" />
                    <h2 className="text-[#0A1F44]" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.25rem', fontWeight: 700 }}>
                        Upcoming in the {districtName}
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {events.map((event) => {
                        const eventDate = new Date(event.date);
                        const dateLabel = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
                        const yearLabel = eventDate.getFullYear();

                        return (
                            <div key={event._id} className="bg-[#F4F6FA] rounded-lg p-6" style={{ borderLeft: '4px solid #C9A84C' }}>
                                <div className="flex items-baseline gap-2 mb-3">
                                    <span className="text-[#C9A84C]" style={{ fontSize: '28px', fontWeight: 700 }}>{dateLabel}</span>
                                    <span className="text-gray-500" style={{ fontSize: '14px' }}>{yearLabel}</span>
                                </div>
                                <h3 className="text-[#0A1F44] mb-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', fontWeight: 600 }}>
                                    {event.title}
                                </h3>
                                <p className="text-gray-600 mb-2" style={{ fontSize: '14px' }}>{event.location}</p>
                                <p className="text-gray-700" style={{ fontSize: '14px', lineHeight: '1.6' }}>{event.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
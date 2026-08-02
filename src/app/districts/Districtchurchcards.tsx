import { MapPin, Phone, Globe } from 'lucide-react';
import type { Church } from './Getdistrictfulldata';

interface DistrictChurchCardsProps {
    churches: Church[];
    districtName: string;
}

export default function DistrictChurchCards({ churches, districtName }: DistrictChurchCardsProps) {
    return (
        <section className="px-6 py-20 bg-[#F4F6FA]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <div
                        className="text-[#C9A84C] mb-3"
                        style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: '12px', letterSpacing: '0.12em' }}
                    >
                        FIND A CHURCH
                    </div>
                    <h2 className="text-[#0A1F44]" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.25rem', fontWeight: 700 }}>
                        Churches in the {districtName}
                    </h2>
                </div>

                {churches.length === 0 ? (
                    <p className="text-gray-600 text-center">
                        Church listings for this district are being updated. Check back soon.
                    </p>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {churches.map((c, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-lg p-6 flex flex-col h-full"
                                style={{ boxShadow: '0 2px 12px rgba(10,31,68,0.06)', borderTop: '3px solid #C9A84C' }}
                            >
                                <h3
                                    className="text-[#0A1F44] mb-1"
                                    style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 600, lineHeight: '1.3' }}
                                >
                                    {c.name}
                                </h3>
                                {c.pastor && (
                                    <p className="text-gray-500 mb-4" style={{ fontSize: '13px' }}>{c.pastor}</p>
                                )}

                                <div className="flex-grow space-y-2 mb-4">
                                    {(c.address || c.city) && (
                                        <p className="flex items-start gap-2 text-gray-600" style={{ fontSize: '13px' }}>
                                            <MapPin className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                                            {[c.address, c.city, c.state, c.zip].filter(Boolean).join(', ')}
                                        </p>
                                    )}
                                    {c.phone && (
                                        <p className="flex items-center gap-2 text-gray-600" style={{ fontSize: '13px' }}>
                                            <Phone className="w-4 h-4 text-[#C9A84C] shrink-0" />
                                            {c.phone}
                                        </p>
                                    )}
                                </div>

                                {c.website ? (
                                    <a
                                        href={c.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 border-2 border-[#0A1F44] text-[#0A1F44] rounded py-2 hover:bg-[#0A1F44] hover:text-white transition-colors"
                                        style={{ fontSize: '13px', fontWeight: 600 }}
                                    >
                                        <Globe className="w-4 h-4" />
                                        Visit Website
                                    </a>
                                ) : (
                                    <div
                                        className="flex items-center justify-center border-2 border-gray-200 text-gray-400 rounded py-2"
                                        style={{ fontSize: '13px', fontWeight: 600 }}
                                    >
                                        Website Coming Soon
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
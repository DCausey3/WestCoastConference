import { Users } from 'lucide-react';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { client } from '@/sanity/client';
import type { Officer } from './Getdistrictfulldata';

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
    projectId && dataset
        ? createImageUrlBuilder({ projectId, dataset }).image(source)
        : null;

interface DistrictOfficersProps {
    officers: Officer[];
    districtName: string;
}

export default function DistrictOfficers({ officers, districtName }: DistrictOfficersProps) {
    if (officers.length === 0) return null;

    return (
        <section className="px-6 py-20 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-14">
                    <Users className="w-8 h-8 mx-auto mb-4 text-[#C9A84C]" />
                    <div
                        className="text-[#C9A84C] mb-3"
                        style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: '12px', letterSpacing: '0.12em' }}
                    >
                        LEADERSHIP
                    </div>
                    <h2 className="text-[#0A1F44]" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.25rem', fontWeight: 700 }}>
                        {districtName} Officers
                    </h2>
                </div>

                <div className="flex flex-wrap justify-center gap-x-10 gap-y-12">
                    {officers.map((officer) => {
                        const initials = officer.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
                        const photoUrl = officer.photo ? urlFor(officer.photo)?.width(240).height(240).url() : null;

                        return (
                            <div key={officer._id} className="text-center" style={{ width: '160px' }}>
                                <div
                                    className="mx-auto mb-4 rounded-full overflow-hidden border-4 border-[#F4F6FA]"
                                    style={{
                                        width: '140px',
                                        height: '140px',
                                        boxShadow: '0 4px 20px rgba(10,31,68,0.15)',
                                        backgroundColor: '#0A1F44',
                                    }}
                                >
                                    {photoUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={photoUrl} alt={officer.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-white" style={{ fontSize: '2rem', fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>
                                                {initials}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-[#0A1F44] mb-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 600 }}>
                                    {officer.name}
                                </h3>
                                <p className="text-[#C9A84C]" style={{ fontSize: '13px', fontWeight: 600 }}>{officer.title}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
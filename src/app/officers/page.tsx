import { client } from '@/sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { Users, Building2 } from 'lucide-react';

export const revalidate = 30;

const LEADERSHIP_QUERY = `*[_type == "leadershipPage"][0]`;
const OFFICERS_QUERY = `*[_type == "officer"] | order(order asc){name, title, category, district, photo}`;

type LeadershipPageData = {
    intro?: string;
    executiveBoardDescription?: string;
    localOrgsDescription?: string;
} | null;

type SanityOfficer = {
    name: string;
    title: string;
    category?: 'executive' | 'district' | 'program';
    district?: string;
    photo?: SanityImageSource;
};

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
    projectId && dataset
        ? createImageUrlBuilder({ projectId, dataset }).image(source)
        : null;

const fallbackExecutiveOfficers: SanityOfficer[] = [
    { name: "Lolita D. Brown", title: "President" },
    { name: "Alicia Dixon", title: "First Vice President" },
    { name: "Robbyn Hopewell", title: "Second Vice President" },
    { name: "G. Penny Demps", title: "Third Vice President" },
    { name: "MacArthur Carpenter", title: "Treasurer" },
    { name: "LaTanya Edwards", title: "Financial Secretary" },
    { name: "Emma McGriff", title: "Recording Secretary" },
    { name: "Carolyn Major-Harper", title: "Assistant Recording Secretary" },
    { name: "Amarah Scott", title: "Corresponding Secretary" },
];

const fallbackDistrictPresidents: SanityOfficer[] = [
    { name: "Emily Davis", title: "Lakeland District President", district: "Lakeland District" },
    { name: "Linnell Baker", title: "St. Petersburg District President", district: "St. Petersburg District" },
    { name: "Sandra Mitchell", title: "Tampa District President", district: "Tampa District" },
];

const OfficerCard = ({ name, title, photo }: SanityOfficer) => {
    const initials = name.split(' ')
        .filter((word) => word !== 'TBA')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const colors = ['#0A1F44', '#1a3a5e', '#2a4a6e', '#3a5a7e'];
    const colorIndex = name.length % colors.length;
    const bgColor = colors[colorIndex];
    const photoUrl = photo ? urlFor(photo)?.width(400).height(533).url() : null;

    return (
        <div className="text-center group">
            <div className="rounded-lg mb-4 overflow-hidden relative" style={{ aspectRatio: '3/4', backgroundColor: bgColor }}>
                {photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white" style={{ fontSize: '4rem', fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>
                            {name === 'TBA' ? '?' : initials}
                        </span>
                    </div>
                )}
            </div>
            <h3 className="text-[#0A1F44] mb-1" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.25rem',
                fontWeight: 600
            }}>
                {name}
            </h3>
            <p className="text-[#C9A84C]" style={{ fontSize: '0.875rem' }}>
                {title}
            </p>
        </div>
    );
};

export default async function Leadership() {
    const [leadership, sanityOfficers]: [LeadershipPageData, SanityOfficer[]] = await Promise.all([
        client.fetch(LEADERSHIP_QUERY, {}, { next: { revalidate: 30 } }),
        client.fetch(OFFICERS_QUERY, {}, { next: { revalidate: 30 } }),
    ]);

    const intro = leadership?.intro ||
        `The West Coast Conference Lay Organization operates under a structured leadership model designed to effectively serve our 56 local lay organizations across three districts — from the Executive Board setting conference-wide direction, to district presidents leading locally, to the local organizations doing the work in their own communities.`;

    const executiveBoardDescription = leadership?.executiveBoardDescription ||
        `The Executive Board provides strategic direction and oversight for the entire conference, ensuring alignment with our mission of teaching, training, and empowering the laity.`;

    const localOrgsDescription = leadership?.localOrgsDescription ||
        `Our 56 local lay organizations serve individual churches and communities, implementing programs and initiatives that support spiritual growth and community engagement.`;

    const executiveOfficers = sanityOfficers?.length
        ? sanityOfficers.filter((o) => (!o.category || o.category === 'executive') && !o.district)
        : fallbackExecutiveOfficers;

    const districtPresidents = sanityOfficers?.length
        ? sanityOfficers.filter((o) => o.category === 'executive' && o.district)
        : fallbackDistrictPresidents;

    return (
        <div className="bg-white">
            {/* Page Header */}
            <section className="bg-[#0A1F44] px-6 py-16">
                <div className="max-w-7xl mx-auto text-center">
                    <div
                        className="text-[#C9A84C] mb-4"
                        style={{ fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: '12px', letterSpacing: '0.15em' }}
                    >
                        WEST COAST CONFERENCE
                    </div>
                    <h1 className="text-white mb-4" style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '3rem',
                        fontWeight: 700
                    }}>
                        Leadership
                    </h1>
                    <p className="text-[#C9A84C] max-w-2xl mx-auto" style={{ fontSize: '1.15rem', lineHeight: '1.6' }}>
                        {intro}
                    </p>
                </div>
            </section>

            {/* Executive Officers */}
            <section className="px-6 py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-4">
                        <Users className="w-8 h-8 mx-auto mb-4 text-[#C9A84C]" />
                        <h2 className="text-[#0A1F44] mb-3" style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '2.5rem',
                            fontWeight: 700
                        }}>
                            Executive Board
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mb-12" style={{ fontSize: '1rem', lineHeight: '1.7' }}>
                            {executiveBoardDescription}
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {executiveOfficers.map((officer, idx) => (
                            <OfficerCard key={idx} {...officer} />
                        ))}
                    </div>
                </div>
            </section>

            {/* District Presidents */}
            <section className="px-6 py-20 bg-[#F4F6FA]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-4">
                        <Building2 className="w-8 h-8 mx-auto mb-4 text-[#C9A84C]" />
                        <h2 className="text-[#0A1F44] mb-3" style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '2.5rem',
                            fontWeight: 700
                        }}>
                            District Presidents
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto mb-12" style={{ fontSize: '1rem', lineHeight: '1.7' }}>
                            Each of our three districts is led by a dedicated president who coordinates activities and
                            supports local lay organizations within their district.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {districtPresidents.map((officer, idx) => (
                            <OfficerCard key={idx} {...officer} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Local Lay Organizations + CTA */}
            <section className="px-6 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-[#0A1F44] mb-4" style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '2rem',
                        fontWeight: 600
                    }}>
                        56 Local Lay Organizations
                    </h2>
                    <p className="text-gray-700 mb-12 max-w-2xl mx-auto" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                        {localOrgsDescription}
                    </p>

                    <div className="bg-[#F4F6FA] p-8 rounded-lg">
                        <h3 className="text-[#0A1F44] mb-4" style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '1.5rem',
                            fontWeight: 600
                        }}>
                            Want to Get Involved?
                        </h3>
                        <p className="text-gray-700 mb-6 max-w-xl mx-auto">
                            We welcome dedicated individuals who feel called to serve in leadership positions within the lay
                            organization. Contact us to learn about opportunities to serve.
                        </p>
                        <a href="/contact" className="inline-block bg-[#C9A84C] text-[#0A1F44] px-8 py-3 rounded hover:bg-[#d4b76a] transition-colors uppercase tracking-wider" style={{ fontSize: '14px', fontWeight: 600 }}>
                            Contact Us
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
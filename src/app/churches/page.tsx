import { client } from '@/sanity/client';
import ChurchesClient, { type Church } from '@/app/components/ui/ChurchesClient';



// NOTE: requires a `church` document type in Sanity Studio with fields matching
// the Church interface below (name, address, city, state, zip, county, district,
// pastor, phone, website).
const CHURCHES_QUERY = `*[_type == "church"] | order(name asc)`;

const fallbackChurches: Church[] = [
    {
        name: "Sample AME Church - Tampa",
        address: "123 Main Street",
        city: "Tampa",
        state: "FL",
        zip: "33601",
        county: "Hillsborough",
        district: "Tampa District",
        pastor: "Rev. John Smith",
        phone: "(813) 555-0100",
        website: "https://example.com"
    },
    {
        name: "Sample AME Church - St. Petersburg",
        address: "456 Oak Avenue",
        city: "St. Petersburg",
        state: "FL",
        zip: "33701",
        county: "Pinellas",
        district: "St. Petersburg District",
        pastor: "Rev. Jane Doe",
        phone: "(727) 555-0200"
    },
    {
        name: "Sample AME Church - Lakeland",
        address: "789 Pine Road",
        city: "Lakeland",
        state: "FL",
        zip: "33801",
        county: "Polk",
        district: "Lakeland District",
        pastor: "Rev. Robert Johnson",
        phone: "(863) 555-0300",
        website: "https://example.com"
    }
];

export default async function Churches() {
    const sanityChurches: Church[] = await client.fetch(CHURCHES_QUERY, {}, { next: { revalidate: 30 } });
    const churches = sanityChurches?.length ? sanityChurches : fallbackChurches;

    const districts = Array.from(new Set(churches.map((c) => c.district))).sort();
    const counties = Array.from(new Set(churches.map((c) => c.county))).sort();

    return (
        <div className="bg-white">
            {/* Page Header */}
            <section className="bg-[#0A1F44] relative overflow-hidden px-6 py-20">
                {/* Ambient glow layer, matching homepage hero */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="wcc-glow wcc-glow-1" />
                    <div className="wcc-glow wcc-glow-2" />
                    <div
                        className="absolute inset-0 opacity-[0.04]"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)',
                            backgroundSize: '28px 28px',
                        }}
                    />
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div
                        className="text-[#C9A84C] mb-3 wcc-fade-in"
                        style={{
                            fontFamily: "'Source Sans 3', sans-serif",
                            fontWeight: 600,
                            fontSize: '12px',
                            letterSpacing: '0.12em',
                            animationDelay: '0.05s',
                        }}
                    >
                        11TH EPISCOPAL DISTRICT | WEST COAST CONFERENCE
                    </div>
                    <div
                        className="h-0.5 w-12 bg-[#C9A84C] mx-auto mb-6 wcc-grow-in"
                        style={{ animationDelay: '0.2s' }}
                    />

                    <h1
                        className="text-white mb-4 wcc-fade-in"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                            fontWeight: 700,
                            animationDelay: '0.15s',
                        }}
                    >
                        Find a Church Near You
                    </h1>
                    <p
                        className="text-[#C9A84C] mb-10 wcc-fade-in"
                        style={{ fontSize: '1.25rem', animationDelay: '0.3s' }}
                    >
                        Find AME Churches Across the West Coast Conference
                    </p>

                    {/* Quick stats strip */}
                    <div
                        className="flex flex-wrap justify-center gap-6 md:gap-10 wcc-fade-in"
                        style={{ animationDelay: '0.45s' }}
                    >
                        {[
                            { value: churches.length, label: 'Churches' },
                            { value: districts.length, label: 'Districts' },
                            { value: counties.length, label: 'Counties' },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-lg px-6 py-4 min-w-[120px]"
                                style={{
                                    background: 'rgba(201,168,76,0.08)',
                                    border: '1px solid rgba(201,168,76,0.3)',
                                }}
                            >
                                <div
                                    className="text-white"
                                    style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700 }}
                                >
                                    {stat.value}
                                </div>
                                <div
                                    className="text-[#C9A84C] uppercase tracking-wider"
                                    style={{ fontSize: '11px', fontWeight: 600, marginTop: '2px' }}
                                >
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Diagonal divider matching homepage hero */}
                <svg
                    className="absolute bottom-0 w-full"
                    viewBox="0 0 1440 60"
                    preserveAspectRatio="none"
                    style={{ height: '60px' }}
                >
                    <polygon points="0,60 1440,0 1440,60" fill="white" />
                </svg>

                <style>{`
          .wcc-glow {
            position: absolute;
            border-radius: 9999px;
            filter: blur(90px);
            opacity: 0.18;
          }
          .wcc-glow-1 {
            width: 420px;
            height: 420px;
            top: -140px;
            left: -80px;
            background: #C9A84C;
            animation: wccDrift1 14s ease-in-out infinite;
          }
          .wcc-glow-2 {
            width: 360px;
            height: 360px;
            bottom: -120px;
            right: -60px;
            background: #3a5a8e;
            animation: wccDrift2 16s ease-in-out infinite;
          }
          @keyframes wccDrift1 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(30px, 20px); }
          }
          @keyframes wccDrift2 {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(-25px, -15px); }
          }
          .wcc-fade-in {
            opacity: 0;
            animation: wccFadeIn 0.7s ease-out forwards;
          }
          @keyframes wccFadeIn {
            from { opacity: 0; transform: translateY(14px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .wcc-grow-in {
            transform: scaleX(0);
            transform-origin: center;
            animation: wccGrowIn 0.5s ease-out forwards;
          }
          @keyframes wccGrowIn {
            to { transform: scaleX(1); }
          }
          @media (prefers-reduced-motion: reduce) {
            .wcc-glow, .wcc-fade-in, .wcc-grow-in {
              animation: none !important;
              opacity: 1 !important;
              transform: none !important;
            }
          }
        `}</style>
            </section>

            <ChurchesClient churches={churches} districts={districts} counties={counties} />

            {/* Info Section */}
            <section className="bg-[#0A1F44] px-6 py-16 relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div
                        className="text-[#C9A84C] mb-3"
                        style={{
                            fontFamily: "'Source Sans 3', sans-serif",
                            fontWeight: 600,
                            fontSize: '12px',
                            letterSpacing: '0.12em',
                        }}
                    >
                        HELP US KEEP THIS ACCURATE
                    </div>
                    <h2 className="text-white mb-4" style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '2rem',
                        fontWeight: 600
                    }}>
                        Is Your Church Information Incorrect?
                    </h2>
                    <p className="text-white/80 mb-6">
                        If you notice any incorrect information about your church or would like to add your church to our directory, please contact us.
                    </p>

                    <a href="/contact"
                    className="inline-block bg-[#C9A84C] text-[#0A1F44] px-8 py-3 rounded hover:bg-[#d4b76a] hover:shadow-[0_6px_24px_rgba(201,168,76,0.45)] hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-wider"
                    style={{ fontSize: '14px', fontWeight: 600 }}
                    >
                    Contact Us
                </a>
        </div>
</section>
</div>
);
}
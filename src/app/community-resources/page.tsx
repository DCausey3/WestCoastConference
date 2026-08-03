import { client } from '@/sanity/client';
import Link from 'next/link';
import { Phone, ExternalLink, HeartHandshake, AlertCircle, Church } from 'lucide-react';

export const revalidate = 30;

const COMMUNITY_RESOURCES_QUERY = `*[_type == "communityResourceCategory"] | order(order asc){category, items}`;

type ResourceItem = { title: string; description?: string; phone?: string; url?: string };
type ResourceCategory = { category: string; items: ResourceItem[] };

// Verified as of this writing — these organizations' contact info can change,
// so this is meant to be maintained in Studio going forward, not left as a
// permanent hardcoded fallback.
const fallbackResources: ResourceCategory[] = [
    {
        category: 'Crisis & Immediate Help',
        items: [
            {
                title: '211 / First Contact',
                description: 'Free, 24/7 crisis line and referral service for the Tampa Bay area — food, rent, utilities, shelter, counseling, and more. Interpretation available in 150+ languages.',
                phone: 'Dial 211',
                url: 'https://www.firstcontact.org',
            },
            {
                title: '988 Suicide & Crisis Lifeline',
                description: 'Free, confidential support for anyone in emotional distress or suicidal crisis, available 24/7.',
                phone: 'Dial 988',
                url: 'https://988lifeline.org',
            },
        ],
    },
    {
        category: 'Food Assistance',
        items: [
            {
                title: 'Feeding Tampa Bay',
                description: 'Mobile food pantries, low-cost grocery markets, SNAP application help, and job training programs across Hillsborough, Pinellas, Polk, and the wider Tampa Bay region.',
                phone: '(813) 254-1190',
                url: 'https://www.feedingtampabay.org',
            },
        ],
    },
    {
        category: 'Economic & Education Support',
        items: [
            {
                title: 'Urban League of Hillsborough County',
                description: 'Focused specifically on economic equity for the African American community — job training, education support, entrepreneurship, and housing assistance.',
                phone: '(813) 892-8528',
                url: 'https://ulhc.org',
            },
        ],
    },
    {
        category: 'Find More Local Resources',
        items: [
            {
                title: 'findhelp.org',
                description: 'A free, searchable directory of thousands of local social service programs — housing, healthcare, legal aid, utilities, and more — by zip code.',
                url: 'https://www.findhelp.org',
            },
        ],
    },
];

export default async function CommunityResources() {
    const sanityResources: ResourceCategory[] = await client.fetch(COMMUNITY_RESOURCES_QUERY, {}, { next: { revalidate: 30 } });
    const resources = sanityResources?.length ? sanityResources : fallbackResources;

    return (
        <div className="bg-white">
            {/* Page Header */}
            <section className="bg-[#0A1F44] px-6 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <HeartHandshake className="w-8 h-8 mx-auto mb-4 text-[#C9A84C]" />
                    <h1 className="text-white mb-4" style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '3rem',
                        fontWeight: 700
                    }}>
                        Community Resources
                    </h1>
                    <p className="text-white/80" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                        As lay persons working with God, we believe serving our neighbors is part of our calling.
                        Whether you're facing a hard season or just want to know what help exists nearby, here are
                        trusted places across the Tampa Bay area to turn to.
                    </p>
                </div>
            </section>

            {/* Resource categories */}
            <section className="px-6 py-20">
                <div className="max-w-5xl mx-auto space-y-14">
                    {resources.map((category, idx) => (
                        <div key={idx}>
                            <h2 className="text-[#0A1F44] mb-6 pb-3 border-b-2 border-[#C9A84C]" style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '1.6rem',
                                fontWeight: 600
                            }}>
                                {category.category}
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {category.items.map((item, itemIdx) => (
                                    <div
                                        key={itemIdx}
                                        className="bg-[#F4F6FA] rounded-lg p-6"
                                        style={{ borderLeft: '4px solid #C9A84C' }}
                                    >
                                        <h3 className="text-[#0A1F44] mb-2" style={{
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: '1.15rem',
                                            fontWeight: 600
                                        }}>
                                            {item.title}
                                        </h3>
                                        {item.description && (
                                            <p className="text-gray-600 mb-4" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                                {item.description}
                                            </p>
                                        )}
                                        <div className="flex flex-wrap gap-4">
                                            {item.phone && (
                                                <span className="flex items-center gap-1.5 text-[#0A1F44]" style={{ fontSize: '13px', fontWeight: 600 }}>
                                                    <Phone className="w-3.5 h-3.5 text-[#C9A84C]" />
                                                    {item.phone}
                                                </span>
                                            )}
                                            {item.url && (
                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 text-[#0A1F44] hover:text-[#C9A84C] transition-colors"
                                                    style={{ fontSize: '13px', fontWeight: 600 }}
                                                >
                                                    Visit Website
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-5">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-amber-800" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                            These are independent organizations, not operated by the West Coast Conference Lay
                            Organization. Hours, eligibility, and services can change — please call ahead or check
                            each organization's website before visiting.
                        </p>
                    </div>
                </div>
            </section>

            {/* Find a church home CTA */}
            <section className="px-6 pb-20">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-[#0A1F44] rounded-xl p-10 text-center">
                        <Church className="w-8 h-8 mx-auto mb-4 text-[#C9A84C]" />
                        <h2 className="text-white mb-4" style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '2rem',
                            fontWeight: 700
                        }}>
                            Looking for a Church Home?
                        </h2>
                        <p className="text-white/80 mb-8 max-w-xl mx-auto" style={{ fontSize: '1rem', lineHeight: '1.7' }}>
                            Beyond meeting practical needs, we'd love to welcome you into a community of faith. Find
                            an AME church near you across the Lakeland, St. Petersburg, and Tampa Districts.
                        </p>
                        <Link
                            href="/churches"
                            className="inline-block bg-[#C9A84C] text-[#0A1F44] px-8 py-3 rounded hover:bg-[#d4b76a] transition-colors uppercase tracking-wider"
                            style={{ fontSize: '14px', fontWeight: 600 }}
                        >
                            Find a Church Near You
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
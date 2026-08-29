import { client } from '@/sanity/client';
import Link from 'next/link';
import { BookOpen, ExternalLink, HeartHandshake } from 'lucide-react';

export const revalidate = 30;

const RESOURCES_QUERY = `*[_type == "resourceCategory"] | order(order asc){category, items}`;

type ResourceItem = { title: string; type: string; url?: string };
type ResourceCategory = { category: string; items: ResourceItem[] };

const TYPE_CONFIG: Record<string, { icon: any; color: string }> = {
    PDF: { icon: ExternalLink, color: '#C9584C' },
    Video: { icon: ExternalLink, color: '#4C7FC9' },
    Slides: { icon: ExternalLink, color: '#C9A84C' },
    Form: { icon: ExternalLink, color: '#4CA870' },
    Document: { icon: ExternalLink, color: '#8A6FC9' },
};

function getTypeConfig(type: string) {
    return TYPE_CONFIG[type] || { icon: ExternalLink, color: '#6b7280' };
}

export default async function Resources() {
    const sanityResources: ResourceCategory[] = await client.fetch(RESOURCES_QUERY, {}, { next: { revalidate: 30 } });

    // Only show categories that have at least one item with a real, working link.
    // This keeps the page honest — no dead "#" links or fake placeholder cards.
    const resources = (sanityResources ?? []).filter(
        (category) => category.items?.some((item) => Boolean(item.url))
    );

    return (
        <div className="bg-white">
            {/* Page Header */}
            <section className="bg-[#0A1F44] px-6 py-16">
                <div className="max-w-7xl mx-auto text-center">
                    <BookOpen className="w-8 h-8 mx-auto mb-4 text-[#C9A84C]" />
                    <h1 className="text-white mb-4" style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '3rem',
                        fontWeight: 700
                    }}>
                        Resources
                    </h1>
                    <p className="text-[#C9A84C]" style={{ fontSize: '1.25rem' }}>
                        Tools and Materials for Lay Organization Members
                    </p>
                </div>
            </section>

            {/* Resources Grid — only renders if there's real, working content */}
            <section className="px-6 py-20">
                <div className="max-w-6xl mx-auto">
                    {resources.length > 0 && (
                        <div className="grid md:grid-cols-3 gap-8 mb-16">
                            {resources.map((category, idx) => {
                                const linkedItems = category.items.filter((item) => Boolean(item.url));
                                return (
                                    <div key={idx} className="bg-[#F4F6FA] rounded-xl p-6" style={{ borderTop: '3px solid #C9A84C' }}>
                                        <h2 className="text-[#0A1F44] mb-6 pb-4 border-b border-gray-200" style={{
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: '1.4rem',
                                            fontWeight: 600
                                        }}>
                                            {category.category}
                                        </h2>
                                        <ul className="space-y-3">
                                            {linkedItems.map((item, itemIdx) => {
                                                const { icon: Icon, color } = getTypeConfig(item.type);
                                                return (
                                                    <li key={itemIdx}>

                                                      <a  href={item.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-3 p-3 bg-white rounded-lg transition-colors group hover:bg-[#0A1F44] cursor-pointer"
                                                        >
                                                        <div
                                                            className="rounded-md flex items-center justify-center shrink-0"
                                                            style={{ width: '36px', height: '36px', backgroundColor: `${color}1A` }}
                                                        >
                                                            <Icon className="w-4 h-4" style={{ color }} />
                                                        </div>
                                                        <span className="text-gray-700 group-hover:text-white flex-1" style={{ fontSize: '14px', fontWeight: 500 }}>
                                                                {item.title}
                                                            </span>
                                                        <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#C9A84C] shrink-0" />
                                                    </a>
                                            </li>
                                            );
                                            })}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Community Resources banner — kept, this works */}
                    <Link href="/community-resources" className="block">
                        <div className="bg-[#F4F6FA] rounded-lg p-8 flex flex-col md:flex-row items-center gap-6 hover:bg-[#E8EDF5] transition-colors" style={{ borderLeft: '4px solid #C9A84C' }}>
                            <HeartHandshake className="w-10 h-10 text-[#C9A84C] shrink-0" />
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-[#0A1F44] mb-1" style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: '1.25rem',
                                    fontWeight: 600
                                }}>
                                    Know Someone in Need?
                                </h3>
                                <p className="text-gray-600" style={{ fontSize: '14px' }}>
                                    Explore trusted Tampa Bay area resources for food, housing, and economic support.
                                </p>
                            </div>
                            <span className="text-[#C9A84C] shrink-0" style={{ fontSize: '14px', fontWeight: 600 }}>
                                View Community Resources →
                            </span>
                        </div>
                    </Link>

                    {/* Contact CTA — kept, this works */}
                    <div className="mt-16 bg-[#0A1F44] rounded-lg p-10 text-center">
                        <h2 className="text-white mb-4" style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '2rem',
                            fontWeight: 600
                        }}>
                            Need Additional Resources?
                        </h2>
                        <p className="text-white/80 mb-6 max-w-xl mx-auto">
                            Contact your district representative or reach out to the conference office for more information.
                        </p>

                       <a  href="/contact"
                        className="inline-block bg-[#C9A84C] text-[#0A1F44] px-8 py-3 rounded hover:bg-[#d4b76a] transition-colors uppercase tracking-wider"
                        style={{ fontSize: '14px', fontWeight: 600 }}
                        >
                        Contact Us
                    </a>
                </div>
        </div>
</section>
</div>
);
}
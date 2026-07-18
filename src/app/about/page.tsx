import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { client } from '@/sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

export const revalidate = 30;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
    projectId && dataset
        ? createImageUrlBuilder({ projectId, dataset }).image(source)
        : null;

const ABOUT_QUERY = `*[_type == "aboutPage"][0]`;
const SETTINGS_QUERY = `*[_type == "siteSettings"][0]`;
const DISTRICTS_QUERY = `*[_type == "district"] | order(order asc){name}`;

type AboutPageData = {
    seoTitle?: string;
    seoDescription?: string;
    heading?: string;
    subheading?: string;
    congregationPhoto?: SanityImageSource & { alt?: string };
    overviewParagraphs?: string[];
    coreValues?: { title: string; description: string }[];
};

const subsections = [
    {
        title: 'Mission & Vision',
        description: 'Our purpose and guiding principles',
        link: '/about/mission',
        icon: '🎯',
    },
    {
        title: 'Our History',
        description: 'A legacy of faith since 1816',
        link: '/about/history',
        icon: '📜',
    },
    {
        title: 'Leadership Structure',
        description: 'How we organize to serve effectively',
        link: '/about/leadership',
        icon: '⚙️',
    },
    {
        title: 'Constitution & ByLaws',
        description: 'Our governing documents and guidelines',
        link: '/about/constitution-bylaws',
        icon: '📋',
    },
];

export async function generateMetadata(): Promise<Metadata> {
    const about: AboutPageData = await client.fetch(ABOUT_QUERY);

    const title = about?.seoTitle || 'About WCCLO | West Coast Conference Lay Organization';
    const description =
        about?.seoDescription ||
        'Learn about the West Coast Conference Lay Organization (WCCLO), the teaching, training, and empowering body for the laity of the West Coast Conference in the 11th Episcopal District of the AME Church.';
    const imageUrl = about?.congregationPhoto
        ? urlFor(about.congregationPhoto)?.width(1200).height(630).url()
        : undefined;

    return {
        title,
        description,
        keywords: [
            'WCCLO',
            'West Coast Conference Lay Organization',
            'AME Church',
            'African Methodist Episcopal Church',
            '11th Episcopal District',
            'Florida AME',
            'Lay Organization',
        ],
        openGraph: {
            title,
            description,
            type: 'website',
            url: 'https://main.d20ve942ylnzi2.amplifyapp.com/about',
            images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: about?.congregationPhoto?.alt || 'WCCLO Congregation' }] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: imageUrl ? [imageUrl] : undefined,
        },
        alternates: {
            canonical: '/about',
        },
    };
}

export default async function About() {
    const [about, settings, districts]: [AboutPageData, any, { name: string }[]] = await Promise.all([
        client.fetch(ABOUT_QUERY),
        client.fetch(SETTINGS_QUERY),
        client.fetch(DISTRICTS_QUERY),
    ]);

    const heading = about?.heading || 'About WCCLO';
    const subheading = about?.subheading || 'Serving the AME Church Community Across Florida';
    const photoUrl = about?.congregationPhoto
        ? urlFor(about.congregationPhoto)?.width(1600).height(900).url()
        : '/assets/GoupPhoto.png';
    const photoAlt = about?.congregationPhoto?.alt || 'WCCLO Congregation Members';

    const localLayOrgsCount = settings?.localLayOrgsCount ?? 56;
    const districtsCount = settings?.districtsCount ?? districts.length;
    const districtNames = districts.map((d) => d.name.replace(' District', '')).join(', ');

    const overviewParagraphs = about?.overviewParagraphs?.length
        ? about.overviewParagraphs
        : [
            `The West Coast Conference Lay Organization (WCCLO) serves as the teaching, training and empowering body for the laity of the West Coast Conference in the 11th Episcopal District of the African Methodist Episcopal Church.`,
            `Comprised of ${localLayOrgsCount} local lay organizations from churches in ${districtsCount} Districts of the Annual Conference (${districtNames}), the WCCLO strives to provide dynamic training opportunities to its members, scholarship opportunities to our youth and fellowship opportunities to all believers in Christ.`,
        ];

    const coreValues = about?.coreValues?.length
        ? about.coreValues
        : [
            {
                title: 'Teaching',
                description: 'Educating and equipping members with knowledge and understanding',
            },
            {
                title: 'Training',
                description: 'Developing skills and abilities for effective ministry and service',
            },
            {
                title: 'Empowering',
                description: 'Enabling members to lead and serve with confidence and purpose',
            },
        ];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NonprofitOrganization',
        name: 'West Coast Conference Lay Organization',
        alternateName: 'WCCLO',
        description: overviewParagraphs.join(' '),
        parentOrganization: {
            '@type': 'Organization',
            name: 'African Methodist Episcopal Church, 11th Episcopal District',
        },
        areaServed: {
            '@type': 'State',
            name: 'Florida',
        },
        foundingDate: '1816',
    };

    return (
        <div className="bg-white">
            {/* JSON-LD structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Page Header */}
            <section className="bg-[#0A1F44] px-6 py-16">
                <div className="max-w-7xl mx-auto text-center">
                    <h1
                        className="text-white mb-4"
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '3rem',
                            fontWeight: 700,
                        }}
                    >
                        {heading}
                    </h1>
                    <p className="text-[#C9A84C]" style={{ fontSize: '1.25rem' }}>
                        {subheading}
                    </p>
                </div>
            </section>

            {/* Overview Section */}
            <section className="px-6 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-12">
                        <h2
                            className="text-[#0A1F44] mb-6 text-center"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '2rem',
                                fontWeight: 600,
                            }}
                        >
                            Who We Are
                        </h2>

                        {/* Congregation Photo */}
                        {/* Congregation Photo */}
                        <div className="mb-6 rounded-lg overflow-hidden relative" style={{ height: '400px' }}>
                            <Image
                                src={photoUrl!}
                                alt={photoAlt}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        {overviewParagraphs.map((paragraph, idx) => (
                            <p
                                key={idx}
                                className={idx === 0 ? 'text-gray-700 mb-4' : 'text-gray-700'}
                                style={{ fontSize: '1.125rem', lineHeight: '1.8' }}
                            >
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    {/* Subsections Navigation */}
                    <nav className="mb-12" aria-label="About WCCLO subsections">
                        <h2
                            className="text-[#0A1F44] mb-6 text-center"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '2rem',
                                fontWeight: 600,
                            }}
                        >
                            Learn More About Us
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {subsections.map((section, idx) => (
                                <Link
                                    key={idx}
                                    href={section.link}
                                    className="block bg-[#F4F6FA] p-6 rounded-lg hover:bg-[#0A1F44] hover:text-white transition-all group"
                                >
                                    <div className="text-4xl mb-3" aria-hidden="true">{section.icon}</div>
                                    <h3
                                        className="text-[#0A1F44] group-hover:text-white mb-2"
                                        style={{
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: '1.5rem',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {section.title}
                                    </h3>
                                    <p className="text-gray-600 group-hover:text-white/80">
                                        {section.description}
                                    </p>
                                    <div className="mt-4 text-[#C9A84C] group-hover:text-white flex items-center gap-2">
                                        Learn more
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </nav>

                    {/* Values */}
                    <div>
                        <h2
                            className="text-[#0A1F44] mb-6 text-center"
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '2rem',
                                fontWeight: 600,
                            }}
                        >
                            Our Core Values
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {coreValues.map((value, idx) => (
                                <div key={idx} className="bg-[#0A1F44] p-6 rounded-lg text-center">
                                    <h3
                                        className="text-[#C9A84C] mb-2"
                                        style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem' }}
                                    >
                                        {value.title}
                                    </h3>
                                    <p className="text-white/80 text-sm">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
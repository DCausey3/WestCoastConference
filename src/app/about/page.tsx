import Link from 'next/link';
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

type SiteSettings = { localLayOrgsCount?: number; districtsCount?: number };

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
    { title: 'Mission & Vision', description: 'Our purpose and guiding principles', link: '/about/mission' },
    { title: 'Our History', description: 'A legacy of faith since 1816', link: '/about/history' },
    { title: 'Leadership Structure', description: 'How we organize to serve effectively', link: '/officers' },
    { title: 'Constitution & Bylaws', description: 'Our governing documents and guidelines', link: '/about/constitution-bylaws' },
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
        keywords: ['WCCLO', 'West Coast Conference Lay Organization', 'AME Church', 'African Methodist Episcopal Church', '11th Episcopal District', 'Florida AME', 'Lay Organization'],
        openGraph: {
            title, description, type: 'website',
            url: 'https://main.d20ve942ylnzi2.amplifyapp.com/about',
            images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: about?.congregationPhoto?.alt || 'WCCLO Congregation' }] : undefined,
        },
        twitter: { card: 'summary_large_image', title, description, images: imageUrl ? [imageUrl] : undefined },
        alternates: { canonical: '/about' },
    };
}

export default async function About() {
    const [about, settings, districts]: [AboutPageData, SiteSettings, { name: string }[]] = await Promise.all([
        client.fetch(ABOUT_QUERY),
        client.fetch(SETTINGS_QUERY),
        client.fetch(DISTRICTS_QUERY),
    ]);

    const heading = about?.heading || 'About WCCLO';
    const subheading = about?.subheading || 'Serving the AME Church Community Across Florida';
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
            { title: 'Teaching', description: 'Educating and equipping members with knowledge and understanding' },
            { title: 'Training', description: 'Developing skills and abilities for effective ministry and service' },
            { title: 'Empowering', description: 'Enabling members to lead and serve with confidence and purpose' },
        ];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NonprofitOrganization',
        name: 'West Coast Conference Lay Organization',
        alternateName: 'WCCLO',
        description: overviewParagraphs.join(' '),
        parentOrganization: { '@type': 'Organization', name: 'African Methodist Episcopal Church, 11th Episcopal District' },
        areaServed: { '@type': 'State', name: 'Florida' },
        foundingDate: '1816',
    };

    // Full width, capped height, object-contain so nothing gets cropped —
    // whatever the photo's real aspect ratio is, the whole frame shows.
    const congregationPhotoUrl = about?.congregationPhoto
        ? urlFor(about.congregationPhoto)?.width(1600).url()
        : null;

    return (
        <div style={{ background: '#FFFFFF' }}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* HEADER — simple, light, matches the site's existing feel */}
            <section style={{ background: '#F4EFE2' }} className="px-6 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <span style={{ fontFamily: 'var(--font-cormorant-sc), serif', color: '#C9A84C', fontSize: '13px', letterSpacing: '.2em' }}>
                        11TH EPISCOPAL DISTRICT
                    </span>
                    <h1 style={{
                        fontFamily: 'var(--font-fraunces), serif', fontWeight: 600,
                        fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', lineHeight: 1.1, color: '#0A1F44', margin: '14px 0 12px',
                    }}>
                        {heading}
                    </h1>
                    <p style={{ fontFamily: 'var(--font-source-sans), sans-serif', color: '#5B6B85', fontSize: '17px' }}>
                        {subheading}
                    </p>
                </div>
            </section>

            {/* CONGREGATION PHOTO — full width, uncropped */}
            {congregationPhotoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={congregationPhotoUrl}
                    alt={about?.congregationPhoto?.alt || 'WCCLO congregation'}
                    className="w-full h-auto block"
                    style={{ maxHeight: '560px', objectFit: 'contain', background: '#F4EFE2' }}
                />
            )}

            {/* WHO WE ARE */}
            <section className="px-6 py-20">
                <div className="max-w-3xl mx-auto text-center">
                    <span style={{ fontFamily: 'var(--font-cormorant-sc), serif', color: '#C9A84C', fontSize: '13px', letterSpacing: '.2em' }}>WHO WE ARE</span>
                    <h2 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600, fontSize: 'clamp(1.8rem,3vw,2.2rem)', color: '#0A1F44', margin: '12px 0 24px' }}>
                        Teaching, training &amp; empowering the laity
                    </h2>
                    {overviewParagraphs.map((paragraph, idx) => (
                        <p key={idx} style={{ fontFamily: 'var(--font-source-sans), sans-serif', fontSize: '17px', lineHeight: 1.8, color: '#374151', textAlign: 'left', marginBottom: idx < overviewParagraphs.length - 1 ? '18px' : 0 }}>
                            {paragraph}
                        </p>
                    ))}
                </div>
            </section>

            {/* LEARN MORE — simple even cards, no gimmicks */}
            <section style={{ background: '#F4EFE2' }} className="px-6 py-20">
                <div className="max-w-6xl mx-auto">
                    <h2 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600, fontSize: '30px', color: '#0A1F44', marginBottom: '32px' }} className="text-center">
                        Learn More About Us
                    </h2>
                    <nav aria-label="About WCCLO subsections" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {subsections.map((section) => (
                            <Link
                                key={section.title}
                                href={section.link}
                                className="wcc-about-card block p-6 rounded-lg"
                                style={{ background: '#FFFFFF', border: '1px solid rgba(10,31,68,.08)' }}
                            >
                                <h3 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600, fontSize: '19px', color: '#0A1F44', marginBottom: '8px' }}>
                                    {section.title}
                                </h3>
                                <p style={{ fontFamily: 'var(--font-source-sans), sans-serif', fontSize: '14px', color: '#5B6B85', lineHeight: 1.55, marginBottom: '16px' }}>
                                    {section.description}
                                </p>
                                <span className="wcc-about-link" style={{ color: '#C9A84C', fontFamily: 'var(--font-source-sans), sans-serif', fontSize: '13px', fontWeight: 600 }}>
                                    Learn more →
                                </span>
                            </Link>
                        ))}
                    </nav>
                </div>
                <style>{`
                    .wcc-about-card { transition: box-shadow .2s ease, border-color .2s ease; }
                    .wcc-about-card:hover { box-shadow: 0 8px 24px rgba(10,31,68,.08); border-color: rgba(201,168,76,.4) !important; }
                `}</style>
            </section>

            {/* CORE VALUES — light, simple, gold as the only accent */}
            <section className="px-6 py-20">
                <div className="max-w-6xl mx-auto">
                    <h2 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600, fontSize: '30px', color: '#0A1F44', marginBottom: '32px' }} className="text-center">
                        Our Core Values
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {coreValues.map((value, idx) => (
                            <div key={idx} className="text-center">
                                <div className="mx-auto mb-4" style={{ width: '32px', height: '2px', background: '#C9A84C' }} />
                                <h3 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 600, fontSize: '21px', color: '#0A1F44', marginBottom: '10px' }}>
                                    {value.title}
                                </h3>
                                <p style={{ fontFamily: 'var(--font-source-sans), sans-serif', color: '#5B6B85', fontSize: '15px', lineHeight: 1.7 }}>
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
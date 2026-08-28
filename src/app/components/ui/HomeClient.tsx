'use client';
import Link from 'next/link';
import Image from 'next/image';
import type { ChurchRecord } from './homeClient/DistrictMap';
import { useEffect, useMemo } from 'react';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { client } from '@/sanity/client';
import ImageCarousel, { type GalleryImage } from './ImageCarousel';
import { ChevronRight } from 'lucide-react';

import styles from './homeClient/HomeClient.module.css';
import { DISTRICT_INFO, OFFICERS_PREVIEW_COUNT } from './homeClient/constants';
import { getUpcomingQuarterlyMeeting } from './homeClient/dateUtils';
import DistrictMap, { DistrictLegend } from './homeClient/DistrictMap';

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
    projectId && dataset ? createImageUrlBuilder({ projectId, dataset }).image(source) : null;

type Officer = { _id: string; name: string; title: string; photo?: SanityImageSource };
type Event = { _id: string; title: string; date: string; location: string; description: string };
type SiteSettings = {
    localLayOrgsCount?: number;
    districtsCount?: number;
    countiesCount?: number;
    newsletterPdfUrl?: string;
    facebookUrl?: string;
} | null;

interface HomeClientProps {
    officers: Officer[];
    events: Event[];
    servedCounties: string[];
    settings: SiteSettings;
    galleryImages: GalleryImage[];
    churches: ChurchRecord[];
}
export default function HomeClient({ officers, events, servedCounties, settings, galleryImages, churches }: HomeClientProps) {
    const localLayOrgsCount = settings?.localLayOrgsCount ?? 56;
    const districtsCount = settings?.districtsCount ?? 3;
    const countiesCount = settings?.countiesCount ?? servedCounties.length;
    const newsletterPdfUrl = settings?.newsletterPdfUrl ?? '#';
    const facebookUrl = settings?.facebookUrl ?? 'https://facebook.com';

    useEffect(() => {
        const section = document.querySelector('#wcc-map-section');
        if (!section) return;
        const numbers = Array.from(section.querySelectorAll<HTMLElement>('.wcc-map-stat-number'));
        const targets = Array.from(section.querySelectorAll<HTMLElement>('.wcc-map-stat')).map((el) =>
            Number(el.dataset.count || 0)
        );
        let started = false;

        const animateCounts = () => {
            if (started) return;
            started = true;
            numbers.forEach((el, index) => {
                const target = targets[index] ?? 0;
                const duration = 950 + index * 180;
                const start = performance.now();
                const tick = (now: number) => {
                    const progress = Math.min(1, (now - start) / duration);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = String(Math.round(target * eased));
                    if (progress < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            });
        };

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    animateCounts();
                    observer.disconnect();
                }
            },
            { threshold: 0.25 }
        );
        observer.observe(section);
        return () => observer.disconnect();
    }, [localLayOrgsCount, districtsCount, countiesCount]);

    const upcomingEvents = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return [...events]
            .filter((e) => new Date(e.date) >= now)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 6);
    }, [events]);

    const nextQuarterlyMeeting = useMemo(() => getUpcomingQuarterlyMeeting(), []);
    const hasQuarterlyEventFromCMS = upcomingEvents.some((e) => e.title.toLowerCase().includes('quarterly'));
    const officersPreview = officers.slice(0, OFFICERS_PREVIEW_COUNT);
    const hasMoreOfficers = officers.length > OFFICERS_PREVIEW_COUNT;
    const showEventsSection = upcomingEvents.length > 0 || (!hasQuarterlyEventFromCMS && nextQuarterlyMeeting);
    const president = officersPreview[0];
    const restOfficers = officersPreview.slice(1);

    return (
        <>
            {/* SECTION 1 — HERO */}
            <section className={`${styles.wccHero} relative overflow-hidden min-h-[600px] lg:min-h-[820px]`}>
                <div className={`absolute inset-0 ${styles.wccKenburns}`}>
                    <Image
                        src="/assets/hero-tampa-bay.jpg"
                        alt="Tampa Bay waterfront at dusk"
                        fill
                        priority
                        sizes="100vw"
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                </div>
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(100deg, #061024 0%, rgba(6,16,36,0.88) 30%, rgba(6,16,36,0.5) 58%, rgba(6,16,36,0.15) 82%)',
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(6,16,36,0.55) 0%, transparent 30%)' }}
                />

                <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-[100px] h-full flex items-center min-h-[600px] lg:min-h-[820px] py-20">
                    <div className="max-w-[560px]">
                        <div className={`flex items-center gap-3 mb-6 ${styles.wccFadeIn}`} style={{ animationDelay: '.1s' }}>
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 22 22"
                                className={styles.wccSealDraw}
                                style={{ animationDelay: '.15s' }}
                            >
                                <circle cx="11" cy="11" r="9" fill="none" stroke="#C9A84C" strokeWidth="1.2" />
                                <path
                                    d="M11 5 L12.3 9.1 L16.6 9.1 L13.1 11.6 L14.5 15.7 L11 13.1 L7.5 15.7 L8.9 11.6 L5.4 9.1 L9.7 9.1 Z"
                                    fill="#C9A84C"
                                />
                            </svg>
                            <span
                                style={{
                                    fontFamily: "'Cormorant SC','Playfair Display',serif",
                                    color: '#C9A84C',
                                    fontSize: '13px',
                                    letterSpacing: '.22em',
                                }}
                            >
                                WEST COAST CONFERENCE · 11TH EPISCOPAL DISTRICT
                            </span>
                        </div>

                        <div className={styles.wccFadeIn} style={{ animationDelay: '.2s', marginBottom: '18px' }}>
                            <div
                                style={{
                                    fontFamily: "'Source Sans 3',sans-serif",
                                    fontSize: '11px',
                                    color: '#F0D98A',
                                    letterSpacing: '.2em',
                                    textTransform: 'uppercase',
                                    marginBottom: '12px',
                                }}
                            >
                                Tampa Bay · St. Petersburg · Lakeland · Sarasota
                            </div>
                            <h1
                                style={{
                                    fontFamily: "'Fraunces', serif",
                                    fontOpticalSizing: 'auto',
                                    fontWeight: 600,
                                    fontSize: 'clamp(2.7rem, 6vw, 5.35rem)',
                                    lineHeight: 0.98,
                                    color: '#F4EFE2',
                                    margin: 0,
                                    maxWidth: '620px',
                                }}
                            >
                                Serving the Laity
                                <br />
                                Across Tampa Bay.
                            </h1>
                        </div>

                        <p
                            className={styles.wccFadeIn}
                            style={{
                                fontFamily: "'Source Sans 3', sans-serif",
                                fontWeight: 400,
                                fontSize: '17px',
                                lineHeight: 1.7,
                                color: '#C5CEDC',
                                maxWidth: '480px',
                                marginBottom: '36px',
                                animationDelay: '.34s',
                            }}
                        >
                            Since 1816, the A.M.E. Church has taught, trained, and empowered its people. Today, that
                            mission connects {localLayOrgsCount} local lay organizations across {countiesCount} Florida
                            counties and {districtsCount} districts.
                        </p>

                        <div className={`flex gap-4 flex-wrap ${styles.wccFadeIn}`} style={{ animationDelay: '.44s' }}>
                            <Link href="/about" className={styles.wccCtaGilt} style={{ color: '#C5CEDC' }}>
                                Our Story
                            </Link>
                            <Link href="/contact" className={styles.wccCtaGhost} style={{ color: '#C5CEDC' }}>
                                Get Involved
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2 — 1816 pull-quote (light parchment bg) */}
            <section style={{ background: '#F4EFE2' }} className="px-6 py-20">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_auto_1.4fr] gap-10 items-center">
                    <div className="flex gap-10 justify-center lg:justify-start">
                        {[
                            { n: localLayOrgsCount, label: 'Local Lay\nOrganizations' },
                            { n: districtsCount, label: 'Annual Conference\nDistricts' },
                            { n: countiesCount, label: 'Florida Counties\nServed' },
                        ].map((s) => (
                            <div key={s.label} className="text-center">
                                <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: '46px', color: '#0A1F44' }}>
                                    {s.n}
                                </div>
                                <div
                                    style={{
                                        fontFamily: "'Source Sans 3',sans-serif",
                                        fontSize: '12px',
                                        color: '#5B6B85',
                                        whiteSpace: 'pre-line',
                                        lineHeight: 1.4,
                                        marginTop: '6px',
                                    }}
                                >
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="hidden lg:block w-px self-stretch" style={{ background: 'rgba(10,31,68,.14)' }} />
                    <blockquote style={{ borderLeft: '2px solid #C9A84C', paddingLeft: '28px' }}>
                        <p
                            style={{
                                fontFamily: "'Fraunces',serif",
                                fontStyle: 'italic',
                                fontWeight: 500,
                                fontSize: 'clamp(1.3rem,2.4vw,1.7rem)',
                                color: '#0A1F44',
                                lineHeight: 1.35,
                            }}
                        >
                            &ldquo;Founded in 1816 — carried forward every quarter since, one lay organization at a time.&rdquo;
                        </p>
                    </blockquote>
                </div>
            </section>

            {/* SECTION 3 — EVENTS (white bg — original text colors expect light background) */}
            {showEventsSection && (
                <section style={{ background: '#FFFFFF' }} className="px-6 py-24">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-12">
                            <span style={{ fontFamily: "'Cormorant SC',serif", color: '#C9A84C', fontSize: '13px', letterSpacing: '.2em' }}>
                                WHAT&apos;S HAPPENING
                            </span>
                            <h2
                                style={{
                                    fontFamily: "'Fraunces',serif",
                                    fontWeight: 600,
                                    fontSize: '40px',
                                    color: '#0A1F44',
                                    margin: '10px 0 0',
                                }}
                            >
                                Upcoming Events &amp; Activities
                            </h2>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-6 mb-4">
                            {!hasQuarterlyEventFromCMS && nextQuarterlyMeeting && (
                                <div style={{ border: '1px solid #C9A84C', background: '#FBF8F0' }} className="rounded-sm p-6">
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: '30px', color: '#C9A84C' }}>
                                            {nextQuarterlyMeeting
                                                .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                                .toUpperCase()}
                                        </span>
                                        <span style={{ color: '#5B6B85', fontSize: '15px' }}>{nextQuarterlyMeeting.getFullYear()}</span>
                                    </div>
                                    <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: '20px', color: '#0A1F44', marginBottom: '8px' }}>
                                        Quarterly Meeting
                                    </h3>
                                    <p style={{ color: '#374151', fontSize: '14px', lineHeight: 1.6 }}>
                                        Held the last Saturday before the 5th Sunday. Check back for location details.
                                    </p>
                                </div>
                            )}
                            {upcomingEvents.map((event) => {
                                const eventDate = new Date(event.date);
                                return (
                                    <div key={event._id} style={{ border: '1px solid #E5E7EB' }} className="rounded-sm p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-baseline gap-2 mb-4">
                                            <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: '30px', color: '#C9A84C' }}>
                                                {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                                            </span>
                                            <span style={{ color: '#5B6B85', fontSize: '15px' }}>{eventDate.getFullYear()}</span>
                                        </div>
                                        <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: '20px', color: '#0A1F44', marginBottom: '8px' }}>
                                            {event.title}
                                        </h3>
                                        <p style={{ color: '#C9A84C', fontSize: '13px', marginBottom: '10px' }}>{event.location}</p>
                                        <p style={{ color: '#374151', fontSize: '14px', lineHeight: 1.6 }}>{event.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-8">
                            <Link href="/events" className={styles.wccLinkUnderline}>
                                View Full Calendar →
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* SECTION 4 — AREAS WE SERVE (navy bg) */}
            <section id="wcc-map-section" style={{ background: '#061024' }} className="relative overflow-hidden px-6 py-24 lg:py-32">
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(circle at 72% 48%, rgba(201,168,76,.08), transparent 34%), linear-gradient(180deg, #061024 0%, #07162D 100%)',
                    }}
                />

                <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-[.72fr_1.28fr] gap-12 lg:gap-4 items-center">
                    <div className="lg:pr-10">
                        <span style={{ fontFamily: "'Cormorant SC',serif", color: '#C9A84C', fontSize: '13px', letterSpacing: '.2em' }}>
                            WHERE WE SERVE
                        </span>
                        <h2
                            style={{
                                fontFamily: "'Fraunces',serif",
                                fontWeight: 600,
                                fontSize: 'clamp(2.4rem,4.5vw,4rem)',
                                lineHeight: 1.02,
                                color: '#F4EFE2',
                                margin: '14px 0 22px',
                                maxWidth: '520px',
                            }}
                        >
                            Three Districts,
                            <br />
                            One Conference.
                        </h2>
                        <p
                            style={{
                                fontFamily: "'Source Sans 3',sans-serif",
                                color: '#9BA9BC',
                                fontSize: '16px',
                                lineHeight: 1.75,
                                maxWidth: '470px',
                                marginBottom: '30px',
                            }}
                        >
                            Hover a county to see its district and church count. Click through to explore each district&apos;s
                            officers, events, and churches.
                        </p>

                        <DistrictLegend churches={churches} />
                    </div>

                    <DistrictMap  churches={churches}/>
                </div>
            </section>

            {/* SECTION 5 — WHO WE ARE (white bg) */}
            <section style={{ background: '#FFFFFF' }} className="px-6 py-24">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.85fr_1.15fr] gap-14 items-start">
                    <div>
                        <span style={{ fontFamily: "'Cormorant SC',serif", color: '#C9A84C', fontSize: '13px', letterSpacing: '.2em' }}>
                            WHO WE ARE
                        </span>
                        <h2
                            style={{
                                fontFamily: "'Fraunces',serif",
                                fontWeight: 600,
                                fontSize: '38px',
                                color: '#0A1F44',
                                lineHeight: 1.15,
                                margin: '14px 0 0',
                            }}
                        >
                            Teaching, training &amp; empowering the laity
                        </h2>
                    </div>
                    <div>
                        <p style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: '16px', lineHeight: 1.75, color: '#374151' }}>
                            The West Coast Conference Lay Organization (WCCLO) serves as the teaching, training and
                            empowering body for the laity of the West Coast Conference in the 11th Episcopal District of
                            the African Methodist Episcopal Church. Comprised of {localLayOrgsCount} local lay organizations
                            from churches across the Annual Conference — Lakeland, St. Petersburg, and Tampa — the WCCLO
                            provides training, scholarship, and fellowship opportunities to believers across the coast.
                        </p>
                        <div className="flex gap-4 flex-wrap mt-8">
                            <Link href="/districtsLanding" className={styles.wccLinkUnderline}>
                                Explore Our Districts →
                            </Link>
                            <span style={{ color: '#D1D5DB' }}>·</span>
                            <a href="https://eedlo.org" className={styles.wccLinkUnderline}>
                                eedlo.org
                            </a>
                            <span style={{ color: '#D1D5DB' }}>·</span>
                            <a href="https://ameclay.org" className={styles.wccLinkUnderline}>
                                ameclay.org
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 6 — LEADERSHIP (navy bg) */}
            <section style={{ background: '#061024' }} className="px-6 py-24">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-14">
                        <span style={{ fontFamily: "'Cormorant SC',serif", color: '#C9A84C', fontSize: '13px', letterSpacing: '.2em' }}>
                            LEADERSHIP
                        </span>
                        <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: '40px', color: '#F4EFE2', margin: '10px 0 0' }}>
                            Conference Officers
                        </h2>
                    </div>

                    <div className="grid lg:grid-cols-[280px_1fr] gap-14">
                        {president &&
                            (() => {
                                const initials = president.name
                                    .split(' ')
                                    .map((w) => w[0])
                                    .join('')
                                    .toUpperCase()
                                    .slice(0, 2);
                                const photoUrl = president.photo ? urlFor(president.photo)?.width(560).height(700).url() : null;
                                return (
                                    <div>
                                        <div
                                            className="relative overflow-hidden rounded-sm mb-4"
                                            style={{ aspectRatio: '4/5', background: '#12294F', border: '1px solid rgba(201,168,76,.3)' }}
                                        >
                                            {photoUrl ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={photoUrl} alt={president.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span style={{ fontFamily: "'Fraunces',serif", fontSize: '4rem', color: '#C9A84C' }}>
                                                        {initials}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: '22px', color: '#F4EFE2' }}>
                                            {president.name}
                                        </h3>
                                        <p style={{ color: '#C9A84C', fontSize: '13px', letterSpacing: '.04em', textTransform: 'uppercase' }}>
                                            {president.title}
                                        </p>
                                    </div>
                                );
                            })()}

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 content-start">
                            {restOfficers.map((officer) => {
                                const initials = officer.name
                                    .split(' ')
                                    .map((w) => w[0])
                                    .join('')
                                    .toUpperCase()
                                    .slice(0, 2);
                                const photoUrl = officer.photo ? urlFor(officer.photo)?.width(320).height(400).url() : null;
                                return (
                                    <div key={officer._id}>
                                        <div className="relative overflow-hidden rounded-sm mb-3" style={{ aspectRatio: '3/4', background: '#12294F' }}>
                                            {photoUrl ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={photoUrl} alt={officer.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span style={{ fontFamily: "'Fraunces',serif", fontSize: '1.8rem', color: '#5B6B85' }}>
                                                        {initials}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <h4 style={{ fontFamily: "'Fraunces',serif", fontSize: '15px', color: '#F4EFE2' }}>{officer.name}</h4>
                                        <p style={{ color: '#8593AB', fontSize: '12px' }}>{officer.title}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-14 pt-8" style={{ borderTop: '1px solid rgba(201,168,76,.2)' }}>
                        <Link href="/officers" className={styles.wccLinkUnderlineLight}>
                            {hasMoreOfficers ? 'View All Officers →' : 'View Officers →'}
                        </Link>
                    </div>
                </div>
            </section>

            {/* SECTION 7 — GALLERY */}
            {galleryImages?.length > 0 && (
                <section style={{ background: '#F4EFE2' }} className="py-24">
                    <div className="max-w-[1600px] mx-auto px-6">
                        <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
                            <div>
                                <span style={{ fontFamily: "'Cormorant SC',serif", color: '#C9A84C', fontSize: '13px', letterSpacing: '.2em' }}>
                                    MOMENTS FROM OUR CONFERENCE
                                </span>
                                <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: '38px', color: '#0A1F44', margin: '10px 0 0' }}>
                                    Gallery
                                </h2>
                            </div>
                            <Link href="/gallery" className={styles.wccLinkUnderline}>
                                View Full Gallery →
                            </Link>
                        </div>
                        <ImageCarousel images={galleryImages} />
                    </div>
                </section>
            )}

            {/* SECTION 8 — NEWSLETTER + SOCIAL */}
            <section style={{ background: '#F4EFE2' }} className="px-6 py-20">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
                    <div>
                        <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: '28px', color: '#0A1F44', marginBottom: '14px' }}>
                            Our Voice Newsletter
                        </h3>
                        <p style={{ color: '#374151', fontSize: '15px', lineHeight: 1.7, marginBottom: '26px' }}>
                            Stay up to date with our quarterly newsletter covering history, upcoming events, and happenings
                            in local churches.
                        </p>
                        <a href={newsletterPdfUrl} target="_blank" rel="noopener noreferrer" className={styles.wccCtaGiltLight}>
                            Download Vol. 1
                        </a>
                    </div>
                    <div>
                        <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: '28px', color: '#0A1F44', marginBottom: '14px' }}>
                            Get Social with the WCCLO
                        </h3>
                        <p style={{ color: '#374151', fontSize: '15px', lineHeight: 1.7, marginBottom: '26px' }}>
                            See what&apos;s happening and find out how you can take part in our activities on our Facebook
                            page.
                        </p>
                        <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className={styles.wccCtaNavy}>
                            <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Follow @WestCoastLay
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
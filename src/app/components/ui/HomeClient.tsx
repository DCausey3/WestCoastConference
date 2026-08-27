'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useMemo } from "react";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/client";
import ImageCarousel, { type GalleryImage } from './ImageCarousel';

function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
    projectId && dataset
        ? createImageUrlBuilder({ projectId, dataset }).image(source)
        : null;

// ─── Tokens ─────────────────────────────────────────────────────────────
// ink       #0A1F44  primary navy, text on light
// field     #061024  hero / dark background
// gilt      #C9A84C  signature accent — map + seal marks + one CTA only
// parchment #F4EFE2  card / section background instead of flat white
// slate     #5B6B85  secondary text on dark
// hairline  rgba(201,168,76,.22)

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
}

function getFifthSundayMeeting(year: number, month: number): Date | null {
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const sundays: number[] = [];
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
        const date = new Date(year, month, d);
        if (date.getDay() === 0) sundays.push(d);
    }
    if (sundays.length < 5) return null;
    const saturdayBefore = new Date(year, month, sundays[4] - 1);
    return saturdayBefore;
}
function getUpcomingQuarterlyMeeting(from: Date = new Date()): Date | null {
    let year = from.getFullYear();
    let month = from.getMonth();
    for (let i = 0; i < 24; i++) {
        const meeting = getFifthSundayMeeting(year, month);
        if (meeting && meeting >= from) return meeting;
        month++;
        if (month > 11) { month = 0; year++; }
    }
    return null;
}

const OFFICERS_PREVIEW_COUNT = 5;


function d3SafeSelect(selector: string): any {
    try {
        const d3 = (window as any)?.d3;
        return d3 ? d3.select(selector) : null;
    } catch {
        return null;
    }
}

export default function HomeClient({
                                       officers, events, servedCounties, settings, galleryImages,
                                   }: HomeClientProps) {
    const tooltipRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cancelled = false;
        const init = async () => {
            await Promise.all([
                loadScript('https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js'),
                loadScript('https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js'),
            ]);
            if (cancelled) return;

            const d3 = (window as any).d3;
            const topojson = (window as any).topojson;
            const SERVED = new Set(servedCounties);
            const mapNode = document.querySelector('#wcc-map');
            const mapSection = document.querySelector('#wcc-map-section');
            if (!mapNode || !mapSection) return;

            const res = await fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json');
            const us = await res.json();
            if (cancelled) return;

            const countiesFeature = topojson.feature(us, us.objects.counties);
            const flCounties = countiesFeature.features.filter((d: any) => d.id.toString().startsWith('12'));
            const florida = { type: 'FeatureCollection', features: flCounties };

            const svg = d3.select('#wcc-map');
            svg.selectAll('*').remove();
            svg.attr('role', 'img').attr('aria-label', 'Interactive map of West Coast Conference territory across Florida');

            const defs = svg.append('defs');
            const servedGradient = defs.append('linearGradient')
                .attr('id', 'served-gradient')
                .attr('x1', '0%').attr('y1', '100%').attr('x2', '100%').attr('y2', '0%');
            servedGradient.append('stop').attr('offset', '0%').attr('stop-color', '#8E6C22');
            servedGradient.append('stop').attr('offset', '48%').attr('stop-color', '#C9A84C');
            servedGradient.append('stop').attr('offset', '100%').attr('stop-color', '#F0D98A');

            const radial = defs.append('radialGradient').attr('id', 'map-radial');
            radial.append('stop').attr('offset', '0%').attr('stop-color', '#C9A84C').attr('stop-opacity', '.22');
            radial.append('stop').attr('offset', '55%').attr('stop-color', '#C9A84C').attr('stop-opacity', '.05');
            radial.append('stop').attr('offset', '100%').attr('stop-color', '#C9A84C').attr('stop-opacity', '0');

            const glow = defs.append('filter').attr('id', 'gold-glow')
                .attr('x', '-80%').attr('y', '-80%').attr('width', '260%').attr('height', '260%');
            glow.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
            glow.append('feMerge').selectAll('feMergeNode')
                .data(['blur', 'SourceGraphic']).join('feMergeNode').attr('in', (d: string) => d);

            const softGlow = defs.append('filter').attr('id', 'soft-glow')
                .attr('x', '-100%').attr('y', '-100%').attr('width', '300%').attr('height', '300%');
            softGlow.append('feGaussianBlur').attr('stdDeviation', '8');

            const proj = d3.geoMercator().fitExtent([[70, 55], [830, 845]], florida);
            const path = d3.geoPath().projection(proj);

            // A subtle geographic atmosphere behind the territory.
            svg.append('circle')
                .attr('cx', 500).attr('cy', 470).attr('r', 280)
                .attr('fill', 'url(#map-radial)')
                .attr('opacity', 0);

            const baseLayer = svg.append('g').attr('class', 'wcc-base-layer');
            const territoryLayer = svg.append('g').attr('class', 'wcc-territory-layer');
            const networkLayer = svg.append('g').attr('class', 'wcc-network-layer');
            const labelsLayer = svg.append('g').attr('class', 'wcc-labels-layer');

            const paths = baseLayer.selectAll('path')
                .data(flCounties)
                .join('path')
                .attr('d', path)
                .attr('fill', (d: any) => SERVED.has(d.properties.name) ? 'url(#served-gradient)' : '#0A1931')
                .attr('fill-opacity', (d: any) => SERVED.has(d.properties.name) ? 0 : 0.56)
                .attr('stroke', '#71809A')
                .attr('stroke-width', .45)
                .attr('stroke-opacity', .16)
                .style('cursor', 'pointer');

            // Repaint served counties in their own layer so they can be animated independently.
            const servedPaths = territoryLayer.selectAll('path')
                .data(flCounties.filter((d: any) => SERVED.has(d.properties.name)))
                .join('path')
                .attr('d', path)
                .attr('fill', 'url(#served-gradient)')
                .attr('fill-opacity', 0)
                .attr('stroke', '#E7C874')
                .attr('stroke-width', 1)
                .attr('stroke-opacity', 0);

            // The outside edge of the conference territory becomes a single elegant line.
            const territoryMesh = topojson.mesh(
                us,
                us.objects.counties,
                (a: any, b: any) => {
                    const aIsFlorida = a && a.id?.toString().startsWith('12');
                    const bIsFlorida = b && b.id?.toString().startsWith('12');
                    if (!aIsFlorida && !bIsFlorida) return false;
                    return SERVED.has(a?.properties?.name) !== SERVED.has(b?.properties?.name);
                }
            );

            const boundary = territoryLayer.append('path')
                .datum(territoryMesh)
                .attr('d', path)
                .attr('fill', 'none')
                .attr('stroke', '#F0D98A')
                .attr('stroke-width', 2.1)
                .attr('stroke-linecap', 'round')
                .attr('stroke-linejoin', 'round')
                .attr('filter', 'url(#gold-glow)')
                .attr('stroke-opacity', 0);

            // Conference cities: deliberately restrained, editorial-style markers.
            const cities = [
                { name: 'TAMPA', sub: 'Hillsborough County', coordinates: [-82.4572, 27.9506], dx: 13, dy: -12, anchor: 'start' },
                { name: 'ST. PETERSBURG', sub: 'Pinellas County', coordinates: [-82.6403, 27.7676], dx: -13, dy: 22, anchor: 'end' },
                { name: 'PLANT CITY', sub: 'Hillsborough County', coordinates: [-82.1129, 28.0189], dx: 13, dy: 19, anchor: 'start' },
                { name: 'LAKELAND', sub: 'Polk County', coordinates: [-81.9498, 28.0395], dx: 13, dy: -12, anchor: 'start' },
                { name: 'SARASOTA', sub: 'Sarasota County', coordinates: [-82.5307, 27.3364], dx: 13, dy: 18, anchor: 'start' },
            ];

            const projectedCities = cities.map((city) => ({
                ...city,
                point: proj(city.coordinates as [number, number]),
            }));

            // Connect the major communities to visually communicate a living network.
            const routePairs = [
                ['TAMPA', 'ST. PETERSBURG'],
                ['TAMPA', 'PLANT CITY'],
                ['PLANT CITY', 'LAKELAND'],
                ['TAMPA', 'SARASOTA'],
            ];
            const cityByName = new Map(projectedCities.map((c) => [c.name, c]));
            const routeData = routePairs.map(([from, to]) => ({
                from: cityByName.get(from)!,
                to: cityByName.get(to)!,
            }));

            const routes = networkLayer.selectAll('path.wcc-route')
                .data(routeData)
                .join('path')
                .attr('class', 'wcc-route')
                .attr('d', (d: any) => {
                    const [x1, y1] = d.from.point;
                    const [x2, y2] = d.to.point;
                    const mx = (x1 + x2) / 2;
                    const my = (y1 + y2) / 2 - Math.max(12, Math.abs(x2 - x1) * .09);
                    return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
                })
                .attr('fill', 'none')
                .attr('stroke', '#C9A84C')
                .attr('stroke-width', 1)
                .attr('stroke-dasharray', '3 9')
                .attr('stroke-linecap', 'round')
                .attr('stroke-opacity', 0);

            const cityGroups = labelsLayer.selectAll('g.wcc-city')
                .data(projectedCities)
                .join('g')
                .attr('class', 'wcc-city')
                .attr('transform', (d: any) => `translate(${d.point[0]},${d.point[1]})`)
                .style('cursor', 'default');

            cityGroups.append('circle')
                .attr('class', 'wcc-city-pulse')
                .attr('r', 8)
                .attr('fill', 'none')
                .attr('stroke', '#C9A84C')
                .attr('stroke-width', 1)
                .attr('opacity', 0);

            cityGroups.append('circle')
                .attr('r', 3.8)
                .attr('fill', '#F0D98A')
                .attr('stroke', '#061024')
                .attr('stroke-width', 2)
                .attr('opacity', 0);

            cityGroups.append('text')
                .attr('x', (d: any) => d.dx)
                .attr('y', (d: any) => d.dy)
                .attr('text-anchor', (d: any) => d.anchor)
                .attr('fill', '#F4EFE2')
                .attr('font-family', "'Source Sans 3', sans-serif")
                .attr('font-size', '11px')
                .attr('font-weight', '700')
                .attr('letter-spacing', '.13em')
                .attr('opacity', 0)
                .text((d: any) => d.name);

            cityGroups.append('text')
                .attr('x', (d: any) => d.dx)
                .attr('y', (d: any) => d.dy + (d.dy < 0 ? 14 : 14))
                .attr('text-anchor', (d: any) => d.anchor)
                .attr('fill', '#71809A')
                .attr('font-family', "'Source Sans 3', sans-serif")
                .attr('font-size', '8px')
                .attr('letter-spacing', '.05em')
                .attr('opacity', 0)
                .text((d: any) => d.sub);

            // Animate only once when the map enters the viewport.
            let hasEntered = false;
            const play = () => {
                if (hasEntered || cancelled) return;
                hasEntered = true;

                svg.select('circle')
                    .transition().duration(1100).ease(d3.easeCubicOut).attr('opacity', 1);

                paths.transition()
                    .delay((d: any) => 80 + path.centroid(d)[0] * .7)
                    .duration(750)
                    .ease(d3.easeCubicOut)
                    .attr('fill-opacity', (d: any) => SERVED.has(d.properties.name) ? .16 : .56);

                servedPaths
                    .attr('stroke-dasharray', function (this: SVGPathElement) {
                        const len = this.getTotalLength ? this.getTotalLength() : 800;
                        return `${len} ${len}`;
                    })
                    .attr('stroke-dashoffset', function (this: SVGPathElement) {
                        return this.getTotalLength ? this.getTotalLength() : 800;
                    })
                    .transition()
                    .delay((d: any, i: number) => 500 + i * 85)
                    .duration(900)
                    .ease(d3.easeCubicOut)
                    .attr('fill-opacity', .78)
                    .attr('stroke-opacity', .72)
                    .attr('stroke-dashoffset', 0);

                boundary
                    .attr('stroke-dasharray', function (this: SVGPathElement) {
                        const len = this.getTotalLength ? this.getTotalLength() : 1800;
                        return `${len} ${len}`;
                    })
                    .attr('stroke-dashoffset', function (this: SVGPathElement) {
                        return this.getTotalLength ? this.getTotalLength() : 1800;
                    })
                    .transition().delay(650).duration(1500).ease(d3.easeCubicInOut)
                    .attr('stroke-dashoffset', 0)
                    .attr('stroke-opacity', .96);

                routes.each(function (this: SVGPathElement) {
                    const len = this.getTotalLength ? this.getTotalLength() : 400;
                    d3.select(this)
                        .attr('stroke-dasharray', `${len} ${len}`)
                        .attr('stroke-dashoffset', len)
                        .transition().delay(1500).duration(1000).ease(d3.easeCubicOut)
                        .attr('stroke-dashoffset', 0)
                        .attr('stroke-opacity', .42);
                });

                cityGroups.selectAll('circle:not(.wcc-city-pulse)')
                    .transition().delay((d: any, i: number) => 1800 + i * 110).duration(450)
                    .attr('opacity', 1);
                cityGroups.selectAll('text')
                    .transition().delay((d: any, i: number) => 1950 + i * 110).duration(550)
                    .attr('opacity', 1);

                // One quiet pulse at each city, staggered rather than constant.
                cityGroups.selectAll('.wcc-city-pulse').each(function (this: SVGCircleElement, d: any, i: number) {
                    const node = d3.select(this);
                    const pulse = () => {
                        node.attr('r', 4).attr('opacity', .65)
                            .transition().delay(2600 + i * 420).duration(1300).ease(d3.easeSinInOut)
                            .attr('r', 15).attr('opacity', 0)
                            .on('end', () => {
                                if (!cancelled) pulse();
                            });
                    };
                    pulse();
                });
            };

            const observer = new IntersectionObserver((entries) => {
                if (entries.some((entry) => entry.isIntersecting)) play();
            }, { threshold: .28 });
            observer.observe(mapSection);

            paths
                .on('mouseenter', function (this: any, event: MouseEvent, d: any) {
                    const isServed = SERVED.has(d.properties.name);
                    d3.select(this).interrupt().transition().duration(180)
                        .attr('fill-opacity', isServed ? 1 : .72)
                        .attr('stroke', isServed ? '#F0D98A' : '#8B98AD')
                        .attr('stroke-width', isServed ? 1.25 : .85)
                        .attr('stroke-opacity', isServed ? .9 : .38);
                })
                .on('mousemove', function (event: MouseEvent, d: any) {
                    const name = d.properties.name;
                    const tooltip = tooltipRef.current;
                    if (!tooltip) return;
                    const host = mapNode.getBoundingClientRect();
                    tooltip.style.opacity = '1';
                    tooltip.style.left = `${event.clientX - host.left + 16}px`;
                    tooltip.style.top = `${event.clientY - host.top - 58}px`;
                    tooltip.innerHTML = `
                        <div style="font-family:'Source Sans 3',sans-serif;font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:#C9A84C;margin-bottom:5px;">
                            ${SERVED.has(name) ? 'West Coast Conference' : 'Outside Territory'}
                        </div>
                        <div style="font-family:'Fraunces',serif;font-size:16px;line-height:1.1;color:#F4EFE2;">${name} County</div>
                    `;
                })
                .on('mouseleave', function (this: any, event: MouseEvent, d: any) {
                    const isServed = SERVED.has(d.properties.name);
                    d3.select(this).transition().duration(240)
                        .attr('fill-opacity', isServed ? .16 : .56)
                        .attr('stroke', '#71809A')
                        .attr('stroke-width', .45)
                        .attr('stroke-opacity', .16);
                    if (tooltipRef.current) tooltipRef.current.style.opacity = '0';
                });

            return () => observer.disconnect();
        };

        let cleanup: (() => void) | undefined;
        init().then((fn) => { cleanup = fn; });
        return () => {
            cancelled = true;
            cleanup?.();
            const svg = d3SafeSelect('#wcc-map');
            svg?.selectAll('*').interrupt();
        };
    }, [servedCounties]);

    const localLayOrgsCount = settings?.localLayOrgsCount ?? 56;
    const districtsCount = settings?.districtsCount ?? 3;
    const countiesCount = settings?.countiesCount ?? servedCounties.length;
    const newsletterPdfUrl = settings?.newsletterPdfUrl ?? '#';
    const facebookUrl = settings?.facebookUrl ?? 'https://facebook.com';

    useEffect(() => {
        const section = document.querySelector('#wcc-map-section');
        if (!section) return;
        const numbers = Array.from(section.querySelectorAll<HTMLElement>('.wcc-map-stat-number'));
        const targets = Array.from(section.querySelectorAll<HTMLElement>('.wcc-map-stat')).map((el) => Number(el.dataset.count || 0));
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

        const observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                animateCounts();
                observer.disconnect();
            }
        }, { threshold: .25 });
        observer.observe(section);
        return () => observer.disconnect();
    }, [localLayOrgsCount, districtsCount, countiesCount]);


    const upcomingEvents = useMemo(() => {
        const now = new Date(); now.setHours(0, 0, 0, 0);
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
            {/* SECTION 1 — HERO: a real place (Tampa Bay / Lakeland / Plant City / Sarasota),
                slow Ken Burns drift on the photo, gold seal mark draws in once on load */}
            <section ref={heroRef} className="wcc-hero relative overflow-hidden min-h-[600px] lg:min-h-[820px]">
                <div className="absolute inset-0 wcc-kenburns">
                    <Image
                        src="/assets/hero-tampa-bay.jpg"
                        alt="Tampa Bay waterfront at dusk"
                        fill
                        priority
                        sizes="100vw"
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                    />
                </div>
                <div className="absolute inset-0" style={{
                    background: 'linear-gradient(100deg, #061024 0%, rgba(6,16,36,0.88) 30%, rgba(6,16,36,0.5) 58%, rgba(6,16,36,0.15) 82%)',
                }} />
                <div className="absolute inset-0" style={{
                    background: 'linear-gradient(to top, rgba(6,16,36,0.55) 0%, transparent 30%)',
                }} />

                <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-[100px] h-full flex items-center min-h-[600px] lg:min-h-[820px] py-20">
                    <div className="max-w-[560px]">
                        <div className="flex items-center gap-3 mb-6 wcc-fade-in" style={{ animationDelay: '.1s' }}>
                            <svg width="22" height="22" viewBox="0 0 22 22" className="wcc-seal-draw" style={{ animationDelay: '.15s' }}>
                                <circle cx="11" cy="11" r="9" fill="none" stroke="#C9A84C" strokeWidth="1.2" />
                                <path d="M11 5 L12.3 9.1 L16.6 9.1 L13.1 11.6 L14.5 15.7 L11 13.1 L7.5 15.7 L8.9 11.6 L5.4 9.1 L9.7 9.1 Z" fill="#C9A84C" />
                            </svg>
                            <span style={{ fontFamily: "'Cormorant SC','Playfair Display',serif", color: '#C9A84C', fontSize: '13px', letterSpacing: '.22em' }}>
                                WEST COAST CONFERENCE · 11TH EPISCOPAL DISTRICT
                            </span>
                        </div>

                        <div className="wcc-fade-in" style={{ animationDelay: '.2s', marginBottom: '18px' }}>
                            <div style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: '11px', color: '#F0D98A', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
                                Tampa Bay · St. Petersburg · Lakeland · Sarasota
                            </div>
                            <h1 style={{
                                fontFamily: "'Fraunces', serif", fontOpticalSizing: 'auto', fontWeight: 600,
                                fontSize: 'clamp(2.7rem, 6vw, 5.35rem)', lineHeight: .98, color: '#F4EFE2',
                                margin: 0, maxWidth: '620px',
                            }}>
                                Serving the Laity<br />Across Tampa Bay.
                            </h1>
                        </div>

                        <p className="wcc-fade-in" style={{
                            fontFamily: "'Source Sans 3', sans-serif", fontWeight: 400, fontSize: '17px', lineHeight: 1.7,
                            color: '#C5CEDC', maxWidth: '480px', marginBottom: '36px', animationDelay: '.34s',
                        }}>
                            Since 1816, the A.M.E. Church has taught, trained, and empowered its people.
                            Today, that mission connects {localLayOrgsCount} local lay organizations across {countiesCount} Florida counties and {districtsCount} districts.
                        </p>

                        <div className="flex gap-4 flex-wrap wcc-fade-in" style={{ animationDelay: '.44s' }}>
                            <Link href="/about" className="wcc-cta-gilt"  style={{color: '#C5CEDC'}}>Our Story</Link>
                            <Link href="/contact" className="wcc-cta-ghost" style={{color: '#C5CEDC'}}>Get Involved</Link>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .wcc-hero { background: #061024; }
                    .wcc-kenburns { animation: wccKenBurns 22s ease-in-out infinite alternate; }
                    @keyframes wccKenBurns {
                        from { transform: scale(1) translate3d(0,0,0); }
                        to   { transform: scale(1.08) translate3d(-1%, -1%, 0); }
                    }
                    .wcc-fade-in { opacity: 0; animation: wccFadeIn .8s cubic-bezier(.2,.7,.2,1) forwards; }
                    @keyframes wccFadeIn { from { opacity:0; transform: translateY(14px);} to { opacity:1; transform:none; } }
                    .wcc-seal-draw {
                        opacity: 0; animation: wccSealIn .6s ease-out forwards;
                        transform-origin: center;
                    }
                    @keyframes wccSealIn {
                        from { opacity: 0; transform: scale(.4) rotate(-25deg); }
                        to   { opacity: 1; transform: scale(1) rotate(0deg); }
                    }
                    .wcc-cta-gilt {
                        background: #C9A84C; color: #061024; padding: 13px 30px; font-family:'Source Sans 3',sans-serif;
                        font-weight: 600; font-size: 13px; letter-spacing: .08em; text-transform: uppercase;
                        border-radius: 2px; transition: box-shadow .25s ease, transform .25s ease;
                    }
                    .wcc-cta-gilt:hover { box-shadow: 0 8px 28px rgba(201,168,76,.35); transform: translateY(-1px); }
                    .wcc-cta-ghost {
                        border: 1px solid rgba(244,239,226,.35); color: #F4EFE2; padding: 12px 29px;
                        font-family:'Source Sans 3',sans-serif; font-weight: 600; font-size: 13px; letter-spacing: .08em;
                        text-transform: uppercase; border-radius: 2px; transition: border-color .25s ease, color .25s ease;
                    }
                    .wcc-cta-ghost:hover { border-color: #C9A84C; color: #C9A84C; }
                    @media (prefers-reduced-motion: reduce) {
                        .wcc-fade-in, .wcc-seal-draw { animation: none !important; opacity: 1 !important; transform: none !important; }
                        .wcc-kenburns { animation: none !important; }
                    }
                `}</style>
            </section>

            {/* SECTION 2 — 1816 as a pull-quote, not a fifth stat tile */}
            <section style={{ background: '#F4EFE2' }} className="px-6 py-20">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_auto_1.4fr] gap-10 items-center">
                    <div className="flex gap-10 justify-center lg:justify-start">
                        {[
                            { n: localLayOrgsCount, label: 'Local Lay\nOrganizations' },
                            { n: districtsCount, label: 'Annual Conference\nDistricts' },
                            { n: countiesCount, label: 'Florida Counties\nServed' },
                        ].map((s) => (
                            <div key={s.label} className="text-center">
                                <div style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: '46px', color: '#0A1F44' }}>{s.n}</div>
                                <div style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: '12px', color: '#5B6B85', whiteSpace: 'pre-line', lineHeight: 1.4, marginTop: '6px' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                    <div className="hidden lg:block w-px self-stretch" style={{ background: 'rgba(10,31,68,.14)' }} />
                    <blockquote style={{ borderLeft: '2px solid #C9A84C', paddingLeft: '28px' }}>
                        <p style={{ fontFamily: "'Fraunces',serif", fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(1.3rem,2.4vw,1.7rem)', color: '#0A1F44', lineHeight: 1.35 }}>
                            &ldquo;Founded in 1816 — carried forward every quarter since, one lay organization at a time.&rdquo;
                        </p>
                    </blockquote>
                </div>
            </section>

            {/* SECTION 2.5 — SIGNATURE MAP: an editorial, animated view of the conference network */}
            <section id="wcc-map-section" style={{ background: '#061024' }} className="relative overflow-hidden px-6 py-24 lg:py-32">
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'radial-gradient(circle at 72% 48%, rgba(201,168,76,.08), transparent 34%), linear-gradient(180deg, #061024 0%, #07162D 100%)',
                }} />
                <div className="absolute -right-24 top-10 pointer-events-none select-none" style={{
                    fontFamily: "'Fraunces',serif", fontSize: 'clamp(18rem, 38vw, 34rem)', lineHeight: .7,
                    fontWeight: 600, color: 'rgba(201,168,76,.035)', letterSpacing: '-.08em',
                }}>11</div>

                <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-[.72fr_1.28fr] gap-12 lg:gap-4 items-center">
                    <div className="lg:pr-10">
                        <span style={{ fontFamily: "'Cormorant SC',serif", color: '#C9A84C', fontSize: '13px', letterSpacing: '.2em' }}>WHERE WE SERVE</span>
                        <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: 'clamp(2.4rem,4.5vw,4rem)', lineHeight: 1.02, color: '#F4EFE2', margin: '14px 0 22px', maxWidth: '520px' }}>
                            A Conference<br />Rooted in Community.
                        </h2>
                        <p style={{ fontFamily: "'Source Sans 3',sans-serif", color: '#9BA9BC', fontSize: '16px', lineHeight: 1.75, maxWidth: '470px', marginBottom: '34px' }}>
                            From Tampa and St. Petersburg through Plant City, Lakeland, and Sarasota, the West Coast Conference connects the laity across the communities we serve.
                        </p>

                        <div className="grid grid-cols-3 gap-5 max-w-[470px]">
                            {[
                                { n: localLayOrgsCount, label: 'LOCAL\nORGANIZATIONS' },
                                { n: districtsCount, label: 'CONFERENCE\nDISTRICTS' },
                                { n: countiesCount, label: 'FLORIDA\nCOUNTIES' },
                            ].map((stat, index) => (
                                <div key={stat.label} className="wcc-map-stat" data-count={stat.n} data-index={index}>
                                    <div className="wcc-map-stat-number" style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: 'clamp(2rem,4vw,3.1rem)', lineHeight: 1, color: '#F0D98A' }}>0</div>
                                    <div style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: '9px', lineHeight: 1.45, letterSpacing: '.12em', color: '#71809A', whiteSpace: 'pre-line', marginTop: '9px' }}>{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-9 flex items-center gap-3" style={{ color: '#71809A', fontFamily: "'Source Sans 3',sans-serif", fontSize: '10px', letterSpacing: '.12em', textTransform: 'uppercase' }}>
                            <span className="wcc-live-dot" /> Interactive conference territory
                        </div>
                    </div>

                    <div className="relative min-h-[520px] lg:min-h-[680px]">
                        <div
                            ref={tooltipRef}
                            className="absolute z-20 px-4 py-3 pointer-events-none rounded-sm"
                            style={{ background: 'rgba(6,16,36,.96)', border: '1px solid rgba(201,168,76,.65)', boxShadow: '0 18px 50px rgba(0,0,0,.35)', opacity: 0, transition: 'opacity .15s', transform: 'translateY(0)' }}
                        />
                        <svg id="wcc-map" viewBox="0 0 900 900" preserveAspectRatio="xMidYMid meet"
                             className="w-full h-full" style={{ minHeight: '520px', maxHeight: '720px' }} />
                    </div>
                </div>

                <style jsx>{`
                    .wcc-live-dot {
                        width: 6px; height: 6px; border-radius: 999px; background: #C9A84C;
                        box-shadow: 0 0 0 5px rgba(201,168,76,.08);
                        animation: wccLiveDot 2.4s ease-in-out infinite;
                    }
                    @keyframes wccLiveDot {
                        0%, 100% { box-shadow: 0 0 0 4px rgba(201,168,76,.06); opacity: .65; }
                        50% { box-shadow: 0 0 0 8px rgba(201,168,76,.02); opacity: 1; }
                    }
                    @media (max-width: 1023px) {
                        #wcc-map { min-height: 460px !important; }
                    }
                    @media (prefers-reduced-motion: reduce) {
                        .wcc-live-dot { animation: none !important; }
                    }
                `}</style>
            </section>

            {/* SECTION 3 — WHO WE ARE, asymmetric */}
            <section style={{ background: '#FFFFFF' }} className="px-6 py-24">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.85fr_1.15fr] gap-14 items-start">
                    <div>
                        <span style={{ fontFamily: "'Cormorant SC',serif", color: '#C9A84C', fontSize: '13px', letterSpacing: '.2em' }}>WHO WE ARE</span>
                        <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: '38px', color: '#0A1F44', lineHeight: 1.15, margin: '14px 0 0' }}>
                            Teaching, training &amp; empowering the laity
                        </h2>
                    </div>
                    <div>
                        <p style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: '16px', lineHeight: 1.75, color: '#374151' }}>
                            The West Coast Conference Lay Organization (WCCLO) serves as the teaching, training
                            and empowering body for the laity of the West Coast Conference in the 11th Episcopal
                            District of the African Methodist Episcopal Church. Comprised of {localLayOrgsCount} local lay
                            organizations from churches across the Annual Conference — Lakeland, St. Petersburg, and Tampa —
                            the WCCLO provides training, scholarship, and fellowship opportunities to believers across the coast.
                        </p>
                        <div className="flex gap-4 flex-wrap mt-8">
                            <Link href="/districtsLanding" className="wcc-link-underline">Explore Our Districts →</Link>
                            <span style={{ color: '#D1D5DB' }}>·</span>
                            <a href="https://eedlo.org" className="wcc-link-underline">eedlo.org</a>
                            <span style={{ color: '#D1D5DB' }}>·</span>
                            <a href="https://ameclay.org" className="wcc-link-underline">ameclay.org</a>
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    .wcc-link-underline { color:#0A1F44; font-family:'Source Sans 3',sans-serif; font-weight:600; font-size:14px; border-bottom:1px solid #C9A84C; padding-bottom:2px; }
                    .wcc-link-underline:hover { color:#C9A84C; }
                `}</style>
            </section>

            {/* SECTION 4 — GALLERY, breaks the container */}
            {galleryImages?.length > 0 && (
                <section style={{ background: '#F4EFE2' }} className="py-24">
                    <div className="max-w-[1600px] mx-auto px-6">
                        <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
                            <div>
                                <span style={{ fontFamily: "'Cormorant SC',serif", color: '#C9A84C', fontSize: '13px', letterSpacing: '.2em' }}>MOMENTS FROM OUR CONFERENCE</span>
                                <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: '38px', color: '#0A1F44', margin: '10px 0 0' }}>Gallery</h2>
                            </div>
                            <Link href="/gallery" className="wcc-link-underline" style={{ color: '#0A1F44', fontFamily: "'Source Sans 3',sans-serif", fontWeight: 600, fontSize: '14px', borderBottom: '1px solid #C9A84C', paddingBottom: '2px' }}>
                                View Full Gallery →
                            </Link>
                        </div>
                        <ImageCarousel images={galleryImages} />
                    </div>
                </section>
            )}

            {/* SECTION 5 — EVENTS */}
            {showEventsSection && (
                <section style={{ background: '#FFFFFF' }} className="px-6 py-24">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-12">
                            <span style={{ fontFamily: "'Cormorant SC',serif", color: '#C9A84C', fontSize: '13px', letterSpacing: '.2em' }}>WHAT&apos;S HAPPENING</span>
                            <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: '40px', color: '#0A1F44', margin: '10px 0 0' }}>
                                Upcoming Events &amp; Activities
                            </h2>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-6 mb-4">
                            {!hasQuarterlyEventFromCMS && nextQuarterlyMeeting && (
                                <div style={{ border: '1px solid #C9A84C', background: '#FBF8F0' }} className="rounded-sm p-6">
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: '30px', color: '#C9A84C' }}>
                                            {nextQuarterlyMeeting.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                                        </span>
                                        <span style={{ color: '#5B6B85', fontSize: '15px' }}>{nextQuarterlyMeeting.getFullYear()}</span>
                                    </div>
                                    <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: '20px', color: '#0A1F44', marginBottom: '8px' }}>Quarterly Meeting</h3>
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
                                        <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: '20px', color: '#0A1F44', marginBottom: '8px' }}>{event.title}</h3>
                                        <p style={{ color: '#C9A84C', fontSize: '13px', marginBottom: '10px' }}>{event.location}</p>
                                        <p style={{ color: '#374151', fontSize: '14px', lineHeight: 1.6 }}>{event.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-8">
                            <Link href="/events" className="wcc-link-underline" style={{ color: '#0A1F44', fontFamily: "'Source Sans 3',sans-serif", fontWeight: 600, fontSize: '14px', borderBottom: '1px solid #C9A84C', paddingBottom: '2px' }}>
                                View Full Calendar →
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* SECTION 6 — LEADERSHIP: president oversized, rest recede into a dense strip */}
            <section style={{ background: '#061024' }} className="px-6 py-24">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-14">
                        <span style={{ fontFamily: "'Cormorant SC',serif", color: '#C9A84C', fontSize: '13px', letterSpacing: '.2em' }}>LEADERSHIP</span>
                        <h2 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: '40px', color: '#F4EFE2', margin: '10px 0 0' }}>Conference Officers</h2>
                    </div>

                    <div className="grid lg:grid-cols-[280px_1fr] gap-14">
                        {president && (() => {
                            const initials = president.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
                            const photoUrl = president.photo ? urlFor(president.photo)?.width(560).height(700).url() : null;
                            return (
                                <div>
                                    <div className="relative overflow-hidden rounded-sm mb-4" style={{ aspectRatio: '4/5', background: '#12294F', border: '1px solid rgba(201,168,76,.3)' }}>
                                        {photoUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={photoUrl} alt={president.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span style={{ fontFamily: "'Fraunces',serif", fontSize: '4rem', color: '#C9A84C' }}>{initials}</span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: '22px', color: '#F4EFE2' }}>{president.name}</h3>
                                    <p style={{ color: '#C9A84C', fontSize: '13px', letterSpacing: '.04em', textTransform: 'uppercase' }}>{president.title}</p>
                                </div>
                            );
                        })()}

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 content-start">
                            {restOfficers.map((officer) => {
                                const initials = officer.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
                                const photoUrl = officer.photo ? urlFor(officer.photo)?.width(320).height(400).url() : null;
                                return (
                                    <div key={officer._id}>
                                        <div className="relative overflow-hidden rounded-sm mb-3" style={{ aspectRatio: '3/4', background: '#12294F' }}>
                                            {photoUrl ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={photoUrl} alt={officer.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span style={{ fontFamily: "'Fraunces',serif", fontSize: '1.8rem', color: '#5B6B85' }}>{initials}</span>
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
                        <Link href="/officers" className="wcc-link-underline" style={{ color: '#F4EFE2', fontFamily: "'Source Sans 3',sans-serif", fontWeight: 600, fontSize: '14px', borderBottom: '1px solid #C9A84C', paddingBottom: '2px' }}>
                            {hasMoreOfficers ? 'View All Officers →' : 'View Officers →'}
                        </Link>
                    </div>
                </div>
            </section>

            {/* SECTION 7 — NEWSLETTER + SOCIAL */}
            <section style={{ background: '#F4EFE2' }} className="px-6 py-20">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
                    <div>
                        <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: '28px', color: '#0A1F44', marginBottom: '14px' }}>Our Voice Newsletter</h3>
                        <p style={{ color: '#374151', fontSize: '15px', lineHeight: 1.7, marginBottom: '26px' }}>
                            Stay up to date with our quarterly newsletter covering history, upcoming events,
                            and happenings in local churches.
                        </p>
                        <a href={newsletterPdfUrl} target="_blank" rel="noopener noreferrer" className="wcc-cta-gilt-light">Download Vol. 1</a>
                    </div>
                    <div>
                        <h3 style={{ fontFamily: "'Fraunces',serif", fontWeight: 600, fontSize: '28px', color: '#0A1F44', marginBottom: '14px' }}>Get Social with the WCCLO</h3>
                        <p style={{ color: '#374151', fontSize: '15px', lineHeight: 1.7, marginBottom: '26px' }}>
                            See what&apos;s happening and find out how you can take part in our activities on our Facebook page.
                        </p>
                        <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="wcc-cta-navy">
                            <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Follow @WestCoastLay
                        </a>
                    </div>
                </div>
                <style jsx>{`
                    .wcc-cta-gilt-light { background:#C9A84C; color:#061024; padding:12px 28px; font-family:'Source Sans 3',sans-serif; font-weight:600; font-size:13px; letter-spacing:.06em; text-transform:uppercase; border-radius:2px; display:inline-block; transition:box-shadow .2s; }
                    .wcc-cta-gilt-light:hover { box-shadow:0 8px 24px rgba(201,168,76,.35); }
                    .wcc-cta-navy { background:#0A1F44; color:#F4EFE2; padding:12px 28px; font-family:'Source Sans 3',sans-serif; font-weight:600; font-size:13px; letter-spacing:.06em; text-transform:uppercase; border-radius:2px; display:inline-flex; align-items:center; transition:background .2s; }
                    .wcc-cta-navy:hover { background:#0d2a5a; }
                `}</style>
            </section>
        </>
    );
}

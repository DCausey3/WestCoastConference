'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { DISTRICT_INFO, districtSlugFromLabel } from './constants';

const TOPOLOGY_URL = '/data/counties-10m.json';

export type ChurchRecord = {
    _id: string;
    name?: string;
    county?: string;
    district?: string; // free text from Sanity, e.g. "Tampa District"
};

interface DistrictMapProps {
    churches: ChurchRecord[];
}

// Derive county -> district slug and per-district church counts directly from
// Sanity church records, instead of a hardcoded list.
function useDistrictData(churches: ChurchRecord[]) {
    return useMemo(() => {
        const countyToDistrict: Record<string, string> = {};
        const churchCounts: Record<string, number> = { lakeland: 0, stpete: 0, tampa: 0 };

        for (const church of churches) {
            const slug = districtSlugFromLabel(church.district);
            if (!slug) continue;

            churchCounts[slug] = (churchCounts[slug] ?? 0) + 1;

            if (church.county) {
                // First match wins per county; counties shouldn't span districts,
                // but if the data disagrees we keep whichever we saw first.
                if (!countyToDistrict[church.county]) {
                    countyToDistrict[church.county] = slug;
                }
            }
        }

        return { countyToDistrict, churchCounts };
    }, [churches]);
}

export default function DistrictMap({ churches }: DistrictMapProps) {
    const tooltipRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { countyToDistrict, churchCounts } = useDistrictData(churches);

    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            const mapNode = document.querySelector('#wcc-map');
            const mapSection = document.querySelector('#wcc-map-section');
            if (!mapNode || !mapSection) return;

            const res = await fetch(TOPOLOGY_URL);
            if (!res.ok) {
                console.error('Failed to load county topology:', res.status);
                return;
            }

            const text = await res.text();
            let us: any;
            try {
                us = JSON.parse(text);
            } catch (err) {
                console.error('JSON parse failed:', err);
                return;
            }

            if (cancelled || !us?.objects?.counties) {
                console.error('missing objects.counties', us);
                return;
            }

            const countiesFeature = topojson.feature(us as any, us.objects.counties as any) as any;
            const flCounties = countiesFeature.features.filter((d: any) => d.id.toString().startsWith('12'));
            const florida = { type: 'FeatureCollection', features: flCounties };

            const districtOf = (name: string) => countyToDistrict[name] ?? null;

            const svg = d3.select('#wcc-map');
            svg.selectAll('*').remove();
            svg.attr('role', 'img').attr('aria-label', 'Interactive map of West Coast Conference districts across Florida');

            const defs = svg.append('defs');

            Object.entries(DISTRICT_INFO).forEach(([slug, info]) => {
                const grad = defs
                    .append('linearGradient')
                    .attr('id', `served-gradient-${slug}`)
                    .attr('x1', '0%')
                    .attr('y1', '100%')
                    .attr('x2', '100%')
                    .attr('y2', '0%');
                grad.append('stop').attr('offset', '0%').attr('stop-color', info.navy);
                grad.append('stop').attr('offset', '48%').attr('stop-color', info.accent);
                grad.append('stop').attr('offset', '100%').attr('stop-color', info.accent);
            });

            const glow = defs
                .append('filter')
                .attr('id', 'gold-glow')
                .attr('x', '-80%')
                .attr('y', '-80%')
                .attr('width', '260%')
                .attr('height', '260%');
            glow.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
            glow
                .append('feMerge')
                .selectAll('feMergeNode')
                .data(['blur', 'SourceGraphic'])
                .join('feMergeNode')
                .attr('in', (d: string) => d);

            const proj = d3.geoMercator().fitExtent([[70, 55], [830, 845]], florida as any);
            const path = d3.geoPath().projection(proj);

            const baseLayer = svg.append('g').attr('class', 'wcc-base-layer');
            const territoryLayer = svg.append('g').attr('class', 'wcc-territory-layer');

            const paths = baseLayer
                .selectAll('path')
                .data(flCounties)
                .join('path')
                .attr('d', path as any)
                .attr('fill', (d: any) => {
                    const slug = districtOf(d.properties.name);
                    return slug ? `url(#served-gradient-${slug})` : '#0A1931';
                })
                .attr('fill-opacity', (d: any) => (districtOf(d.properties.name) ? 0 : 0.56))
                .attr('stroke', '#71809A')
                .attr('stroke-width', 0.45)
                .attr('stroke-opacity', 0.16)
                .style('cursor', (d: any) => (districtOf(d.properties.name) ? 'pointer' : 'default'));

            const districtPaths = territoryLayer
                .selectAll('path')
                .data(flCounties.filter((d: any) => districtOf(d.properties.name)))
                .join('path')
                .attr('d', path as any)
                .attr('fill', (d: any) => `url(#served-gradient-${districtOf(d.properties.name)})`)
                .attr('fill-opacity', 0)
                .attr('stroke', (d: any) => DISTRICT_INFO[districtOf(d.properties.name)!].accent)
                .attr('stroke-width', 1)
                .attr('stroke-opacity', 0)
                .style('cursor', 'pointer');

            const districtMesh = topojson.mesh(us as any, us.objects.counties as any, (a: any, b: any) => {
                const aD = a && districtOf(a.properties?.name);
                const bD = b && districtOf(b.properties?.name);
                if (!aD && !bD) return false;
                return aD !== bD;
            });
            const boundary = territoryLayer
                .append('path')
                .datum(districtMesh)
                .attr('d', path as any)
                .attr('fill', 'none')
                .attr('stroke', '#F0D98A')
                .attr('stroke-width', 1.6)
                .attr('stroke-linecap', 'round')
                .attr('stroke-linejoin', 'round')
                .attr('filter', 'url(#gold-glow)')
                .attr('stroke-opacity', 0);

            // No always-on district labels — district names live in the legend
            // and in the hover tooltip, so there's nothing to collide on the map itself.

            let hasEntered = false;
            const play = () => {
                if (hasEntered || cancelled) return;
                hasEntered = true;

                paths
                    .transition()
                    .delay((d: any) => 80 + path.centroid(d as any)[0] * 0.7)
                    .duration(750)
                    .ease(d3.easeCubicOut)
                    .attr('fill-opacity', (d: any) => (districtOf(d.properties.name) ? 0.18 : 0.56));

                districtPaths
                    .attr('stroke-dasharray', function (this: any) {
                        const len = this.getTotalLength ? this.getTotalLength() : 800;
                        return `${len} ${len}`;
                    })
                    .attr('stroke-dashoffset', function (this: any) {
                        return this.getTotalLength ? this.getTotalLength() : 800;
                    })
                    .transition()
                    .delay((d: any, i: number) => 500 + i * 60)
                    .duration(900)
                    .ease(d3.easeCubicOut)
                    .attr('fill-opacity', 0.82)
                    .attr('stroke-opacity', 0.8)
                    .attr('stroke-dashoffset', 0);

                boundary
                    .attr('stroke-dasharray', function (this: SVGPathElement) {
                        const len = this.getTotalLength ? this.getTotalLength() : 1800;
                        return `${len} ${len}`;
                    })
                    .attr('stroke-dashoffset', function (this: SVGPathElement) {
                        return this.getTotalLength ? this.getTotalLength() : 1800;
                    })
                    .transition()
                    .delay(650)
                    .duration(1500)
                    .ease(d3.easeCubicInOut)
                    .attr('stroke-dashoffset', 0)
                    .attr('stroke-opacity', 0.9);
            };

            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries.some((entry) => entry.isIntersecting)) play();
                },
                { threshold: 0.28 }
            );
            observer.observe(mapSection);

            const highlightDistrict = (slug: string | null) => {
                districtPaths
                    .transition()
                    .duration(180)
                    .attr('fill-opacity', (d: any) => (districtOf(d.properties.name) === slug ? 1 : 0.82))
                    .attr('stroke-width', (d: any) => (districtOf(d.properties.name) === slug ? 1.6 : 1))
                    .attr('stroke-opacity', (d: any) => (districtOf(d.properties.name) === slug ? 1 : 0.8));
            };

            [paths, districtPaths].forEach((sel) => {
                sel
                    .on('mouseenter', function (event: MouseEvent, d: any) {
                        const slug = districtOf(d.properties.name);
                        if (!slug) return;
                        highlightDistrict(slug);
                    })
                    .on('mousemove', function (event: MouseEvent, d: any) {
                        const slug = districtOf(d.properties.name);
                        const tooltip = tooltipRef.current;
                        if (!tooltip) return;
                        const host = mapNode.getBoundingClientRect();
                        tooltip.style.opacity = '1';
                        tooltip.style.left = `${event.clientX - host.left + 16}px`;
                        tooltip.style.top = `${event.clientY - host.top - 64}px`;

                        if (slug) {
                            const info = DISTRICT_INFO[slug];
                            const churchCount = churchCounts[slug] ?? 0;
                            tooltip.innerHTML = `
                            <div style="font-family:'Source Sans 3',sans-serif;font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:${info.accent};margin-bottom:5px;">
                                ${info.label}
                            </div>
                            <div style="font-family:'Fraunces',serif;font-size:16px;line-height:1.1;color:#F4EFE2;margin-bottom:4px;">${d.properties.name} County</div>
                            <div style="font-family:'Source Sans 3',sans-serif;font-size:11px;color:#9BA9BC;">
                                ${churchCount} ${churchCount === 1 ? 'church' : 'churches'} · click to view district
                            </div>
                        `;
                        } else {
                            tooltip.innerHTML = `
                            <div style="font-family:'Source Sans 3',sans-serif;font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:#71809A;margin-bottom:5px;">
                                Outside Territory
                            </div>
                            <div style="font-family:'Fraunces',serif;font-size:16px;line-height:1.1;color:#F4EFE2;">${d.properties.name} County</div>
                        `;
                        }
                    })
                    .on('mouseleave', function () {
                        highlightDistrict(null);
                        if (tooltipRef.current) tooltipRef.current.style.opacity = '0';
                    })
                    .on('click', function (event: MouseEvent, d: any) {
                        const slug = districtOf(d.properties.name);
                        if (slug) router.push(`/districts/${slug}`);
                    });
            });

            return () => observer.disconnect();
        };

        let cleanup: (() => void) | undefined;
        init().then((fn) => {
            cleanup = fn;
        });

        return () => {
            cancelled = true;
            cleanup?.();
            d3.select('#wcc-map').selectAll('*').interrupt();
        };
    }, [router, countyToDistrict, churchCounts]);

    return (
        <div className="relative min-h-[520px] lg:min-h-[680px]">
            <div
                ref={tooltipRef}
                className="absolute z-20 px-4 py-3 pointer-events-none rounded-sm"
                style={{
                    background: 'rgba(6,16,36,.96)',
                    border: '1px solid rgba(201,168,76,.65)',
                    boxShadow: '0 18px 50px rgba(0,0,0,.35)',
                    opacity: 0,
                    transition: 'opacity .15s',
                }}
            />
            <svg
                id="wcc-map"
                viewBox="0 0 900 900"
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full"
                style={{ minHeight: '520px', maxHeight: '720px' }}
            />
        </div>
    );
}

export function DistrictLegend({ churches }: { churches: ChurchRecord[] }) {
    const { churchCounts } = useDistrictData(churches);

    return (
        <div className="flex flex-col gap-3 max-w-[420px]">
            {Object.entries(DISTRICT_INFO).map(([slug, info]) => (
                <Link key={slug} href={`/districts/${slug}`} className="flex items-center gap-3 group">
                    <span
                        className="w-3 h-3 rounded-sm shrink-0 transition-transform group-hover:scale-110"
                        style={{ background: info.accent }}
                    />
                    <span
                        style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: '13px', color: '#C5CEDC', fontWeight: 600 }}
                        className="group-hover:text-[#F0D98A] transition-colors"
                    >
                        {info.label}
                    </span>
                    <span style={{ color: '#5B6B85', fontSize: '12px' }}>
                        {churchCounts[slug] ?? 0} churches
                    </span>
                    <ChevronRight
                        className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: info.accent }}
                    />
                </Link>
            ))}
        </div>
    );
}

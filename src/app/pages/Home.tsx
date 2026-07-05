import { Link } from 'react-router';
import { useEffect, useRef } from "react";
import congregationPhoto from '/src/imports/img_1652.jpg';

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

export default function Home() {
  const tooltipRef = useRef<HTMLDivElement>(null);

  const upcomingEvents = [
    {
      date: "JUN 15",
      year: "2026",
      title: "Annual West Coast Conference",
      location: "Tampa, FL",
      description: "Join us for workshops, training sessions, and fellowship."
    },
    {
      date: "JUL 20",
      year: "2026",
      title: "Leadership Development Workshop",
      location: "St. Petersburg, FL",
      description: "Enhance your leadership skills and learn new strategies."
    },
    {
      date: "AUG 5",
      year: "2026",
      title: "District Meeting - Lakeland",
      location: "Lakeland, FL",
      description: "Lakeland District quarterly meeting and training."
    }
  ];

  useEffect(() => {
    const init = async () => {
      // FIX 1: was calling loadScripts() (the inner async fn) instead of loadScript() helper
      await Promise.all([
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js'),
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js'),
      ]);

      const d3 = (window as any).d3;
      const topojson = (window as any).topojson;

      const SERVED = new Set([
        'DeSoto', 'Hardee', 'Hillsborough', 'Highlands',
        'Manatee', 'Pinellas', 'Polk', 'Sarasota'
      ]);

      const res = await fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json');
      const us = await res.json();
      const countiesFeature = topojson.feature(us, us.objects.counties);
      const flCounties = countiesFeature.features.filter((d: any) =>
        d.id.toString().startsWith('12')
      );

      const svg = d3.select('#wcc-map');
      svg.selectAll('*').remove();

      const proj = d3.geoMercator().fitSize([440, 520], {
        type: 'FeatureCollection',
        features: flCounties,
      });
      const path = d3.geoPath().projection(proj);

      svg.selectAll('path')
        .data(flCounties)
        .join('path')
        .attr('d', path)
        .attr('fill', (d: any) => SERVED.has(d.properties.name) ? '#C9A84C' : '#1a2a44')
        .attr('fill-opacity', (d: any) => SERVED.has(d.properties.name) ? 0.88 : 0.7)
        .attr('stroke', '#C9A84C')
        .attr('stroke-width', (d: any) => SERVED.has(d.properties.name) ? 1 : 0.3)
        .attr('stroke-opacity', (d: any) => SERVED.has(d.properties.name) ? 0.9 : 0.25)
        .style('cursor', 'pointer')
        .on('mousemove', function (event: MouseEvent, d: any) {
          const name = d.properties.name;
          const tooltip = tooltipRef.current;
          if (!tooltip) return;
          tooltip.style.opacity = '1';
          tooltip.style.left = event.offsetX + 10 + 'px';
          tooltip.style.top = event.offsetY - 36 + 'px';
          tooltip.innerHTML = `<strong>${name} County</strong>${
            SERVED.has(name)
              ? `<br/><span style="color:#C9A84C;font-size:10px">West Coast Conference</span>`
              : `<br/><span style="color:#6b7280;font-size:10px">Not served</span>`
          }`;
        })
        .on('mouseleave', () => {
          if (tooltipRef.current) tooltipRef.current.style.opacity = '0';
        });
    };

    init();
  }, []);

  return (
    <>
      {/* SECTION 1: HERO */}
      <section className="bg-[#0A1F44] relative" style={{ minHeight: '900px' }}>
        {/* FIX 2: grid div was never closed — the diagonal SVG was inside the grid, not the section */}
        <div className="max-w-[1440px] mx-auto px-6 py-20 grid lg:grid-cols-[55%_45%] gap-12 items-center min-h-[900px]">

          {/* LEFT COLUMN */}
          <div style={{ paddingLeft: '120px' }}>
            <div className="text-[#C9A84C] mb-3" style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 600,
              fontSize: '12px',
              letterSpacing: '0.12em'
            }}>
              11TH EPISCOPAL DISTRICT | WEST COAST CONFERENCE
            </div>
            <div className="h-0.5 w-12 bg-[#C9A84C] mb-6"></div>

            <h1 className="text-white mb-6" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '72px',
              lineHeight: '1.1',
              fontWeight: 700,
              maxWidth: '520px'
            }}>
              As Lay Persons Working With God...
            </h1>

            <p className="text-white mb-5" style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 300,
              fontSize: '24px',
              letterSpacing: '0.06em',
              opacity: 0.8
            }}>
              Teaching. Training. Empowering.
            </p>

            <p className="text-white mb-10" style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '18px',
              opacity: 0.85,
              maxWidth: '480px',
              lineHeight: '1.6'
            }}>
              Serving 56 lay organizations across three districts of the West Coast Conference
              in the 11th Episcopal District of the African Methodist Episcopal Church.
            </p>

            <div className="flex gap-4">
              <Link
                to="/about"
                className="bg-[#C9A84C] text-[#0A1F44] px-8 py-3 rounded hover:bg-[#d4b76a] transition-colors uppercase tracking-wider"
                style={{ fontSize: '14px', fontWeight: 600 }}
              >
                Learn More
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded hover:bg-white/10 transition-colors uppercase tracking-wider"
                style={{ fontSize: '14px', fontWeight: 600 }}
              >
                Get Involved
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN — FIX 3: was entirely missing from the JSX */}
          <div className="flex flex-col items-center">
            <div className="text-[#C9A84C] mb-4 text-center" style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 600,
              fontSize: '12px',
              letterSpacing: '0.12em'
            }}>
              WEST COAST CONFERENCE SERVICE AREA
            </div>

            <div
              className="relative border-2 border-[#C9A84C] rounded-lg overflow-hidden"
              style={{ background: '#060f22', width: '440px', height: '520px' }}
            >
              {/* Tooltip */}
              <div
                ref={tooltipRef}
                className="absolute z-10 rounded-lg px-3 py-2 pointer-events-none text-white"
                style={{
                  background: 'rgba(6,15,34,0.95)',
                  border: '1px solid #C9A84C',
                  opacity: 0,
                  transition: 'opacity 0.15s',
                  fontSize: '12px',
                }}
              />

              {/* D3 renders into this SVG via id selector */}
              <svg id="wcc-map" width="100%" viewBox="0 0 440 520" style={{ display: 'block' }} />

              {/* Compass rose */}
              <svg
                className="absolute bottom-3 right-3"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="white"
                opacity={0.5}
              >
                <path d="M12 2L15 10L12 8L9 10L12 2Z" />
                <path d="M12 22L9 14L12 16L15 14L12 22Z" />
                <path d="M2 12L10 9L8 12L10 15L2 12Z" />
                <path d="M22 12L14 15L16 12L14 9L22 12Z" />
              </svg>
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-3" style={{ fontSize: '11px' }}>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#C9A84C' }} />
                <span style={{ color: '#C9A84C' }}>Service counties</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#1a2a44' }} />
                <span className="text-gray-400">Other counties</span>
              </div>
            </div>
          </div>

        </div>{/* end grid */}

        {/* Diagonal divider */}
        <svg
          className="absolute bottom-0 w-full"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          style={{ height: '100px' }}
        >
          <polygon points="0,100 1440,0 1440,100" fill="white" />
        </svg>
      </section>

      {/* SECTION 2: IMPACT STATS */}
      <section className="bg-white px-6 py-24">
        <div className="max-w-7xl mx-auto flex justify-center gap-12 flex-wrap">
          <div className="text-center">
            <div className="text-[#0A1F44] mb-2" style={{ fontSize: '64px', fontWeight: 700 }}>56</div>
            <div className="h-1 w-16 bg-[#C9A84C] mx-auto mb-2"></div>
            <div className="text-gray-600" style={{ fontSize: '14px' }}>Local Lay Organizations</div>
          </div>
          <div className="text-center">
            <div className="text-[#0A1F44] mb-2" style={{ fontSize: '64px', fontWeight: 700 }}>3</div>
            <div className="h-1 w-16 bg-[#C9A84C] mx-auto mb-2"></div>
            <div className="text-gray-600" style={{ fontSize: '14px' }}>Annual Conference Districts</div>
          </div>
          <div className="text-center">
            <div className="text-[#0A1F44] mb-2" style={{ fontSize: '64px', fontWeight: 700 }}>8</div>
            <div className="h-1 w-16 bg-[#C9A84C] mx-auto mb-2"></div>
            <div className="text-gray-600" style={{ fontSize: '14px' }}>Florida Counties Served</div>
          </div>
          <div className="text-center">
            <div className="text-[#0A1F44] mb-2" style={{ fontSize: '64px', fontWeight: 700 }}>1816</div>
            <div className="h-1 w-16 bg-[#C9A84C] mx-auto mb-2"></div>
            <div className="text-gray-600" style={{ fontSize: '14px' }}>Year A.M.E. Founded</div>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHO WE ARE */}
      <section className="bg-[#F4F6FA] px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-[#C9A84C] mb-3" style={{
            fontFamily: "'Source Sans 3', sans-serif",
            fontWeight: 600,
            fontSize: '12px',
            letterSpacing: '0.12em'
          }}>
            WHO WE ARE
          </div>

          <h2 className="text-[#0A1F44] mb-5" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '42px',
            fontWeight: 700,
            lineHeight: '1.2'
          }}>
            Teaching, Training & Empowering the Laity
          </h2>

          <p className="text-gray-700 mb-8" style={{ fontSize: '16px', lineHeight: '1.7' }}>
            The West Coast Conference Lay Organization (WCCLO) serves as the teaching, training
            and empowering body for the laity of the West Coast Conference in the 11th Episcopal
            District of the African Methodist Episcopal Church. Comprised of 56 local lay
            organizations from churches in three Districts of the Annual Conference (Lakeland,
            St. Petersburg and Tampa), the WCCLO strives to provide dynamic training opportunities
            to its members, scholarship opportunities to our youth and fellowship opportunities
            to all believers in Christ.
          </p>

          <Link
            to="/about"
            className="inline-block border-2 border-[#0A1F44] text-[#0A1F44] px-8 py-3 rounded hover:bg-[#0A1F44] hover:text-white transition-colors uppercase tracking-wider"
            style={{ fontSize: '14px', fontWeight: 600 }}
          >
            Our Story
          </Link>

          <p className="mt-4 text-gray-500" style={{ fontSize: '13px' }}>
            To learn more visit{' '}
            <a href="https://eedlo.org" className="text-[#C9A84C] hover:underline">eedlo.org</a>
            {' '}|{' '}
            <a href="https://ameclay.org" className="text-[#C9A84C] hover:underline">ameclay.org</a>
          </p>
        </div>
      </section>

      {/* SECTION 4: THREE DISTRICTS */}
      <section className="bg-[#0A1F44] relative px-6 py-24">
        <svg className="absolute top-0 w-full" viewBox="0 0 1440 100" preserveAspectRatio="none" style={{ height: '100px' }}>
          <polygon points="0,0 1440,100 1440,0" fill="#F4F6FA" />
        </svg>

        <div className="max-w-7xl mx-auto pt-12">
          <div className="text-center mb-12">
            <div className="text-[#C9A84C] mb-3" style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 600,
              fontSize: '12px',
              letterSpacing: '0.12em'
            }}>
              ANNUAL CONFERENCE DISTRICTS
            </div>
            <h2 className="text-white mx-auto" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '52px',
              fontWeight: 700,
              maxWidth: '800px'
            }}>
              Lakeland. St. Petersburg. Tampa.
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Lakeland District */}
            <div className="bg-white rounded-lg p-8 border-t-4 border-[#0A1F44]">
              <h3 className="text-[#0A1F44] mb-2" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '28px',
                fontWeight: 700
              }}>
                Lakeland District
              </h3>
              <p className="text-gray-600 mb-4 italic">"The Lively Lakeland District"</p>
              <p className="text-gray-700 mb-4"><strong>President:</strong> Emily Davis</p>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-[#E8EDF5] text-[#0A1F44] px-3 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 600 }}>Polk</span>
                <span className="bg-[#E8EDF5] text-[#0A1F44] px-3 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 600 }}>Hardee</span>
                <span className="bg-[#E8EDF5] text-[#0A1F44] px-3 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 600 }}>DeSoto</span>
              </div>
            </div>

            {/* St. Petersburg District */}
            <div className="bg-white rounded-lg p-8 border-t-4 border-[#0A1F44]">
              <h3 className="text-[#0A1F44] mb-2" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '28px',
                fontWeight: 700
              }}>
                St. Petersburg District
              </h3>
              <p className="text-gray-600 mb-4 italic">"The Sizzling Sweetie 16"</p>
              <p className="text-gray-700 mb-4"><strong>President:</strong> Linnell Baker</p>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-[#E8EDF5] text-[#0A1F44] px-3 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 600 }}>Pinellas</span>
                <span className="bg-[#E8EDF5] text-[#0A1F44] px-3 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 600 }}>Manatee</span>
                <span className="bg-[#E8EDF5] text-[#0A1F44] px-3 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 600 }}>Sarasota</span>
              </div>
            </div>

            {/* Tampa District */}
            <div className="bg-white rounded-lg p-8 border-t-4 border-[#0A1F44]">
              <h3 className="text-[#0A1F44] mb-2" style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '28px',
                fontWeight: 700
              }}>
                Tampa District
              </h3>
              <p className="text-gray-600 mb-4 italic">"The Trending Tremendous Tampa District"</p>
              <p className="text-gray-700 mb-4"><strong>President:</strong> Sandra Mitchell</p>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-[#E8EDF5] text-[#0A1F44] px-3 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 600 }}>Hillsborough</span>
                <span className="bg-[#E8EDF5] text-[#0A1F44] px-3 py-1 rounded-full" style={{ fontSize: '12px', fontWeight: 600 }}>Highland</span>
              </div>
            </div>
          </div>
        </div>

        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 100" preserveAspectRatio="none" style={{ height: '100px' }}>
          <polygon points="0,100 1440,0 1440,100" fill="white" />
        </svg>
      </section>

      {/* SECTION 5: UPCOMING EVENTS */}
      <section className="bg-white px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[#C9A84C] mb-3" style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 600,
              fontSize: '12px',
              letterSpacing: '0.12em'
            }}>
              WHAT'S HAPPENING
            </div>
            <h2 className="text-[#0A1F44]" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '48px',
              fontWeight: 700
            }}>
              Upcoming Events & Activities
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            {upcomingEvents.map((event, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-[#C9A84C]" style={{ fontSize: '32px', fontWeight: 700 }}>{event.date}</span>
                  <span className="text-gray-500" style={{ fontSize: '16px' }}>{event.year}</span>
                </div>
                <h3 className="text-[#0A1F44] mb-2" style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '22px',
                  fontWeight: 600
                }}>
                  {event.title}
                </h3>
                <p className="text-[#C9A84C] mb-3" style={{ fontSize: '14px' }}>
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </p>
                <p className="text-gray-700" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  {event.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mb-12">
            <Link
              to="/events"
              className="inline-block bg-[#0A1F44] text-white px-8 py-3 rounded hover:bg-[#0d2a5a] transition-colors uppercase tracking-wider"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              View Full Calendar
            </Link>
          </div>

        
        </div>
      </section>

      {/* SECTION 6: OFFICERS */}
      <section className="bg-white px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-[#C9A84C] mb-3" style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 600,
              fontSize: '12px',
              letterSpacing: '0.12em'
            }}>
              LEADERSHIP
            </div>
            <h2 className="text-[#0A1F44] mb-4" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '48px',
              fontWeight: 700
            }}>
              Conference Officers
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto" style={{ fontSize: '1.125rem', lineHeight: '1.6' }}>
              Meet the dedicated leaders serving the West Coast Conference Lay Organization
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[
              { name: "Lolita D. Brown", title: "President" },
              { name: "Alicia Dixon", title: "First Vice President" },
              { name: "MacArthur Carpenter", title: "Treasurer" },
              { name: "Emma McGriff", title: "Recording Secretary" }
            ].map((officer, idx) => {
              const initials = officer.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
              const colors = ['#0A1F44', '#1a3a5e', '#2a4a6e', '#3a5a7e'];
              const bgColor = colors[idx % colors.length];

              return (
                <div key={idx} className="text-center group">
                  <div className="rounded-lg mb-3 overflow-hidden relative" style={{ aspectRatio: '3/4', backgroundColor: bgColor }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white" style={{ fontSize: '3rem', fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>
                        {initials}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-[#0A1F44] mb-1" style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '1.125rem',
                    fontWeight: 600
                  }}>
                    {officer.name}
                  </h3>
                  <p className="text-[#C9A84C] text-sm">{officer.title}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              to="/officers"
              className="inline-block border-2 border-[#0A1F44] text-[#0A1F44] px-8 py-3 rounded hover:bg-[#0A1F44] hover:text-white transition-colors uppercase tracking-wider"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              View All Officers
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 7: NEWSLETTER + SOCIAL */}
      <section className="bg-[#E8EDF5] px-6 py-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">
          <div>
            <h3 className="text-[#0A1F44] mb-4" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '32px',
              fontWeight: 700
            }}>
              Our Voice Newsletter
            </h3>
            <p className="text-gray-700 mb-8" style={{ fontSize: '16px', lineHeight: '1.6' }}>
              Stay up to date with our quarterly newsletter covering history, upcoming events,
              and happenings in local churches.
            </p>
            <button
              className="bg-[#C9A84C] text-[#0A1F44] px-8 py-3 rounded hover:bg-[#d4b76a] transition-colors uppercase tracking-wider"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              Download Vol. 1
            </button>
          </div>

          <div>
            <h3 className="text-[#0A1F44] mb-4" style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '32px',
              fontWeight: 700
            }}>
              Get Social with the WCCLO!
            </h3>
            <p className="text-gray-700 mb-8" style={{ fontSize: '16px', lineHeight: '1.6' }}>
              See what's happening and find out how you can take part in our activities on our Facebook page.
            </p>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0A1F44] text-white px-8 py-3 rounded hover:bg-[#0d2a5a] transition-colors uppercase tracking-wider"
              style={{ fontSize: '14px', fontWeight: 600 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Follow @WestCoastLay
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

// Keep this in sync with the SLUG_BY_NAME map in DistrictsLanding.tsx
const DISTRICTS = [
    { name: 'Lakeland District', slug: 'lakeland' },
    { name: 'St. Petersburg District', slug: 'stpete' },
    { name: 'Tampa District', slug: 'tampa' },
];

const navLinkClass = "text-[#0A1F44] hover:text-[#C9A84C] transition-colors";

export default function Nav() {
    const [districtsOpen, setDistrictsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDistrictsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex justify-center gap-8 flex-wrap items-center">
            <Link href="/" className={navLinkClass}>Home</Link>
            <Link href="/about" className={navLinkClass}>About</Link>
            <Link href="/officers" className={navLinkClass}>Officers</Link>
            <Link href="/churches" className={navLinkClass}>Churches</Link>

            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setDistrictsOpen((open) => !open)}
                    className={`flex items-center gap-1 ${navLinkClass}`}
                    aria-expanded={districtsOpen}
                    aria-haspopup="true"
                >
                    Districts
                    <ChevronDown
                        className="w-4 h-4 transition-transform"
                        style={{ transform: districtsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                </button>

                {districtsOpen && (
                    <div
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
                        style={{ minWidth: '200px' }}
                    >
                        {DISTRICTS.map((district) => (
                            <Link
                                key={district.slug}
                                href={`/districts/${district.slug}`}
                                onClick={() => setDistrictsOpen(false)}
                                className="block px-4 py-2 text-[#0A1F44] hover:bg-[#F4F6FA] hover:text-[#C9A84C] transition-colors"
                                style={{ fontSize: '14px' }}
                            >
                                {district.name}
                            </Link>
                        ))}
                        <div className="h-px bg-gray-100 my-1" />
                        <Link
                            href="/districtsLanding"
                            onClick={() => setDistrictsOpen(false)}
                            className="block px-4 py-2 text-[#C9A84C] hover:bg-[#F4F6FA] transition-colors"
                            style={{ fontSize: '14px', fontWeight: 600 }}
                        >
                            All Districts →
                        </Link>
                    </div>
                )}
            </div>

            <Link href="/events" className={navLinkClass}>Events</Link>
            <Link href="/gallery" className={navLinkClass}>Gallery</Link>
            <Link href="/resources" className={navLinkClass}>Resources</Link>
            <Link href="/contact" className={navLinkClass}>Contact</Link>
        </div>
    );
}
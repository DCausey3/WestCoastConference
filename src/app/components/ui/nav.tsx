'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

// Keep this in sync with the SLUG_BY_NAME map in DistrictsLanding.tsx
const DISTRICTS = [
    { name: 'Lakeland District', slug: 'lakeland' },
    { name: 'St. Petersburg District', slug: 'stpete' },
    { name: 'Tampa District', slug: 'tampa' },
];

const navLinkClass = "text-[#0A1F44] hover:text-[#C9A84C] transition-colors";

const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/officers', label: 'Officers' },
    { href: '/churches', label: 'Churches' },
];

const TAIL_LINKS = [
    { href: '/events', label: 'Events' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/resources', label: 'Resources' },
    { href: '/contact', label: 'Contact' },
];

export default function Nav() {
    const [districtsOpen, setDistrictsOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileDistrictsOpen, setMobileDistrictsOpen] = useState(false);
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

    // Close the mobile menu whenever the viewport grows back to desktop size
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth >= 768) {
                setMobileOpen(false);
                setMobileDistrictsOpen(false);
            }
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Lock body scroll while the mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    return (
        <>
            {/* Desktop nav */}
            <div className="hidden md:flex justify-center gap-8 flex-wrap items-center">
                {NAV_LINKS.map((link) => (
                    <Link key={link.href} href={link.href} className={navLinkClass}>
                        {link.label}
                    </Link>
                ))}

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

                {TAIL_LINKS.map((link) => (
                    <Link key={link.href} href={link.href} className={navLinkClass}>
                        {link.label}
                    </Link>
                ))}
            </div>

            {/* Mobile hamburger button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden flex items-center justify-center text-[#0A1F44]"
                aria-label="Open menu"
                aria-expanded={mobileOpen}
            >
                <Menu className="w-7 h-7" />
            </button>

            {/* Mobile menu overlay */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <span
                            className="text-[#0A1F44]"
                            style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.125rem', fontWeight: 700 }}
                        >
                            Menu
                        </span>
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="text-[#0A1F44]"
                            aria-label="Close menu"
                        >
                            <X className="w-7 h-7" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-1">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="py-3 text-lg text-[#0A1F44] border-b border-gray-50"
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Districts accordion */}
                        <button
                            onClick={() => setMobileDistrictsOpen((open) => !open)}
                            className="py-3 text-lg text-[#0A1F44] border-b border-gray-50 flex items-center justify-between"
                            aria-expanded={mobileDistrictsOpen}
                        >
                            Districts
                            <ChevronDown
                                className="w-5 h-5 transition-transform"
                                style={{ transform: mobileDistrictsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                            />
                        </button>
                        {mobileDistrictsOpen && (
                            <div className="flex flex-col pl-4 border-b border-gray-50">
                                {DISTRICTS.map((district) => (
                                    <Link
                                        key={district.slug}
                                        href={`/districts/${district.slug}`}
                                        onClick={() => setMobileOpen(false)}
                                        className="py-2.5 text-[#0A1F44]/80"
                                    >
                                        {district.name}
                                    </Link>
                                ))}
                                <Link
                                    href="/districtsLanding"
                                    onClick={() => setMobileOpen(false)}
                                    className="py-2.5 text-[#C9A84C] font-semibold"
                                >
                                    All Districts →
                                </Link>
                            </div>
                        )}

                        {TAIL_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="py-3 text-lg text-[#0A1F44] border-b border-gray-50"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
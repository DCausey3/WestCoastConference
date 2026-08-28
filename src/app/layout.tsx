import type { Metadata } from 'next';
import Link from 'next/link';
import '@/styles/index.css';
import Image from 'next/image';
import Nav from "@/app/components/ui/nav";
import { Fraunces, Cormorant_SC, Source_Sans_3 } from 'next/font/google';

const fraunces = Fraunces({
    subsets: ['latin'],
    variable: '--font-fraunces',
    weight: ['500', '600'],
    style: ['normal', 'italic'],
    display: 'swap',
});

const cormorantSC = Cormorant_SC({
    subsets: ['latin'],
    variable: '--font-cormorant-sc',
    weight: ['500', '600'],
    display: 'swap',
});

const sourceSans = Source_Sans_3({
    subsets: ['latin'],
    variable: '--font-source-sans',
    weight: ['400', '600'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'West Coast Conference Lay Organization',
    description: 'The West Coast Conference Lay Organization serves the AME Church community across Florida.',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${fraunces.variable} ${cormorantSC.variable} ${sourceSans.variable}`}>
        <body style={{ fontFamily: "var(--font-source-sans), sans-serif" }}>
        <div className="min-h-screen flex flex-col">
            {/* Navigation Bar */}
            <nav className=" px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 md:grid md:grid-cols-[auto_1fr_auto]">
                    <Link href="/" className="flex items-center shrink-0">
                        <Image
                            src="/logo/logo-header-transparent.png"
                            alt="West Coast Conference Lay Organization"
                            width={56}
                            height={56}
                            className="h-14 w-14 object-contain"
                            priority
                        />
                    </Link>

                    <Nav />

                    {/* spacer to balance the logo column so the nav links stay visually centered (desktop only) */}
                    <div className="hidden md:block w-14" aria-hidden="true" />
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-[#0A1F44] text-white px-6 py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Top row: org name, contact, social */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-white/10">
                        <p
                            className="text-white"
                            style={{ fontFamily: "var(--font-fraunces), serif", fontSize: '1.25rem', fontWeight: 700 }}
                        >
                            West Coast Conference Lay Organization
                        </p>

                        <div className="flex items-center gap-6">
                            <a
                                href="mailto:info@wcclo.org"
                                className="text-white/80 hover:text-[#C9A84C] transition-colors text-sm"
                            >
                                Contact Us
                            </a>

                            <a
                                href="https://www.facebook.com/WestCoastLay/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Follow us on Facebook"
                                className="text-white/80 hover:text-[#C9A84C] transition-colors"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Middle row: quick links */}
                    <div className="py-8 border-b border-white/10">
                        <h4
                            className="text-[#C9A84C] mb-4 text-center md:text-left"
                            style={{ fontFamily: "var(--font-fraunces), serif" }}
                        >
                            Quick Links
                        </h4>
                        <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
                            <Link href="/" className="text-white/80 hover:text-[#C9A84C] transition-colors text-sm">Home</Link>
                            <Link href="/about" className="text-white/80 hover:text-[#C9A84C] transition-colors text-sm">About</Link>
                            <Link href="/officers" className="text-white/80 hover:text-[#C9A84C] transition-colors text-sm">Officers</Link>
                            <Link href="/churches" className="text-white/80 hover:text-[#C9A84C] transition-colors text-sm">Churches</Link>
                            <Link href="/districtsLanding" className="text-white/80 hover:text-[#C9A84C] transition-colors text-sm">Districts</Link>
                            <Link href="/events" className="text-white/80 hover:text-[#C9A84C] transition-colors text-sm">Events</Link>
                            <Link href="/gallery" className="text-white/80 hover:text-[#C9A84C] transition-colors text-sm">Gallery</Link>
                            <Link href="/resources" className="text-white/80 hover:text-[#C9A84C] transition-colors text-sm">Resources</Link>
                        </div>
                    </div>

                    {/* Bottom row: tagline, copyright, credit */}
                    <div className="pt-8 text-center">
                        <p className="text-[#C9A84C]" style={{ fontFamily: "var(--font-fraunces), serif", fontSize: '1.125rem' }}>
                            As Lay Persons Working With God...
                        </p>
                        <p className="text-white/60 text-sm mt-2">
                            © 2026 West Coast Conference Lay Organization. All rights reserved.
                        </p>
                        <p className="text-white/40 text-xs mt-4">
                            Website by{' '}
                            <a
                                href="https://causeyinnovations.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[#C9A84C] transition-colors"
                            >
                                Causey Innovations LLC
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
        </body>
        </html>
    );
}
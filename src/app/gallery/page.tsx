import type { Metadata } from 'next';
import { client } from '@/sanity/client';
import { YearSection } from './GalleryLightbox';

export const revalidate = 30;

export const metadata: Metadata = {
    title: 'Gallery | West Coast Conference Lay Organization',
    description: 'Photos from West Coast Conference Lay Organization events, conferences, and activities.',
};

const GALLERY_QUERY = `*[_type == "galleryImage"] | order(order asc){"url": image.asset->url, label, alt, year}`;

type GalleryImage = { url: string; label?: string; alt: string; year?: number };

// Years at or after this stay expanded by default; everything older starts collapsed.
const DEFAULT_OPEN_FROM_YEAR = 2024;

function groupByYear(images: GalleryImage[]) {
    const groups = new Map<number, GalleryImage[]>();
    const noYear: GalleryImage[] = [];

    for (const image of images) {
        if (typeof image.year === 'number') {
            const list = groups.get(image.year) ?? [];
            list.push(image);
            groups.set(image.year, list);
        } else {
            noYear.push(image);
        }
    }

    // Most recent year first
    const sortedYears = Array.from(groups.keys()).sort((a, b) => b - a);
    return { sortedYears, groups, noYear };
}

export default async function Gallery() {
    const images: GalleryImage[] = await client.fetch(GALLERY_QUERY, {}, { next: { revalidate: 30 } });
    const { sortedYears, groups, noYear } = groupByYear(images);

    return (
        <div className="bg-white">
            {/* Page Header */}
            <section className="bg-[#0A1F44] px-6 py-16">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-white mb-4" style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: '3rem',
                        fontWeight: 700
                    }}>
                        Conference Gallery
                    </h1>
                    <p className="text-[#C9A84C]" style={{ fontSize: '1.25rem' }}>
                        Moments from Across the West Coast Conference
                    </p>
                </div>
            </section>

            {/* Gallery Grid, grouped by year, older years collapsed */}
            <section className="px-6 py-16">
                <div className="max-w-7xl mx-auto">
                    {images?.length ? (
                        <div className="space-y-12">
                            {noYear.length > 0 && (
                                <YearSection year="More Photos" images={noYear} defaultOpen={true} />
                            )}
                            {sortedYears.map((year) => (
                                <YearSection
                                    key={year}
                                    year={year}
                                    images={groups.get(year)!}
                                    defaultOpen={year >= DEFAULT_OPEN_FROM_YEAR}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg">
                                Photos are coming soon — check back for highlights from our conference.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
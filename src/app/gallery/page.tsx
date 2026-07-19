import type { Metadata } from 'next';
import Image from 'next/image';
import { client } from '@/sanity/client';

export const revalidate = 30;

export const metadata: Metadata = {
    title: 'Gallery | West Coast Conference Lay Organization',
    description: 'Photos from West Coast Conference Lay Organization events, conferences, and activities.',
};

const GALLERY_QUERY = `*[_type == "galleryImage"] | order(order asc){"url": image.asset->url, label, alt}`;

type GalleryImage = { url: string; label?: string; alt: string };

export default async function Gallery() {
    const images: GalleryImage[] = await client.fetch(GALLERY_QUERY, {}, { next: { revalidate: 30 } });

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

            {/* Gallery Grid */}
            <section className="px-6 py-16">
                <div className="max-w-7xl mx-auto">
                    {images?.length ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {images.map((image, idx) => (
                                <div key={idx} className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                                    <Image
                                        src={image.url}
                                        alt={image.alt}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                    {image.label && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0A1F44]/90 to-transparent px-4 py-3">
                                            <p className="text-white" style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                                                {image.label}
                                            </p>
                                        </div>
                                    )}
                                </div>
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
'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { client } from '@/sanity/client';
import type { GalleryPhoto } from './Getdistrictfulldata';

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
    projectId && dataset
        ? createImageUrlBuilder({ projectId, dataset }).image(source)
        : null;

interface DistrictCarouselProps {
    photos: GalleryPhoto[];
    districtName: string;
}

export default function DistrictCarousel({ photos, districtName }: DistrictCarouselProps) {
    const [index, setIndex] = useState(0);

    if (photos.length === 0) return null;

    const go = (delta: number) => {
        setIndex((prev) => (prev + delta + photos.length) % photos.length);
    };

    const current = photos[index];
    const currentUrl = urlFor(current.image)?.width(1200).height(700).url();

    return (
        <section className="px-6 py-20 bg-white">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-[#0A1F44]" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.25rem', fontWeight: 700 }}>
                        {districtName} in Action
                    </h2>
                </div>

                <div className="relative rounded-xl overflow-hidden" style={{ height: '480px', backgroundColor: '#0A1F44' }}>
                    {currentUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={currentUrl} alt={current.alt || districtName} className="w-full h-full object-cover" />
                    )}

                    {current.label && (
                        <div
                            className="absolute bottom-0 left-0 right-0 px-6 py-4"
                            style={{ background: 'linear-gradient(0deg, rgba(10,31,68,0.85) 0%, rgba(10,31,68,0) 100%)' }}
                        >
                            <p className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: 600 }}>
                                {current.label}
                            </p>
                        </div>
                    )}

                    {photos.length > 1 && (
                        <>
                            <button
                                onClick={() => go(-1)}
                                aria-label="Previous photo"
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5 text-[#0A1F44]" />
                            </button>
                            <button
                                onClick={() => go(1)}
                                aria-label="Next photo"
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-[#0A1F44]" />
                            </button>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {photos.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setIndex(i)}
                                        aria-label={`Go to photo ${i + 1}`}
                                        className="rounded-full transition-all"
                                        style={{
                                            width: i === index ? '20px' : '8px',
                                            height: '8px',
                                            backgroundColor: i === index ? '#C9A84C' : 'rgba(255,255,255,0.6)',
                                        }}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}